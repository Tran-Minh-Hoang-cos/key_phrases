import json
import os
import ctypes
import MeCab
#モデルと辞書のディレクトリ定義
mecabdir = os.path.join(os.getcwd(), '/var/task/.mecab')
libmecab = ctypes.cdll.LoadLibrary(os.path.join(mecabdir, 'lib/libmecab.so'))

output_format_type = 'chasen'
dicdir = os.path.join(mecabdir, 'lib/mecab/dic/ipadic')
rcfile = os.path.join(mecabdir, 'etc/mecabrc')

tagger = MeCab.Tagger('-O{} -d{} -r{}'.format(output_format_type, dicdir, rcfile))

def phrases_handler(event, context):
    text = tagger.parse(event)
    #インプットされた文書を分割
    repairText = [token for token in text.split("\n")]
    result = []
    temp_word = ''
    #普通名詞を取り出し
    for word in repairText:
        if isinstance(word, str):
            word_parts = word.split('\t')
            #隣り合った2つの名詞を結合し、ループを続ける
            if len(word_parts) > 3 and "名詞" in word_parts[3]:
                temp_word += word_parts[0]
            else:#隣り合った2つの名詞がない場合はResult配列にキャッシュデータを入れてから、削除する。
                if temp_word:
                    result.append(temp_word)
                    temp_word = ''
    if temp_word:
        result.append(temp_word)


    return result