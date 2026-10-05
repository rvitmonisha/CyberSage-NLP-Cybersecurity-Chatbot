from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = "cybersage-secret-key-change-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

users = {
    "admin": {
        "username": "admin",
        "password_hash": pwd_context.hash("CyberSage@123")
    }
}

def verify_password(password, password_hash):
    return pwd_context.verify(password, password_hash)

def authenticate_user(username, password):
    user = users.get(username)

    if not user:
        return None

    if not verify_password(password, user["password_hash"]):
        return None

    return user

def create_access_token(username):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": username,
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)