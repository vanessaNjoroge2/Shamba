"""
email_utils.py — sends OTP emails via Gmail SMTP.

Setup (one-time):
1. Go to myaccount.google.com → Security → 2-Step Verification → App passwords
2. Generate an app password for "Mail"
3. Add to .env:
      MAIL_EMAIL=your-gmail@gmail.com
      MAIL_PASSWORD=your-16-char-app-password
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv
load_dotenv()


def send_otp_email(to_email: str, otp_code: str, farmer_name: str) -> bool:
    """Sends a 6-digit OTP to the farmer's email.
    Returns True on success, False on failure.
    Never raises — a failed email should not crash the signup endpoint."""

    mail_user     = os.getenv("MAIL_EMAIL")
    mail_password = os.getenv("MAIL_PASSWORD")

    if not mail_user or not mail_password:
        # No email credentials configured — print to console for local dev/demo
        print(f"\n{'='*50}")
        print(f"OTP for {to_email}: {otp_code}")
        print(f"{'='*50}\n")
        return True

    subject = "Shamba — Your Verification Code"
    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #2e7d32;">Welcome to Shamba, {farmer_name}!</h2>
        <p>Your email verification code is:</p>
        <div style="
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2e7d32;
            text-align: center;
            padding: 20px;
            background: #f1f8e9;
            border-radius: 8px;
            margin: 20px 0;
        ">
            {otp_code}
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not create a Shamba account, ignore this email.</p>
        <hr/>
        <small style="color: #888;">Shamba — AI-Powered Agricultural Monitoring</small>
    </body>
    </html>
    """

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = mail_user
        msg["To"]      = to_email
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.ehlo()
            server.starttls()
            server.login(mail_user, mail_password)
            server.sendmail(mail_user, to_email, msg.as_string())

        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False