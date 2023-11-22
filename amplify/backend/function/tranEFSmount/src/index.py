import sys
sys.path.append("/mnt/efs/libs/python")
from langchain.document_loaders import TextLoader
import json
import boto3


def handler(event, context):
    print(event)
    file_name = event['arguments']['file']
    print(file_name)
    bucket_name = 'tranamplifyd16c3e0dd7ff402a87d75f7765e32494141224-dev'
    object_key = f'public/{file_name}'
    local_file_path = f'/tmp/{file_name}'

    s3 = boto3.client('s3')

    try:
        s3.download_file(bucket_name, object_key, local_file_path)
        print(f"Downloaded file from S3: {local_file_path}")
        loader = TextLoader(local_file_path)
        documents = loader.load()
        for doc in documents:
            page_content = doc.page_content
            print(page_content)
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
              'statusCode': 500,
              'body': json.dumps(f'Error: {str(e)}'),
              'loader': None
        }

    return page_content