import re

def remove_special_characters(text):
    # Sử dụng biểu thức chính quy để chỉ giữ lại các ký tự tiếng Anh, tiếng Nhật và dấu câu
    pattern = re.compile(r'[^a-zA-Z0-9.,!?（）「」、。” ぁ-んァ-ヶー一-龠]')
    cleaned_text = re.sub(pattern, '', text)
    return cleaned_text
