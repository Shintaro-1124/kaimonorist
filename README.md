# 🛒 かいものメモ

**ふたりで共有できる買い物メモアプリ**です。

- 足りなくなった日用品をメモすると、**パートナーのスマホにもリアルタイムで反映**されます
- 「🙋 私が買う！」ボタンで担当を宣言できるので、**ふたりとも買ってしまう事故を防げます**
- 買ったら「✅ 買った！」を押すだけ。アプリを開けばいつでも「今足りないもの」がわかります
- 購入履歴から「🔄 また必要になった」でワンタップ再追加(日用品の繰り返し購入に便利)
- スマホのホーム画面に追加すれば、普通のアプリのように使えます(PWA対応)

## 仕組み

サーバー不要の静的Webアプリです。データの共有には **Firebase Realtime Database**(Googleのサービス・無料枠で十分)を使い、アプリ本体は **GitHub Pages** で公開します。

ふたりは共通の「リストコード」(8桁の英数字)で同じリストにつながります。

---

## セットアップ手順(初回のみ・約15分)

### ① Firebase プロジェクトを作る

1. [Firebase コンソール](https://console.firebase.google.com/) に Google アカウントでログイン
2. 「プロジェクトを追加」→ プロジェクト名は何でもOK(例: `kaimono-memo`)
3. Google アナリティクスは「無効」でOK →「プロジェクトを作成」

### ② Realtime Database を作る

1. 左メニューの「構築」→「**Realtime Database**」→「データベースを作成」
2. ロケーションは `asia-southeast1`(シンガポール)を選択
3. セキュリティルールは一旦「**ロックモード**」で作成
4. 作成後、「ルール」タブを開き、以下に書き換えて「公開」を押す:

```json
{
  "rules": {
    "lists": {
      "$listId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

> **セキュリティについて**: このルールは「リストコードを知っている人なら誰でも読み書きできる」設定です。コードは8桁のランダム英数字なので推測はほぼ不可能ですが、**招待リンクやコードは家族以外に教えない**でください。個人情報やパスワードなどをメモに書くのは避けましょう。

### ③ Webアプリの設定値を取得する

1. Firebase コンソールの「プロジェクトの概要」横の ⚙️ →「プロジェクトの設定」
2. 下の方の「マイアプリ」で **ウェブアプリ(`</>` アイコン)** を追加(アプリ名は何でもOK、Hosting のチェックは不要)
3. 表示される `firebaseConfig` の値を、このリポジトリの **`firebase-config.js`** にコピーする

```js
// firebase-config.js の例
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "kaimono-memo.firebaseapp.com",
  databaseURL: "https://kaimono-memo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kaimono-memo",
  storageBucket: "kaimono-memo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
};
```

> ⚠️ `databaseURL` が表示されない場合は、Realtime Database の画面上部に表示されている URL(`https://～.firebasedatabase.app`)をコピーしてください。この項目がないとアプリが動きません。

編集したら GitHub にコミット&プッシュします(GitHub のWeb画面から直接編集してもOK)。

### ④ GitHub Pages で公開する

1. GitHub のこのリポジトリで「**Settings**」→「**Pages**」
2. 「Source」を `Deploy from a branch`、Branch を `main`(フォルダは `/ (root)`)にして保存
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` でアプリが公開されます

### ⑤ ふたりのスマホで使い始める

1. **自分のスマホ**で公開URLを開く → 名前を入力 →「新しく作る」→「はじめる」
2. ⚙️(設定)→「📤 招待リンクを送る」で **LINE などでパートナーに送る**
3. **パートナーのスマホ**でリンクを開く → 名前を入力 →「はじめる」
4. ふたりとも、ブラウザのメニューから「**ホーム画面に追加**」しておくとアプリのように使えます
   - iPhone(Safari): 共有ボタン →「ホーム画面に追加」
   - Android(Chrome): メニュー(⋮)→「ホーム画面に追加」

これで完了です! 🎉

---

## 使い方

| したいこと | 操作 |
|---|---|
| 足りないものをメモ | 画面下の入力欄に入力して「追加」 |
| 「自分が買う」と宣言 | 「🙋 私が買う!」→ 相手の画面に「◯◯が買いに行きます」と表示 |
| 買い物が済んだ | 「✅ 買った!」→ 履歴タブに移動 |
| いつもの日用品を再追加 | 履歴タブ →「🔄 また必要になった」 |
| 間違えて追加した | ✕ ボタンで削除 |

## ファイル構成

```
index.html          … アプリ本体(画面)
style.css           … デザイン
app.js              … アプリのロジック
firebase-config.js  … Firebase の設定(手順③で自分の値に書き換える)
manifest.json / sw.js / icon-*.png … PWA(ホーム画面追加)用
```
