from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt, JWTError
import joblib
from phishing_analyzer import analyze_phishing_message
from conversation_memory import add_message, get_history, get_recent_context
from context_resolver import resolve_context
from rag_retriever import retrieve_knowledge
from rag_response import build_rag_response
from threat_detector import detect_threat_type
from incident_response import get_incident_response
from auth import authenticate_user, create_access_token, SECRET_KEY, ALGORITHM
from database import (
    save_chat,
    get_chat_history,
    save_threat_analysis,
    get_analytics
)

app = FastAPI(
    title="CyberSage",
    description="Advanced NLP Cybersecurity Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

security = HTTPBearer()

model = joblib.load("models/intent_classifier.joblib")


class LoginRequest(BaseModel):
    username: str
    password: str


class ChatRequest(BaseModel):
    message: str
    session_id: str


class PhishingRequest(BaseModel):
    message: str


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if not username or not isinstance(username, str):
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        return username

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


@app.get("/")
def root():
    return {
        "message": "CyberSage API is running",
        "status": "online"
    }


@app.post("/login")
def login(request: LoginRequest):
    user = authenticate_user(
        request.username,
        request.password
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token(
        request.username
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": request.username
    }


@app.post("/chat")
def chat(
    request: ChatRequest,
    username: str = Depends(verify_token)
):
    previous_context = get_recent_context(
        request.session_id
    )

    context_text = ""

    if previous_context:
        context_text = " ".join(
            item["message"]
            for item in previous_context
            if item["role"] in ["user", "assistant"]
        )

    resolved_message = resolve_context(
        request.message,
        previous_context
    )

    rag_query = resolved_message

    if context_text:
        rag_query = context_text + " " + resolved_message

    probabilities = model.predict_proba(
        [resolved_message]
    )[0]

    intent_index = probabilities.argmax()

    intent = model.classes_[intent_index]

    confidence = float(
        probabilities[intent_index]
    )

    knowledge = retrieve_knowledge(
        rag_query,
        top_k=3
    )

    rag_response = build_rag_response(
        knowledge,
        resolved_message
    )

    analysis = analyze_phishing_message(
        request.message
    )

    threat = detect_threat_type(
        request.message
    )

    incident = get_incident_response(
        threat["threat_type"],
        request.message
    )

    add_message(
        request.session_id,
        "user",
        request.message
    )

    add_message(
        request.session_id,
        "assistant",
        rag_response
    )

    save_chat(
        request.session_id,
        "user",
        request.message
    )

    save_chat(
        request.session_id,
        "assistant",
        rag_response
    )

    if threat["threat_type"] != "unknown":
        save_threat_analysis(
            request.message,
            analysis,
            threat
        )

    return {
        "message": request.message,
        "user": username,
        "resolved_message": resolved_message,
        "intent": intent,
        "confidence": confidence,
        "response": rag_response,
        "phishing_analysis": analysis,
        "threat_detection": threat,
        "incident_response": incident
    }


@app.get("/chat-history")
def chat_history(
    session_id: str,
    username: str = Depends(verify_token)
):
    history = get_history(session_id)

    return {
        "user": username,
        "session_id": session_id,
        "history": history
    }


@app.get("/database-chat-history")
def database_chat_history(
    session_id: str,
    username: str = Depends(verify_token)
):
    history = get_chat_history(session_id)

    return {
        "user": username,
        "session_id": session_id,
        "history": history
    }


@app.get("/analytics")
def analytics(
    username: str = Depends(verify_token)
):
    data = get_analytics()

    return {
        "user": username,
        **data
    }


@app.post("/threat-intelligence")
def threat_intelligence(
    request: PhishingRequest,
    username: str = Depends(verify_token)
):
    analysis = analyze_phishing_message(
        request.message
    )

    threat = detect_threat_type(
        request.message
    )

    incident = get_incident_response(
        threat["threat_type"],
        request.message
    )

    save_threat_analysis(
        request.message,
        analysis,
        threat
    )

    return {
        "message": request.message,
        "user": username,
        "threat_type": threat["threat_type"],
        "attack_technique": threat["attack_technique"],
        "severity": threat["severity"],
        "total_indicators": threat["total_indicators"],
        "recommended_action": threat["recommended_action"],
        "threat_assessment": {
            "risk_level": analysis["risk_level"],
            "risk_score": analysis["risk_score"],
            "phishing_probability": analysis["phishing_probability"]
        },
        "threat_indicators": analysis["indicators"],
        "detected_keywords": threat["matched_indicators"],
        "url_analysis": analysis["url_analysis"],
        "incident_response": incident,
        "explanation": analysis["explanation"],
        "recommendation": analysis["recommendation"]
    }


@app.post("/incident-response")
def incident_response(
    request: PhishingRequest,
    username: str = Depends(verify_token)
):
    threat = detect_threat_type(
        request.message
    )

    result = get_incident_response(
        threat["threat_type"],
        request.message
    )

    return {
        "message": request.message,
        "user": username,
        "threat_type": threat["threat_type"],
        "attack_technique": threat["attack_technique"],
        "severity": threat["severity"],
        "recommended_action": threat["recommended_action"],
        "incident_response": result
    }