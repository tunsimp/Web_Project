import re

def is_valid_input(input_str):
    # Allow certain SQL injection bypass techniques (like ' OR 1=1 --)
    # Block only the dangerous SQL keywords (DROP, DELETE, UPDATE, etc.)
    blocked_keywords = r"\b(DROP|DELETE|UPDATE|TRUNCATE|INSERT|CREATE|ALTER|EXEC|SHUTDOWN|DROP DATABASE)\b"
    
    # If the input matches any of the blocked SQL keywords, reject it
    if re.search(blocked_keywords, input_str, re.IGNORECASE):
        return False
    
    # Allow a mix of alphanumeric characters, spaces, underscores, hyphens, and single quotes
    allowed_chars = r"^[a-zA-Z0-9_\'\- =]+$"
    
    # Check if the input contains only allowed characters
    if re.match(allowed_chars, input_str) is None:
        return False
    
    return True