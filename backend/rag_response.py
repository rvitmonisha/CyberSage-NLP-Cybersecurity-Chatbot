def build_rag_response(knowledge, query=""):
    if not knowledge:
        return (
            "I could not find enough information in the cybersecurity "
            "knowledge base to answer this query."
        )

    relevant = [
        item
        for item in knowledge
        if item.get("score", 0) >= 0.25
    ]

    if not relevant:
        relevant = knowledge[:1]

    top = relevant[0].get("content", "").strip()

    if not top:
        return (
            "I could not find a suitable cybersecurity response "
            "for this query."
        )

    query_lower = query.lower()

    protection_words = [
        "protect",
        "prevent",
        "avoid",
        "safe",
        "secure",
        "security"
    ]

    if any(
        word in query_lower
        for word in protection_words
    ):
        sentences = top.split(".")

        selected = [
            sentence.strip()
            for sentence in sentences
            if any(
                word in sentence.lower()
                for word in [
                    "protect",
                    "avoid",
                    "verify",
                    "never",
                    "use",
                    "secure",
                    "multi-factor"
                ]
            )
        ]

        if selected:
            return " ".join(selected)

    return top