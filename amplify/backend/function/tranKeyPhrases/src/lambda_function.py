import json
import os
import ctypes
import MeCab

mecabdir = os.path.join(os.getcwd(), '/var/task/.mecab')
libmecab = ctypes.cdll.LoadLibrary(os.path.join(mecabdir, 'lib/libmecab.so'))

output_format_type = 'chasen'
dicdir = os.path.join(mecabdir, 'lib/mecab/dic/ipadic')
rcfile = os.path.join(mecabdir, 'etc/mecabrc')

tagger = MeCab.Tagger('-O{} -d{} -r{}'.format(output_format_type, dicdir, rcfile))

def lambda_handler(event, context):
    try:
        morphemes = tagger.parse(event)
        response = {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'morphemes': morphemes})
        }
    except json.JSONDecodeError as e:
        response = {
            'statusCode': 400,  # HTTPに関連のエラー
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON format in the request body'})
        }
    except Exception as e:
        response = {
            'statusCode': 500,  # clientに関連のエラー
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Internal server error'})
        }
    return response
