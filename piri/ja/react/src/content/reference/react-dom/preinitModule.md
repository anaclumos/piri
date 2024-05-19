---
title: preinitModule
canary: true
---

<Canary>

`preinitModule` 関数は現在、React の Canary および実験的なチャンネルでのみ利用可能です。詳細は [React のリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels) をご覧ください。

</Canary>

<Note>

[React ベースのフレームワーク](/learn/start-a-new-react-project) は、リソースの読み込みを自動的に処理することが多いため、この API を自分で呼び出す必要がないかもしれません。詳細はフレームワークのドキュメントを参照してください。

</Note>

<Intro>

`preinitModule` を使用すると、ESM モジュールを事前に取得して評価することができます。

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

ESM モジュールを事前に初期化するには、`react-dom` から `preinitModule` 関数を呼び出します。

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[以下の例を参照してください。](#usage)

`preinitModule` 関数は、指定されたモジュールのダウンロードと実行を開始するようにブラウザにヒントを提供し、時間を節約できます。`preinit` したモジュールは、ダウンロードが完了すると実行されます。

#### パラメータ {/*parameters*/}

* `href`: 文字列。ダウンロードして実行したいモジュールの URL。
* `options`: オブジェクト。以下のプロパティを含みます:
  *  `as`: 必須の文字列。`'script'` でなければなりません。
  *  `crossOrigin`: 文字列。使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は `anonymous` と `use-credentials` です。
  *  `integrity`: 文字列。モジュールの暗号ハッシュで、[その真正性を確認](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)します。
  *  `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際にモジュールを許可するための暗号 [nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。

#### 戻り値 {/*returns*/}

`preinitModule` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じ `href` で `preinitModule` を複数回呼び出すと、単一の呼び出しと同じ効果があります。
* ブラウザでは、コンポーネントのレンダリング中、Effect 内、イベントハンドラ内など、どの状況でも `preinitModule` を呼び出すことができます。
* サーバーサイドレンダリングや Server Components のレンダリング時には、コンポーネントのレンダリング中またはコンポーネントのレンダリングから派生した非同期コンテキスト内で呼び出した場合にのみ `preinitModule` が効果を発揮します。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダリング時のプリロード {/*preloading-when-rendering*/}

特定のモジュールを使用することがわかっている場合、またはその子が特定のモジュールを使用することがわかっている場合に、コンポーネントのレンダリング時に `preinitModule` を呼び出します。これにより、モジュールがダウンロードされるとすぐに評価され、効果を発揮します。

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

ブラウザにモジュールをダウンロードさせたいが、すぐに実行させたくない場合は、代わりに [`preloadModule`](/reference/react-dom/preloadModule) を使用してください。ESM モジュールではないスクリプトを事前に初期化したい場合は、[`preinit`](/reference/react-dom/preinit) を使用してください。

### イベントハンドラでのプリロード {/*preloading-in-an-event-handler*/}

モジュールが必要になるページや状態に遷移する前に、イベントハンドラで `preinitModule` を呼び出します。これにより、新しいページや状態のレンダリング中に呼び出すよりも早くプロセスが開始されます。

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```