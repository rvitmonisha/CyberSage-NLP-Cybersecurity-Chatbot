# CyberSage — NLP Cybersecurity Chatbot

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python\&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react\&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![scikit--learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikit-learn\&logoColor=white)](https://scikit-learn.org/)
[![NLP](https://img.shields.io/badge/NLP-Cybersecurity-blueviolet)](https://en.wikipedia.org/wiki/Natural_language_processing)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

CyberSage is an AI-powered **Natural Language Processing (NLP) cybersecurity chatbot** designed to understand cybersecurity queries, detect potential threats, analyze phishing messages and URLs, assess security risks, retrieve relevant cybersecurity knowledge, and provide incident-response guidance.

The project combines **NLP, machine learning, RAG, threat detection, phishing analysis, URL intelligence, conversation memory, and a React dashboard** into a single cybersecurity assistant.

---

## Features

### AI Cybersecurity Assistant

* Natural language cybersecurity conversations
* Intent classification using machine learning
* Confidence scoring for detected intents
* Context-aware responses
* Conversation memory
* Cybersecurity knowledge retrieval using RAG

### Phishing Detection

* Phishing message analysis
* Suspicious URL detection
* URL shortener detection
* Urgency and social-engineering indicators
* Sensitive information request detection
* Phishing probability estimation
* Risk score generation

### Threat Detection

* Threat type classification
* Severity assessment
* Attack technique identification
* Threat indicator analysis
* Detection of common cybersecurity threats

### Incident Response

* Security incident analysis
* Recommended response actions
* Immediate containment guidance
* Recovery recommendations
* Security best practices

### Security Dashboard

* Threat analytics
* Risk overview
* Threat distribution
* Recent threat activity
* Live threat monitoring
* System status monitoring
* Automatic analytics refresh

### Chat History

* Persistent conversation storage
* Session-based chat history
* MongoDB-backed storage
* Threat analysis history

---

## System Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │   CyberSage Client   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │ NLP Intent  │      │   Phishing  │      │   Threat    │
   │ Classifier  │      │   Analyzer  │      │  Detector   │
   └─────────────┘      └─────────────┘      └─────────────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │    RAG Retriever     │
                    │ Cybersecurity KB     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Incident Response    │
                    │ & Risk Assessment    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │ Chat & Threat Data   │
                    └──────────────────────┘
```

---

## NLP Pipeline

```text
User Query
    │
    ▼
Text Processing
    │
    ▼
Intent Classification
    │
    ▼
Confidence Scoring
    │
    ├──────────────► Cybersecurity Knowledge Retrieval
    │
    ├──────────────► Phishing Analysis
    │
    ├──────────────► URL Intelligence
    │
    └──────────────► Threat Detection
                         │
                         ▼
                   Risk Assessment
                         │
                         ▼
                 Incident Response
                         │
                         ▼
                    Final Response
```

---

## Machine Learning

CyberSage uses machine learning models for cybersecurity-oriented NLP tasks.

### Intent Classification

The chatbot classifies user queries into cybersecurity-related intents using:

* TF-IDF feature extraction
* Logistic Regression
* Confidence scoring

Example intents include:

* Phishing
* Malware
* Ransomware
* Account Security
* Password Security
* Network Security
* Social Engineering
* Incident Response

### Phishing Classification

The phishing analyzer evaluates messages using trained machine learning models combined with security indicators.

The system considers signals such as:

* Suspicious links
* URL shorteners
* Urgent language
* Account threats
* Credential requests
* OTP requests
* Sensitive actions
* Social-engineering patterns

---

## RAG-Based Knowledge Retrieval

CyberSage includes a Retrieval-Augmented Generation style knowledge retrieval pipeline.

The system:

1. Processes the user's cybersecurity query.
2. Searches the cybersecurity knowledge base.
3. Retrieves relevant knowledge chunks.
4. Scores retrieved information.
5. Selects relevant security guidance.
6. Generates a focused response.

The knowledge base contains information related to:

* Phishing
* Ransomware
* Malware
* Account Security
* Network Security
* Password Security
* Social Engineering
* Incident Response

---

## Risk Assessment

CyberSage generates a security risk assessment based on detected indicators.

Example output:

```text
Risk Level: High
Risk Score: 85
Threat Type: Phishing
Attack Technique: Credential Harvesting
```

The system can identify multiple indicators within a single message and use them to calculate an overall risk level.

---

## Tech Stack

| Category         | Technologies                      |
| ---------------- | --------------------------------- |
| Frontend         | React, Vite, JavaScript           |
| Backend          | FastAPI, Python                   |
| NLP              | TF-IDF, Logistic Regression       |
| Machine Learning | scikit-learn                      |
| RAG              | Knowledge Retrieval, Vector Index |
| Database         | MongoDB                           |
| Authentication   | JWT                               |
| API              | REST                              |
| Development      | VS Code                           |
| Version Control  | Git, GitHub                       |

---

## Project Structure

```text
CyberSage/
│
├── backend/
│   ├── data/
│   │   ├── intents.csv
│   │   └── phishing_messages.csv
│   │
│   ├── knowledge_base/
│   │   ├── chunks.pkl
│   │   ├── cybersecurity.index
│   │   └── cybersecurity_knowledge.txt
│   │
│   ├── models/
│   │   ├── intent_classifier.joblib
│   │   ├── intent_classifier_backup.joblib
│   │   └── phishing_classifier.joblib
│   │
│   ├── auth.py
│   ├── build_knowledge_base.py
│   ├── context_resolver.py
│   ├── conversation_memory.py
│   ├── database.py
│   ├── incident_response.py
│   ├── main.py
│   ├── phishing_analyzer.py
│   ├── rag_response.py
│   ├── rag_retriever.py
│   ├── threat_detector.py
│   ├── train_model.py
│   ├── train_phishing_model.py
│   └── url_analyzer.py
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── .gitignore
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rvitmonisha/CyberSage-NLP-Cybersecurity-Chatbot.git
cd CyberSage-NLP-Cybersecurity-Chatbot
```

### 2. Backend Setup

Open a terminal:

```powershell
cd backend
python -m venv venv
```

Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required dependencies:

```powershell
pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Authentication

The application includes JWT-based authentication.

Example development credentials:

```text
Username: admin
Password: CyberSage@123
```

For production deployments, credentials should be stored securely using environment variables or an authentication provider.

---

## API Endpoints

| Endpoint                 | Method | Purpose                    |
| ------------------------ | ------ | -------------------------- |
| `/login`                 | POST   | User authentication        |
| `/chat`                  | POST   | NLP cybersecurity chatbot  |
| `/threat-intelligence`   | POST   | Threat analysis            |
| `/incident-response`     | POST   | Incident response guidance |
| `/database-chat-history` | GET    | Retrieve chat history      |
| `/analytics`             | GET    | Security analytics         |

FastAPI automatically provides interactive API documentation through:

```text
http://127.0.0.1:8000/docs
```

---

## Example

### Input

```text
URGENT! Your bank account will be suspended.
Click https://bit.ly/login-account to verify your password
and OTP immediately.
```

### CyberSage Analysis

```text
Risk Level: High
Risk Score: 85
Threat Type: Phishing
Attack Technique: Credential Harvesting
```

Detected indicators can include:

```text
Suspicious Link
URL Shortener
Urgent Language
Sensitive Information Request
Threat of Account Restriction
Sensitive Action Keywords
```

---

## Dashboard

The CyberSage dashboard provides a centralized view of cybersecurity activity, including:

* Total messages
* Total conversations
* Detected threats
* High-risk incidents
* Medium-risk incidents
* Low-risk incidents
* Phishing detections
* Threat distribution
* Recent threat activity
* Live monitoring status

---

## Future Improvements

Potential extensions include:

* Advanced transformer-based NLP models
* LLM-powered cybersecurity reasoning
* More comprehensive threat intelligence feeds
* Automated IOC extraction
* MITRE ATT&CK mapping
* Email security analysis
* SIEM integration
* Advanced anomaly detection
* Role-based access control
* Cloud deployment
* Automated security alerting

---

## Learning Outcomes

This project demonstrates practical implementation of:

* Natural Language Processing
* Machine Learning
* Text Classification
* Cybersecurity Threat Detection
* Phishing Detection
* Risk Assessment
* Retrieval-Augmented Knowledge Retrieval
* REST API Development
* React Frontend Development
* MongoDB Data Persistence
* JWT Authentication
* Full-Stack Application Development

---

## Project Status

**Status: Completed**

CyberSage is developed as an academic **NLP and cybersecurity mini project**, demonstrating the integration of NLP, machine learning, cybersecurity analysis, knowledge retrieval, and full-stack development.

---

## Author

**M N Monisha**

BE Computer Science and Engineering
RV Institute of Technology and Management, Bangalore

[![GitHub](https://img.shields.io/badge/GitHub-rvitmonisha-181717?logo=github\&logoColor=white)](https://github.com/rvitmonisha)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-M%20N%20Monisha-0A66C2?logo=linkedin\&logoColor=white)](https://www.linkedin.com/in/m-n-monisha)

---

## License

This project is intended for educational and academic purposes.
