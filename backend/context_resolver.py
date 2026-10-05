import re

FOLLOW_UP_PATTERNS = [
    r"^how does it\b",
    r"^how do they\b",
    r"^how does this\b",
    r"^how do i\b",
    r"^what about\b",
    r"^why is it\b",
    r"^why does it\b",
    r"^can it\b",
    r"^does it\b",
    r"^is it\b",
    r"^are they\b",
    r"^tell me more\b",
    r"^explain more\b",
    r"^what are the signs\b",
    r"^how can i\b"
]

def is_follow_up(message):
    text = message.lower().strip()

    for pattern in FOLLOW_UP_PATTERNS:
        if re.search(pattern, text):
            return True

    return False

def resolve_context(message, history):
    if not history or not is_follow_up(message):
        return message

    previous_user_messages = [
        item["message"]
        for item in history
        if item["role"] == "user"
    ]

    if not previous_user_messages:
        return message

    previous_topic = previous_user_messages[-1]

    return f"{previous_topic}. Follow-up question: {message}"