# 外出先で使うための配置

外出先で使うには、以下のどちらかを選びます。

## 方法A: クラウドに置く

おすすめは、Nodeサーバーまたは静的サイト＋API関数を置けるサービスにデプロイする方法です。

必要な環境変数:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.5-pro
```

### Vercel型の配置

このフォルダは `vercel.json` と `api/ai.mjs` を含んでいます。静的ファイルはそのまま配信され、AI相談は `/api/ai` で動きます。

1. このフォルダをGitHubリポジトリへ置く
2. VercelでそのリポジトリをImport
3. Environment Variablesに `OPENAI_API_KEY` を追加
4. デプロイ後のHTTPS URLをスマホや外出先PCで開く

### Nodeサーバー型の配置

Nodeアプリを置けるサービスでは、以下で起動できます。

```bash
npm start
```

Start command:

```bash
node server.mjs
```

## 方法B: 自宅PCを起動したまま安全に中継する

クラウドへ置かず、自宅PCで `node server.mjs` を動かしたまま、VPNやトンネルサービスでアクセスする方法もあります。

この方法は自宅PCが起動している必要があります。APIキーは自宅PC側に置けるので、ブラウザへ露出しません。

## データの扱い

研究データはブラウザの `localStorage` に保存されます。つまり、外出先スマホと自宅PCでは保存領域が別です。

別端末へ移す場合:

1. 元の端末で「JSON」を書き出す
2. 別端末で左上の「読込」からJSONを読み込む

将来的に完全同期したい場合は、ログイン機能とクラウドDBを追加する必要があります。
