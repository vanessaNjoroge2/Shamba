from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

import ai_logic
import auth
import models
import schemas
from database import get_db

router = APIRouter(prefix="/api", tags=["farm"])


@router.post("/assess-farm", response_model=schemas.FarmAssessmentResponse)
def assess_farm(
    data: schemas.FarmInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    # Validate crop
    try:
        crop_type = ai_logic.validate_crop(data.crop_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Resolve region → soil/climate values (farmer never sees these)
    try:
        region_vals = ai_logic.resolve_region(data.region)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    health_status = ai_logic.predict_health(
        N=region_vals["N"],
        P=region_vals["P"],
        K=region_vals["K"],
        temperature=region_vals["temperature"],
        humidity=region_vals["humidity"],
        ph=region_vals["ph"],
        rainfall=region_vals["rainfall"],
        crop_type=crop_type,
        irrigation_level=data.irrigation_level,
        soil_moisture=data.soil_moisture,
    )

    carbon_estimate      = ai_logic.estimate_carbon(data.water_usage_litres, data.farm_size_acres)
    carbon_grade, _      = ai_logic.get_carbon_grade(carbon_estimate)
    recommendations      = ai_logic.get_recommendation(
        health_status, crop_type, carbon_estimate, data.farm_size_acres
    )

    assessment = models.Assessment(
        farmer_id          = current_user.id,
        N                  = region_vals["N"],
        P                  = region_vals["P"],
        K                  = region_vals["K"],
        temperature        = region_vals["temperature"],
        humidity           = region_vals["humidity"],
        ph                 = region_vals["ph"],
        rainfall           = region_vals["rainfall"],
        crop_type          = crop_type,
        farm_size_acres    = data.farm_size_acres,
        irrigation_level   = data.irrigation_level,
        soil_moisture      = data.soil_moisture,
        water_usage_litres = data.water_usage_litres,
        health_status      = health_status,
        carbon_estimate    = carbon_estimate,
        carbon_grade       = carbon_grade,
        recommendations    = recommendations,
        timestamp          = datetime.utcnow(),
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return schemas.FarmAssessmentResponse(
        health_status   = health_status,
        carbon_estimate = carbon_estimate,
        carbon_grade    = carbon_grade,
        recommendations = recommendations,
        timestamp       = assessment.timestamp,
    )


@router.get("/farm-history", response_model=list[schemas.FarmHistoryItem])
def farm_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    return (
        db.query(models.Assessment)
        .filter(models.Assessment.farmer_id == current_user.id)
        .order_by(desc(models.Assessment.timestamp))
        .all()
    )