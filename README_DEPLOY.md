# 🌐 ウェブサイトとして公開する方法

個人的なデータ保存の制限で「Netlify Drop」が使えない場合、以下の方法がおすすめです。どちらも無料枠が大きく、安定しています。

## 方法 1: Vercel（バーセル）を使う 【おすすめ】
「Vercel」は非常に高速で、GitHubと連携して簡単に公開できます。

1.  **GitHubに登録する**: もしまだなら、[GitHub](https://github.com/)のアカウントを作ります。
2.  **リポジトリを作成**: GitHubで「New Repository」から新しい入れ物（リポジトリ）を作り、あなたのソースコード（`index.html`など）をアップロードします。
3.  **Vercelでインポート**:
    *   [Vercel](https://vercel.com/) にアクセスし、GitHubアカウントでログインします。
    *   「Add New...」→「Project」を選択。
    *   Import Git Repository から、さっき作ったGitHubのリポジトリの「Import」ボタンを押します。
    *   設定はそのままで「Deploy」を押すだけ！

## 方法 2: GitHub Pages を使う
GitHubだけで完結させたい場合はこちら。

1.  **GitHubにアップロード**: 上記と同じく、GitHubにコードをアップロード（プッシュ）します。
2.  **設定を開く**: GitHubのリポジトリページにある「Settings」タブを開きます。
3.  **Pages設定**: 左メニューの「Pages」をクリックします。
4.  **公開設定**:
    *   Build and deployment > Source を「Deploy from a branch」にします。
    *   Branch を「main」 (または master) にして「Save」を押します。
5.  **完了**: 1〜2分待つと、ページ上部に「Your site is live at...」とURLが表示されます。

## 💡 ヒント
どちらの方法も、一度設定してしまえば、あとはPC上でコードを修正してGitHubに送る（プッシュする）だけで、自動的にサイトも更新されます！
