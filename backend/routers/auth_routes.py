import random
import string
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import auth
import models
import schemas
from database import get_db
from email_utils import send_otp_email

router = APIRouter(prefix="/api/auth", tags=["auth"])


def generate_otp() -> str:
    """Generates a secure 6-digit numeric OTP."""
    return "".join(random.choices(string.digits, k=6))


@router.post("/signup", response_model=schemas.MessageResponse)
def signup(user_in: schemas.UserSignup, db: Session = Depends(get_db)):
    # Check email not already registered
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create account (unverified)
    user = models.User(
        name            = user_in.name,
        email           = user_in.email,
        hashed_password = auth.hash_password(user_in.password),
        is_verified     = False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate and save OTP (expires in 10 minutes)
    code = generate_otp()
    otp  = models.OTPCode(
        email      = user_in.email,
        code       = code,
        expires_at = datetime.utcnow() + timedelta(minutes=10),
        used       = False,
    )
    db.add(otp)
    db.commit()

    # Send OTP email (falls back to console print if no email credentials)
    send_otp_email(user_in.email, code, user_in.name)

    return schemas.MessageResponse(
        message=f"Account created. A verification code has been sent to {user_in.email}"
    )


@router.post("/verify-otp", response_model=schemas.Token)
def verify_otp(data: schemas.OTPVerify, db: Session = Depends(get_db)):
    # Find the most recent unused, unexpired OTP for this email
    otp = (
        db.query(models.OTPCode)
        .filter(
            models.OTPCode.email == data.email,
            models.OTPCode.used  == False,
            models.OTPCode.expires_at > datetime.utcnow(),
        )
        .order_by(models.OTPCode.id.desc())
        .first()
    )

    if not otp or otp.code != data.code:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")

    # Mark OTP as used
    otp.used = True
    db.commit()

    # Mark user as verified
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_verified = True
    db.commit()

    # Return token so farmer is logged in immediately after verifying
    token = auth.create_access_token({"sub": str(user.id)})
    return schemas.Token(access_token=token)


@router.post("/resend-otp", response_model=schemas.MessageResponse)
def resend_otp(email: str, db: Session = Depends(get_db)):
    """Resends a fresh OTP — useful if the farmer didn't receive the first one."""
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No account found with that email")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email is already verified")

    # Invalidate all previous OTPs for this email
    db.query(models.OTPCode).filter(models.OTPCode.email == email).update({"used": True})
    db.commit()

    # Generate fresh OTP
    code = generate_otp()
    otp  = models.OTPCode(
        email      = email,
        code       = code,
        expires_at = datetime.utcnow() + timedelta(minutes=10),
        used       = False,
    )
    db.add(otp)
    db.commit()

    send_otp_email(email, code, user.name)
    return schemas.MessageResponse(message=f"A new verification code has been sent to {email}")


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Block login for unverified accounts
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please check your email for the verification code.",
        )

    token = auth.create_access_token({"sub": str(user.id)})
    return schemas.Token(access_token=token)