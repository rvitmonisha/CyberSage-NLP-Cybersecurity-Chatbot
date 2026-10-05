def detect_threat_type(message):
    text = message.lower()

    ransomware_keywords = [
        "ransomware",
        "encrypted files",
        "files encrypted",
        "decrypt files",
        "ransom demand",
        "bitcoin payment",
        "pay to decrypt",
        "decrypt your files",
        "your files are encrypted"
    ]

    malware_keywords = [
        "malware",
        "virus",
        "trojan",
        "spyware",
        "keylogger",
        "worm",
        "infected computer",
        "malicious software",
        "remote access",
        "backdoor"
    ]

    phishing_keywords = [
        "phishing",
        "fake login",
        "suspicious email",
        "suspicious link",
        "otp",
        "password",
        "verify your account",
        "account suspended",
        "verify your identity",
        "click the link",
        "login here"
    ]

    credential_theft_keywords = [
        "password",
        "otp",
        "pin",
        "username",
        "credentials",
        "cvv",
        "card number",
        "banking information",
        "security code"
    ]

    social_engineering_keywords = [
        "urgent",
        "immediately",
        "act now",
        "final warning",
        "last chance",
        "your account will be closed",
        "your account will be suspended",
        "verify now"
    ]

    ransomware_matches = [
        word for word in ransomware_keywords
        if word in text
    ]

    malware_matches = [
        word for word in malware_keywords
        if word in text
    ]

    phishing_matches = [
        word for word in phishing_keywords
        if word in text
    ]

    credential_matches = [
        word for word in credential_theft_keywords
        if word in text
    ]

    social_engineering_matches = [
        word for word in social_engineering_keywords
        if word in text
    ]

    scores = {
        "ransomware": len(ransomware_matches),
        "malware": len(malware_matches),
        "phishing": len(phishing_matches)
    }

    threat_type = max(
        scores,
        key=scores.get
    )

    if scores[threat_type] == 0:
        threat_type = "unknown"

    if threat_type == "ransomware":
        attack_technique = "Ransomware Attack"
    elif threat_type == "malware":
        attack_technique = "Malware Delivery"
    elif threat_type == "phishing":
        if credential_matches:
            attack_technique = "Credential Harvesting"
        elif social_engineering_matches:
            attack_technique = "Social Engineering"
        else:
            attack_technique = "Phishing Attack"
    else:
        attack_technique = "Unknown"

    total_indicators = (
        len(ransomware_matches)
        + len(malware_matches)
        + len(phishing_matches)
        + len(credential_matches)
        + len(social_engineering_matches)
    )

    if threat_type == "ransomware":
        severity = "Critical"
    elif total_indicators >= 5:
        severity = "High"
    elif total_indicators >= 2:
        severity = "Medium"
    elif total_indicators == 1:
        severity = "Low"
    else:
        severity = "Informational"

    if severity == "Critical":
        recommended_action = (
            "Isolate the affected system, disconnect it from the network, "
            "preserve evidence, and begin incident response procedures."
        )
    elif severity == "High":
        recommended_action = (
            "Do not interact with the suspicious content. "
            "Verify the source and report the incident to the security team."
        )
    elif severity == "Medium":
        recommended_action = (
            "Exercise caution and verify the source before taking any action."
        )
    elif severity == "Low":
        recommended_action = (
            "Continue monitoring and follow standard cybersecurity practices."
        )
    else:
        recommended_action = (
            "No significant threat indicators were detected."
        )

    return {
        "threat_type": threat_type,
        "attack_technique": attack_technique,
        "severity": severity,
        "matched_indicators": {
            "ransomware": ransomware_matches,
            "malware": malware_matches,
            "phishing": phishing_matches,
            "credential_theft": credential_matches,
            "social_engineering": social_engineering_matches
        },
        "scores": scores,
        "total_indicators": total_indicators,
        "recommended_action": recommended_action
    }