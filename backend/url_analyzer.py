import re
from urllib.parse import urlparse

SUSPICIOUS_TLDS = {
    ".xyz",
    ".top",
    ".click",
    ".buzz",
    ".work",
    ".zip",
    ".mov",
    ".tk",
    ".ml",
    ".ga",
    ".cf",
    ".gq"
}

SHORTENERS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "is.gd",
    "ow.ly",
    "buff.ly",
    "cutt.ly",
    "rb.gy"
}

def extract_urls(message):
    return re.findall(
        r"https?://[^\s]+|www\.[^\s]+",
        message
    )

def analyze_url(url):
    original_url = url

    if url.startswith("www."):
        url = "http://" + url

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    hostname = hostname.lower()

    indicators = []
    score = 0

    if parsed.scheme == "http":
        indicators.append("Uses HTTP instead of HTTPS")
        score += 10

    if re.match(
        r"^(?:\d{1,3}\.){3}\d{1,3}$",
        hostname
    ):
        indicators.append("Uses an IP address instead of a domain")
        score += 30

    if hostname in SHORTENERS:
        indicators.append("Uses a URL shortening service")
        score += 25

    if "@" in url:
        indicators.append("Contains an @ symbol that may hide the destination")
        score += 25

    if hostname.count(".") >= 3:
        indicators.append("Contains multiple subdomains")
        score += 15

    if any(hostname.endswith(tld) for tld in SUSPICIOUS_TLDS):
        indicators.append("Uses a suspicious top-level domain")
        score += 20

    if len(url) > 100:
        indicators.append("Unusually long URL")
        score += 10

    if re.search(
        r"%[0-9a-fA-F]{2}|%[0-9a-fA-F]{2}%[0-9a-fA-F]{2}",
        url
    ):
        indicators.append("Contains URL encoding or obfuscation")
        score += 15

    if re.search(
        r"(login|verify|account|secure|update|password|bank|wallet)",
        url,
        re.IGNORECASE
    ):
        indicators.append("Contains sensitive-action keywords")
        score += 15

    score = min(score, 100)

    if score >= 60:
        risk_level = "High"
    elif score >= 30:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "url": original_url,
        "domain": hostname,
        "risk_level": risk_level,
        "risk_score": score,
        "indicators": indicators
    }

def analyze_urls(message):
    urls = extract_urls(message)

    results = []

    for url in urls:
        results.append(
            analyze_url(url)
        )

    if not results:
        return {
            "urls_found": 0,
            "results": []
        }

    overall_score = max(
        result["risk_score"]
        for result in results
    )

    if overall_score >= 60:
        overall_risk = "High"
    elif overall_score >= 30:
        overall_risk = "Medium"
    else:
        overall_risk = "Low"

    return {
        "urls_found": len(results),
        "overall_risk": overall_risk,
        "overall_score": overall_score,
        "results": results
    }