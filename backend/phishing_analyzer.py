import re
import joblib
from url_analyzer import analyze_urls

model = joblib.load("models/phishing_classifier.joblib")

def analyze_phishing_message(message):
    probabilities = model.predict_proba([message])[0]
    classes = model.classes_

    phishing_index = list(classes).index("phishing")
    phishing_probability = float(probabilities[phishing_index])

    text = message.lower()
    indicators = []
    indicator_score = 0

    if re.search(r"https?://|www\.", text):
        indicators.append("Contains a suspicious link")
        indicator_score += 20

    if re.search(
        r"(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|ow\.ly|buff\.ly)",
        text
    ):
        indicators.append("Uses a URL shortening service")
        indicator_score += 15

    if any(
        phrase in text
        for phrase in [
            "urgent",
            "immediately",
            "act now",
            "hurry",
            "final warning",
            "within 24 hours",
            "within 48 hours",
            "last chance"
        ]
    ):
        indicators.append("Urgent or pressuring language")
        indicator_score += 20

    if any(
        word in text
        for word in [
            "password",
            "otp",
            "pin",
            "credentials",
            "login",
            "username",
            "banking information",
            "card number",
            "cvv",
            "security code"
        ]
    ):
        indicators.append("Request for sensitive information")
        indicator_score += 25

    if any(
        word in text
        for word in [
            "suspended",
            "blocked",
            "closed",
            "cancelled",
            "locked",
            "deactivated",
            "lose access",
            "account will be disabled"
        ]
    ):
        indicators.append("Threat of account restriction")
        indicator_score += 20

    if any(
        word in text
        for word in [
            "prize",
            "winner",
            "reward",
            "refund",
            "cash reward",
            "lottery",
            "you have won",
            "free gift"
        ]
    ):
        indicators.append("Unexpected reward or financial offer")
        indicator_score += 15

    if any(
        phrase in text
        for phrase in [
            "dear customer",
            "dear user",
            "dear account holder",
            "security team",
            "support team",
            "verify your identity",
            "confirm your account"
        ]
    ):
        indicators.append("Possible impersonation or identity verification request")
        indicator_score += 15

    if any(
        word in text
        for word in [
            "attachment",
            "attached file",
            "download the file",
            "open the document",
            "enable macros",
            ".exe",
            ".zip",
            ".scr"
        ]
    ):
        indicators.append("Suspicious attachment or file request")
        indicator_score += 20

    if any(
        phrase in text
        for phrase in [
            "click here",
            "click the link",
            "verify now",
            "login here",
            "update your account",
            "download now",
            "open the link",
            "confirm now"
        ]
    ):
        indicators.append("Requests a potentially risky action")
        indicator_score += 15

    url_analysis = analyze_urls(message)

    if url_analysis["urls_found"] > 0:
        for result in url_analysis["results"]:
            for url_indicator in result["indicators"]:
                if url_indicator not in indicators:
                    indicators.append(url_indicator)

        indicator_score += min(
            url_analysis["overall_score"],
            30
        )

    ml_score = phishing_probability * 100

    risk_score = round(
        (ml_score * 0.6) +
        (min(indicator_score, 100) * 0.4)
    )

    risk_score = min(risk_score, 100)

    if risk_score >= 75:
        risk_level = "High"
        recommendation = (
            "Do not click links, open attachments, share credentials, "
            "or respond. Verify the sender through an official channel."
        )
    elif risk_score >= 40:
        risk_level = "Medium"
        recommendation = (
            "Be cautious. Do not provide sensitive information and "
            "verify the sender before taking any action."
        )
    else:
        risk_level = "Low"
        recommendation = (
            "No major threat detected, but continue following "
            "safe cybersecurity practices."
        )

    if indicators:
        explanation = (
            "The message contains: "
            + ", ".join(indicators)
            + "."
        )
    else:
        explanation = "No major suspicious indicators were detected."

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "phishing_probability": round(phishing_probability, 4),
        "indicators": indicators,
        "indicator_score": min(indicator_score, 100),
        "url_analysis": url_analysis,
        "explanation": explanation,
        "recommendation": recommendation
    }