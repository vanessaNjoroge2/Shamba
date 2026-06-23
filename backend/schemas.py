from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# ── Auth ───────────────────────────────────────────────────────────────────────

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Farm assessment ────────────────────────────────────────────────────────────

class FarmInput(BaseModel):
    # Region dropdown — backend resolves to soil/climate values silently
    region: str = Field(description="One of: Nairobi, Central Kenya, Rift Valley, Western Kenya, Coast, Eastern Kenya")

    # Crop context fields
    crop_type:        str = Field(description="One of: maize, beans, wheat, rice, sorghum, cassava, potato, tomato, coffee, tea")
    irrigation_level: str = Field(description="low / medium / high")
    soil_moisture:    str = Field(description="dry / moderate / wet")

    # Carbon formula inputs
    farm_size_acres:    float = Field(description="Farm size in acres")
    water_usage_litres: float = Field(default=0, description="Water used in litres")


class FarmAssessmentResponse(BaseModel):
    health_status:   str
    carbon_estimate: float
    carbon_grade:    str
    recommendations: str
    timestamp:       datetime


class FarmHistoryItem(BaseModel):
    crop_type:        str
    farm_size_acres:  float
    irrigation_level: str
    soil_moisture:    str
    health_status:    str
    carbon_estimate:  float
    carbon_grade:     str
    recommendations:  str
    timestamp:        datetime

    class Config:
        from_attributes = True