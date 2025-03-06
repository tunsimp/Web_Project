# app/utils.py

import re

def is_valid_input(input_str):

    return re.match("^[a-zA-Z0-9_\'\- =]+$", input_str) is not None
