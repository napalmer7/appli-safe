from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client["child_safety"]
apps_collection = db["apps"]
feedback_collection = db["feedback"]

RISK_FACTORS = {
    "chat": 2.0,
    "ads": 1.5,
    "in-app purchases": 1.8,
    "violence": 2.5,
    "data collection": 2.2,
    "location tracking": 2.3,
    "multiplayer": 1.6,
    "external links": 1.7,
    "social media": 2.0,
    "unknown developer": 2.0,
}

AGE_GROUP_THRESHOLDS = {
    "2-4": 5.0,
    "5-7": 6.5,
    "8-12": 7.5,
    "13-15": 8.0,
    "16-18": 9.0
}

def calculate_risk_score(tags: list[str], age_group: str) -> float:
    score = sum(RISK_FACTORS.get(tag, 0) for tag in tags)
    return round(score, 2)

def is_appropriate(score: float, age_group: str) -> bool:
    threshold = AGE_GROUP_THRESHOLDS.get(age_group, 10.0)
    return score <= threshold

class AppData(BaseModel):
    name: str
    platforms: List[str]
    age_recommendation: str
    tags: List[str]
    risk_score: Optional[float] = None
    description: Optional[str] = None

class Feedback(BaseModel):
    app_id: str
    thumbs_up: bool
    comment: Optional[str] = None
    age_group: Optional[str] = None

@app.post("/apps/")
def add_app(app: AppData):
    risk_score = calculate_risk_score(app.tags, app.age_recommendation)
    app.risk_score = risk_score
    app_dict = app.dict()
    app_dict["is_age_appropriate"] = is_appropriate(risk_score, app.age_recommendation)
    result = apps_collection.insert_one(app_dict)
    return {"id": str(result.inserted_id), "risk_score": risk_score}

@app.get("/apps/")
def get_apps(age_group: Optional[str] = None, tag: Optional[str] = None):
    query = {}
    if age_group:
        query["age_recommendation"] = age_group
    if tag:
        query["tags"] = tag
    apps = list(apps_collection.find(query))
    for app in apps:
        app["id"] = str(app["_id"])
        del app["_id"]
    return apps

@app.post("/feedback/")
def submit_feedback(feedback: Feedback):
    app = apps_collection.find_one({"_id": ObjectId(feedback.app_id)})
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    feedback_collection.insert_one(feedback.dict())
    return {"message": "Feedback recorded"}

@app.get("/feedback/{app_id}")
def get_feedback(app_id: str):
    feedbacks = list(feedback_collection.find({"app_id": app_id}))
    for fb in feedbacks:
        fb["id"] = str(fb["_id"])
        del fb["_id"]
    return feedbacks