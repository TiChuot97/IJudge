import uuid, os

def new_file_name():
    return '__tmp_%s' % uuid.uuid4()

def remove_all_tmp_files():
    os.system('rm -f __tmp_*')

def convert_label(s):
    s = s.strip()
    if s == 'yes' or s == 'true':
        return True
    elif s == 'no' or s == 'false':
        return False
    else:
        return s

def label_match(a, b):
    a = convert_label(a)
    b = convert_label(b)
    if a == "" or b == "":
        return True
    if a == b:
        return True
    return False

def file_exists(s):
    return os.path.isfile(s)
