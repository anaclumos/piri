---
title: preloadModule
canary: true
---

<Canary>

`preloadModule` 関数は現在、React の Canary および実験的なチャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Note>

[React ベースのフレームワーク](/learn/start-a-new-react-project)は、リソースの読み込みを自動的に処理することが多いため、この API を自分で呼び出す必要がないかもしれません。詳細はフレームワークのドキュメントを参照してください。

</Note>

<Intro>

`preloadModule` を使用すると、使用する予定の ESM モジュールを事前にフェッチすることができます。

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

ESM モジュールを事前にロードするには、`react-dom` から `preloadModule` 関数を呼び出します。

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[以下の例を参照してください。](#usage)

`preloadModule` 関数は、指定されたモジュールのダウンロードを開始するようにブラウザにヒントを提供し、時間を節約できます。

#### パラメータ {/*parameters*/}

* `href`: 文字列。ダウンロードしたいモジュールの URL。
* `options`: オブジェクト。以下のプロパティを含みます:
  *  `as`: 必須の文字列。`'script'` でなければなりません。
  *  `crossOrigin`: 文字列。[CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)を使用します。可能な値は `anonymous` と `use-credentials` です。
  *  `integrity`: 文字列。モジュールの暗号ハッシュで、[その真正性を確認](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)します。
  *  `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際にモジュールを許可するための暗号[nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)です。

#### 戻り値 {/*returns*/}

`preloadModule` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じ `href` で `preloadModule` を複数回呼び出しても、単一の呼び出しと同じ効果があります。
* ブラウザでは、コンポーネントのレンダリング中、Effect 内、イベントハンドラ内など、どの状況でも `preloadModule` を呼び出すことができます。
* サーバーサイドレンダリングや Server Components のレンダリング時には、コンポーネントのレンダリング中またはコンポーネントのレンダリングから派生した非同期コンテキスト内で呼び出した場合にのみ `preloadModule` が効果を発揮します。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダリング時の事前ロード {/*preloading-when-rendering*/}

特定のモジュールを使用することがわかっている場合は、コンポーネントのレンダリング時に `preloadModule` を呼び出します。

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

ブラウザがモジュールをすぐに実行し始めることを望む場合（ダウンロードだけでなく）、[`preinitModule`](/reference/react-dom/preinitModule) を代わりに使用してください。ESM モジュールではないスクリプトをロードしたい場合は、[`preload`](/reference/react-dom/preload) を使用してください。

### イベントハンドラ内での事前ロード {/*preloading-in-an-event-handler*/}

モジュールが必要になるページや状態に遷移する前に、イベントハンドラ内で `preloadModule` を呼び出します。これにより、新しいページや状態のレンダリング中に呼び出すよりも早くプロセスが開始されます。

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```