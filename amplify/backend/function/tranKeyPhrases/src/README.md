# キーワード抽出用 lambda追加手順
## 前提
- 環境：Amplify　CLI,　Docker desktop,Application on Amplify

## 手順概要


### ステップ 2:AmplifyCLIで AWSアカウントをログイン

AWS Amplify CLI を AWS アカウントの認証情報とプロジェクト設定で構成するために使用されます。

```bash
amplify configure
		? region:  ap-northeast-1
		? accessKeyId:  ********************
		? secretAccessKey:  ****************************************
```

- **AWS アクセスキー ID とシークレットアクセスキー**の指定: これらの資格情報を持っている場合は入力するか、必要な権限を持つ IAM ユーザーを作成するためのリンクに従います。
- **AWS リージョン**: Amplify プロジェクトのリソースが展開される AWS リージョンを選択します。

### ステップ 3: amplify環境を設定

AWS Amplify プロジェクトに関するクラウドの設定とリソースをローカルプロジェクトにプル（取り込み）するために使用されるコマンドです。

```bash
amplify pull --appId d1oc2bznbqprww --envName dev
		? Please choose the profile you want to use default
		Amplify AppID found: d1oc2bznbqprww. Amplify App name is: tranTest
		Backend environment dev found in Amplify Console app: tranTest
		? Choose your default editor: Visual Studio Code
		√ Choose the type of app that you're building · javascript
		Please tell us about your project
		? What javascript framework are you using react
		? Source Directory Path:  src
		? Distribution Directory Path: build
		? Build Command:  npm.cmd run-script build
		? Start Command: npm.cmd run-script start
		? Do you plan on modifying this backend? Yes
		√ Successfully pulled backend environment dev from the cloud.
```

上記のコマンドは、amplifyのバックエンドに配置されますので、活用してください。

### ステップ 4: 機能の追加

次のコマンドを使用して、プロジェクトに機能を追加します。

```bash
amplify add function
		? Select which capability you want to add: Lambda function (serverless function)
		? Provide an AWS Lambda function name: trantest247783b9
		? Choose the runtime that you want to use: Python
		Only one template found - using Hello World by default.

		✅ Available advanced settings:
		- Resource access permissions
		- Scheduled recurring invocation
		- Lambda layers configuration
		- Environment variables configuration
		- Secret values configuration

		? Do you want to configure advanced settings? No
		? Do you want to edit the local lambda function now? No
```



- **機能名**: あなたの機能に名前を付けます。
- **ハンドラ**: 言語（Node.js、Python、Javaなど）とハンドラファイルを選択します。
- **ランタイムオプション**: 必要に応じてランタイムバージョンを選択します。


機能に関する情報を提供する必要があります。そして、amplify/backend/functionのフォルダーに関数追加されます。関数のフォルダーは以下の通りです。

```bash
trantest247783b9
├── src
│   ├── event.json
│   ├── index.py
│   └── setup.py
├── amplify.state
├── custom-policies.json
├── function-parameter.json
├── pipfile
└── trantest247783b9-cloudformation*.json
```

### ステップ 5: MeCabモデルのライブラリを追加

functionの中に新しいファイルを２つ追加し、ファイル名は「docker-compose.yaml」と「requirements.txt」に変更し、それぞれのファイル内容は以下の通りに記入してください。

**docker-compose.yamlの内容**

```bash
version: '3'
services:
  trantest247783b9:
    image: lambci/lambda:build-python3.8
    environment:
      - AWS_DEFAULT_REGION=ap-northeast-1
      - LAMBDA_PACKAGE_DIR=/var/task
      - MECAB_SOURCE_URL=https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7cENtOXlicTFaRUE
      - IPADIC_SOURCE_URL=https://drive.google.com/uc?export=download&id=0B4y35FiV1wh7MWVlSDBCSXZMTXM
      - MECAB_VERSION=0.996
      - IPADIC_VERSION=2.7.0-20070801
      - LIB_MECAB_DIR_NAME=.mecab
    volumes:
      - ./function:/var/task
      - ./requirements.txt:/requirements.txt
    command: >
      /bin/sh -c '
      cd ~ &&
      curl -L $${MECAB_SOURCE_URL} -o mecab.tar.gz &&
      curl -L $${IPADIC_SOURCE_URL} -o mecab-ipadic.tar.gz &&
      tar -zxvf mecab.tar.gz && tar -zxvf mecab-ipadic.tar.gz &&
      cd ~/mecab-$${MECAB_VERSION} && 
      ./configure --prefix=$${LAMBDA_PACKAGE_DIR}/$${LIB_MECAB_DIR_NAME} --with-charset=utf8 &&
      make && make install &&
      cd ~/mecab-ipadic-$${IPADIC_VERSION} && 
      ./configure --prefix=$${LAMBDA_PACKAGE_DIR}/$${LIB_MECAB_DIR_NAME} --with-charset=utf8 --with-mecab-config=$${LAMBDA_PACKAGE_DIR}/$${LIB_MECAB_DIR_NAME}/bin/mecab-config &&
      make && make install &&
      cd ~ && pip3 install -r /requirements.txt -t $${LAMBDA_PACKAGE_DIR}'
```

- ***trantest247783b9***:functionのフォルダー名と統一的に変更するため、テストの場合は「trantest247783b9」でした。

**requirements.txtの内容**
```bash
mecab-python3
```

追加した後、フォルダーは以下の通りです。

```bash
trantest247783b9
├── src
│   ├── event.json
│   ├── index.py
│   └── setup.py
├── amplify.state
├── custom-policies.json
├── function-parameter.json
├── pipfile
├── trantest247783b9-cloudformation*.json
├── docker-compose.yaml
└── requirements.txt
```

**Container image 作成作業**
設定したDocker desktopを起動してから、Shellで管理者権限として実行します。これより、docker-compose.yamlを配置したフォルダーに移転して、以下に記載してるコマンドを入力してください。

```bash
docker-compose up
```

実行を完了したあと、kernel を再起動する必要があります。

### ステップ 6: 機能の設定

再起動したら、Amplifyの構成ファイルを編集して機能をカスタマイズできます。これには環境変数の設定が含まれます。

```bash
amplify update function
    ? Select the Lambda function you want to update tranAmplifyTest
    >Environment variables configuration

    ? Which setting do you want to update? Environment variables configuration
    ? Enter the environment variable name:number_of_words_extracted
    ? Enter the environment variable value: 3
    ? Select what you want to do with environment variables: Add new environment variable
    ? Enter the environment variable name: Limit_number_of_input_text
    ? Enter the environment variable value: 200
    ? Select what you want to do with environment variables: Add new environment variable
    ? Enter the environment variable name: word_length
    ? Enter the environment variable value: 7
    ? Select what you want to do with environment variables: Add new environment variable
    ? Enter the environment variable name: stop_words
    ? Enter the environment variable value: あれ,その,あの,この
    ? Select what you want to do with environment variables: I'm done
    ? Do you want to edit the local lambda function now? No
```

### ステップ 7: 機能のデプロイ

最後に、次のコマンドを使用して機能をAWS Lambdaにデプロイします。

```bash
	amplify push
		√ Are you sure you want to continue? (Y/n) · yes
```


### ステップ 8:  ロールに権限を付与する

AWS アクセス権限を構成するには、AWS マネジメントコンソールにアクセスし、AWS Lambda > 設定 > アクセス権限に移動します。ロール名の下にあるロールリンクをクリックし、ロールに「AWSLambda_FullAccess」および「ComprehendFullAccess」ポリシーを追加します。

***上記の作業が完了したら、キーワード抽出用 lambda追加の作業が完成だと思います***

## まとめ

このガイドでは、Amplify CLIを使用してAmplifyプロジェクトに機能を追加する方法を説明しました。Amplifyを使用してアプリケーションを開発し、機能を使用してさまざまなAWSバックエンドタスクを実行できます。


