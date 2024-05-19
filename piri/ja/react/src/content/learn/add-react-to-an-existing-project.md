---
title: 既存のプロジェクトにReactを追加する
---

<Intro>

既存のプロジェクトにインタラクティブな要素を追加したい場合、Reactに書き直す必要はありません。既存のスタックにReactを追加し、どこにでもインタラクティブなReactコンポーネントをレンダリングできます。

</Intro>

<Note>

**ローカル開発には[Node.js](https://nodejs.org/en/)をインストールする必要があります。** オンラインやシンプルなHTMLページで[Reactを試す](/learn/installation#try-react)こともできますが、実際には開発に使用するほとんどのJavaScriptツールはNode.jsを必要とします。

</Note>

## 既存のウェブサイトのサブルート全体にReactを使用する {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

例えば、`example.com`で別のサーバーテクノロジー（Railsなど）を使用して構築された既存のウェブアプリがあり、`example.com/some-app/`で始まるすべてのルートを完全にReactで実装したいとします。

以下の手順で設定することをお勧めします：

1. **アプリのReact部分を構築する** [Reactベースのフレームワーク](/learn/start-a-new-react-project)のいずれかを使用します。
2. **フレームワークの設定で`/some-app`を*ベースパス*として指定する**（設定方法はこちら：[Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath)、[Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)）。
3. **サーバーまたはプロキシを設定する** すべての`/some-app/`以下のリクエストがReactアプリによって処理されるようにします。

これにより、アプリのReact部分がこれらのフレームワークに組み込まれた[ベストプラクティスの恩恵を受ける](/learn/start-a-new-react-project#can-i-use-react-without-a-framework)ことができます。

多くのReactベースのフレームワークはフルスタックであり、Reactアプリがサーバーの利点を活用できるようにします。ただし、サーバーでJavaScriptを実行できない場合や実行したくない場合でも、同じアプローチを使用できます。その場合、HTML/CSS/JSエクスポート（Next.jsの場合は[`next export`の出力](https://nextjs.org/docs/advanced-features/static-html-export)、Gatsbyの場合はデフォルト）を`/some-app/`で提供します。

## 既存ページの一部にReactを使用する {/*using-react-for-a-part-of-your-existing-page*/}

例えば、別のテクノロジー（Railsのようなサーバー側のものやBackboneのようなクライアント側のもの）で構築された既存のページがあり、そのページのどこかにインタラクティブなReactコンポーネントをレンダリングしたいとします。これはReactを統合する一般的な方法で、実際にはMetaでの多くのReact使用例がこの方法でした！

これを行うには2つのステップがあります：

1. **JavaScript環境を設定する** [JSX構文](/learn/writing-markup-with-jsx)を使用し、コードを[`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)構文でモジュールに分割し、[npm](https://www.npmjs.com/)パッケージレジストリからパッケージ（例えばReact）を使用できるようにします。
2. **Reactコンポーネントをページの任意の場所にレンダリングする**。

具体的なアプローチは既存のページの設定によりますので、詳細を見ていきましょう。

### ステップ1: モジュール化されたJavaScript環境を設定する {/*step-1-set-up-a-modular-javascript-environment*/}

モジュール化されたJavaScript環境では、Reactコンポーネントを個別のファイルに書くことができ、すべてのコードを1つのファイルに書く必要がありません。また、[npm](https://www.npmjs.com/)レジストリに公開されている他の開発者による素晴らしいパッケージ（React自体を含む）を使用することもできます。これを行う方法は既存の設定によります：

* **アプリがすでに`import`文を使用してファイルに分割されている場合、** 既存の設定を使用してみてください。JSコードで`<div />`を書くと構文エラーが発生するかどうかを確認してください。構文エラーが発生する場合は、[BabelでJavaScriptコードを変換](https://babeljs.io/setup)し、JSXを使用するために[Babel Reactプリセット](https://babeljs.io/docs/babel-preset-react)を有効にする必要があるかもしれません。

* **アプリにJavaScriptモジュールをコンパイルする既存の設定がない場合、** [Vite](https://vitejs.dev/)で設定します。Viteコミュニティは、Rails、Django、Laravelを含む[多くのバックエンドフレームワークとの統合](https://github.com/vitejs/awesome-vite#integrations-with-backends)を維持しています。バックエンドフレームワークがリストにない場合は、[このガイド](https://vitejs.dev/guide/backend-integration.html)に従ってViteビルドをバックエンドに手動で統合します。

設定が機能するかどうかを確認するには、プロジェクトフォルダで次のコマンドを実行します：

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

次に、メインのJavaScriptファイルの先頭に次のコード行を追加します（`index.js`や`main.js`と呼ばれるかもしれません）：

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- 既存のページコンテンツ（この例では置き換えられます） -->
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// 既存のHTMLコンテンツをクリア
document.body.innerHTML = '<div id="app"></div>';

// 代わりにReactコンポーネントをレンダリング
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

ページの全コンテンツが「Hello, world!」に置き換えられた場合、すべてが正常に動作しています！続けて読み進めてください。

<Note>

既存のプロジェクトにモジュール化されたJavaScript環境を初めて統合するのは難しいと感じるかもしれませんが、それだけの価値があります！行き詰まった場合は、[コミュニティリソース](/community)や[Vite Chat](https://chat.vitejs.dev/)を試してみてください。

</Note>

### ステップ2: ページの任意の場所にReactコンポーネントをレンダリングする {/*step-2-render-react-components-anywhere-on-the-page*/}

前のステップでは、メインファイルの先頭に次のコードを追加しました：

```js
import { createRoot } from 'react-dom/client';

// 既存のHTMLコンテンツをクリア
document.body.innerHTML = '<div id="app"></div>';

// 代わりにReactコンポーネントをレンダリング
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

もちろん、既存のHTMLコンテンツをクリアしたくはありません！

このコードを削除します。

代わりに、HTMLの特定の場所にReactコンポーネントをレンダリングしたいでしょう。HTMLページ（またはそれを生成するサーバーテンプレート）を開き、任意のタグに一意の[`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)属性を追加します。例えば：

```html
<!-- ... htmlのどこかに ... -->
<nav id="navigation"></nav>
<!-- ... さらにhtml ... -->
```

これにより、[`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)を使用してそのHTML要素を見つけ、[`createRoot`](/reference/react-dom/client/createRoot)に渡して、その中に自分のReactコンポーネントをレンダリングできます：

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>この段落はHTMLの一部です。</p>
    <nav id="navigation"></nav>
    <p>この段落もHTMLの一部です。</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: 実際にナビゲーションバーを実装する
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

`index.html`の元のHTMLコンテンツが保持されていることに注意してください。しかし、HTMLの`<nav id="navigation">`内に自分の`NavigationBar` Reactコンポーネントが表示されるようになりました。既存のHTMLページ内にReactコンポーネントをレンダリングする方法については、[`createRoot`使用ドキュメント](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)を参照してください。

既存のプロジェクトにReactを採用する際には、小さなインタラクティブコンポーネント（ボタンなど）から始めて、徐々に「上に移動」して最終的にはページ全体がReactで構築されるまで進めるのが一般的です。その時点に達した場合は、Reactの利点を最大限に活用するために、[Reactフレームワーク](/learn/start-a-new-react-project)への移行をお勧めします。

## 既存のネイティブモバイルアプリにReact Nativeを使用する {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/)も既存のネイティブアプリに段階的に統合できます。Android（JavaまたはKotlin）やiOS（Objective-CまたはSwift）の既存のネイティブアプリがある場合は、[このガイド](https://reactnative.dev/docs/integration-with-existing-apps)に従ってReact Native画面を追加します。