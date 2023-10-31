import json
from aws_lambda_powertools.utilities.data_classes.appsync_resolver_event import (
    AppSyncResolverEvent,
)
import boto3
import os
from mecab_function import phrases_handler
from check_words import remove_special_characters

comprehend = boto3.client('comprehend')
client = boto3.client('lambda')
# 環境変数を設定
number = os.environ['number_of_words_extracted']
max_token = os.environ['Limit_number_of_input_text']
word_length = os.environ['word_length']
stopwords = os.getenv("stop_words").split(',')

# Hàm kiểm tra độ dài tối đa cho mỗi phần văn bản
max_length_per_segment = int(max_token)

# Hàm chia văn bản thành các phần nhỏ hơn có độ dài tối đa
def split_text(text, max_length):
    segments = [text[i:i+max_length] for i in range(0, len(text), max_length)]
    return segments[0]
    
def handler(event, context):
    event: AppSyncResolverEvent = AppSyncResolverEvent(event)
    text=event.arguments.get('msg')
    print("text",text)
    texts_event = remove_special_characters(text)
    print("texts_event",texts_event)
    texts = split_text(texts_event, max_length_per_segment)
    # エラー処理用の関数
    def handle_error(e):
        return {
            'statusCode': 500,
            'error': e.__str__()
        }
    try:
        # keyphrasesを呼び出す
        response = comprehend.detect_key_phrases(Text=str(texts), LanguageCode='ja')
        print("response",response)
        # keyphrasesをソートする
        sorted_phrases = sorted(response['KeyPhrases'], key=lambda x: x['Score'], reverse=True)
        # stopwordsを除外する
        filtered_key_phrases = [phrase['Text'] for phrase in sorted_phrases if phrase['Text'] not in stopwords]
        # top_keyを取得する
        top_key = filtered_key_phrases[:int(number)]

        main_words = []
        for phrase in top_key:
            
            if len(phrase) > int(word_length):
                result = phrases_handler(phrase, ' ')
                main_words.extend(result)
            else:
                main_words.append(phrase)
        keyPhrases = ", ".join(set(main_words))
        print(keyPhrases)
        # 正常終了
        return keyPhrases
    except Exception as e:
        # エラー処理
        return handle_error(e)

# def handler(event, context):
#     print("received event:")
#     event: AppSyncResolverEvent = AppSyncResolverEvent(event)
#     text=event.arguments.get('msg')
#     result = 'Hello'+text
#     return result