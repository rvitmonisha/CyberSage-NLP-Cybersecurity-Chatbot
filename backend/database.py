from pymongo import MongoClient
from datetime import datetime, timezone

client = MongoClient("mongodb://localhost:27017/")

db = client["cybersage"]

chat_collection = db["chat_history"]

threat_collection = db["threat_analysis"]


def save_chat(session_id, role, message):
    chat_collection.insert_one({
        "session_id": session_id,
        "role": role,
        "message": message,
        "timestamp": datetime.now(timezone.utc)
    })


def get_chat_history(session_id):
    return list(
        chat_collection.find(
            {"session_id": session_id},
            {"_id": 0}
        ).sort("timestamp", 1)
    )


def save_threat_analysis(message, analysis, threat):
    threat_collection.insert_one({
        "message": message,
        "analysis": analysis,
        "threat_detection": threat,
        "timestamp": datetime.now(timezone.utc)
    })


def get_analytics():
    total_messages = chat_collection.count_documents({})
    total_conversations = chat_collection.count_documents({
        "role": "user"
    })

    total_threats = threat_collection.count_documents({})

    high_risk_incidents = threat_collection.count_documents({
        "analysis.risk_level": "High"
    })

    medium_risk_incidents = threat_collection.count_documents({
        "analysis.risk_level": "Medium"
    })

    low_risk_incidents = threat_collection.count_documents({
        "analysis.risk_level": "Low"
    })

    phishing_detections = threat_collection.count_documents({
        "threat_detection.threat_type": "phishing"
    })

    threat_pipeline = [
        {
            "$group": {
                "_id": "$threat_detection.threat_type",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {
                "count": -1
            }
        }
    ]

    threat_distribution = list(
        threat_collection.aggregate(threat_pipeline)
    )

    threat_distribution = [
        {
            "threat_type": item["_id"],
            "count": item["count"]
        }
        for item in threat_distribution
        if item["_id"]
    ]

    recent_threats = list(
        threat_collection.find(
            {},
            {
                "_id": 0,
                "message": 1,
                "analysis.risk_level": 1,
                "analysis.risk_score": 1,
                "threat_detection.threat_type": 1,
                "threat_detection.severity": 1,
                "timestamp": 1
            }
        ).sort(
            "timestamp",
            -1
        ).limit(10)
    )

    for item in recent_threats:
        if isinstance(item.get("timestamp"), datetime):
            item["timestamp"] = item["timestamp"].isoformat()

    return {
        "total_messages": total_messages,
        "total_conversations": total_conversations,
        "total_threats": total_threats,
        "high_risk_incidents": high_risk_incidents,
        "medium_risk_incidents": medium_risk_incidents,
        "low_risk_incidents": low_risk_incidents,
        "phishing_detections": phishing_detections,
        "threat_distribution": threat_distribution,
        "recent_threats": recent_threats
    }