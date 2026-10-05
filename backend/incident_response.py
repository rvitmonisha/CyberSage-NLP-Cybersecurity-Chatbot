def get_incident_response(threat_type, message):
    text = message.lower()

    if threat_type == "ransomware":
        return {
            "incident": "Possible Ransomware Attack",
            "severity": "Critical",
            "actions": [
                "Disconnect the affected device from the network.",
                "Do not pay the ransom immediately.",
                "Do not delete encrypted files or ransom notes.",
                "Identify affected systems and files.",
                "Report the incident to the organization's security team.",
                "Restore systems from clean backups if available."
            ]
        }

    if threat_type == "malware":
        return {
            "incident": "Possible Malware Infection",
            "severity": "High",
            "actions": [
                "Disconnect the affected device from the network.",
                "Run a trusted security scan.",
                "Do not open suspicious files or programs.",
                "Remove detected malicious software.",
                "Update the operating system and security software.",
                "Change important passwords after the device is secured."
            ]
        }

    if (
        "hacked" in text
        or "compromised" in text
        or "unauthorized access" in text
    ):
        return {
            "incident": "Possible Account Compromise",
            "severity": "High",
            "actions": [
                "Change the affected account password immediately.",
                "Enable multi-factor authentication.",
                "Sign out of active sessions and unknown devices.",
                "Check recent account activity.",
                "Remove unknown recovery methods or connected applications.",
                "Contact the service provider if unauthorized activity continues."
            ]
        }

    if threat_type == "phishing":
        return {
            "incident": "Possible Phishing Attempt",
            "severity": "High",
            "actions": [
                "Do not click suspicious links.",
                "Do not provide passwords, OTPs, or financial information.",
                "Verify the sender using an official communication channel.",
                "Report the suspicious message.",
                "If credentials were submitted, change the password immediately.",
                "Enable multi-factor authentication."
            ]
        }

    return {
        "incident": "No Specific Incident Detected",
        "severity": "Low",
        "actions": [
            "Continue following cybersecurity best practices.",
            "Keep software updated.",
            "Use strong unique passwords.",
            "Enable multi-factor authentication."
        ]
    }