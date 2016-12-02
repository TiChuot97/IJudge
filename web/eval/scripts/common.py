# this file contains several helpful utility functions that are used elsewhere
import os

# convert a string label to a boolean value for comparision
def convert_label(s):
    s = s.strip()
    if s == 'yes' or s == 'true':
        return True
    elif s == 'no' or s == 'false':
        return False
    else:
        return s

# check if two labels match or not
def label_match(a, b):
    a = convert_label(a)
    b = convert_label(b)
    if a == "" or b == "":
        return True
    if a == b:
        return True
    return False

# check if the given path exists or not
def file_exists(s):
    return os.path.isfile(s)
