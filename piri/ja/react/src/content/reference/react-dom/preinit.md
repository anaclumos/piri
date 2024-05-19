---
title: preinit
canary: true
---

<Canary>

`preinit`関数は現在、ReactのCanaryおよび実験的なチャンネルでのみ利用可能です。[Reactのリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Note>

[Reactベースのフレームワーク](/learn/start-a-new-react-project)は、リソースの読み込みを自動的に処理することが多いため、このAPIを自分で呼び出す必要がないかもしれません。詳細はフレームワークのドキュメントを参照してください。

</Note>

<Intro>

`preinit`を使用すると、スタイルシートや外部スクリプトを事前に取得して評価することができます。

```js
preinit("https://example.com/script.js", {as: "style"});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

スクリプトやスタイルシートを事前に初期化するには、`react-dom`から`preinit`関数を呼び出します。

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[以下の例を参照してください。](#usage)

`preinit`関数は、指定されたリソースのダウンロードと実行を開始するようにブラウザにヒントを提供し、時間を節約することができます。`preinit`したスクリプトはダウンロードが完了すると実行されます。`preinit`したスタイルシートはドキュメントに挿入され、すぐに効果を発揮します。

#### パラメータ {/*parameters*/}

* `href`: 文字列。ダウンロードして実行したいリソースのURL。
* `options`: オブジェクト。以下のプロパティを含みます:
  *  `as`: 必須の文字列。リソースの種類。可能な値は`script`と`style`。
  * `precedence`: 文字列。スタイルシートに必要です。他のスタイルシートに対してどこに挿入するかを示します。優先度の高いスタイルシートは、優先度の低いスタイルシートを上書きできます。可能な値は`reset`、`low`、`medium`、`high`。
  *  `crossOrigin`: 文字列。[CORSポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)を使用します。可能な値は`anonymous`と`use-credentials`。`as`が`"fetch"`に設定されている場合に必要です。
  *  `integrity`: 文字列。リソースの暗号化ハッシュで、[その真正性を確認](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)します。
  *  `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する場合にリソースを許可するための暗号化[nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
  *  `fetchPriority`: 文字列。リソースの取得に対する相対的な優先度を示唆します。可能な値は`auto`（デフォルト）、`high`、`low`。

#### 戻り値 {/*returns*/}

`preinit`は何も返しません。

#### 注意点 {/*caveats*/}

* 同じ`href`で複数回`preinit`を呼び出すと、単一の呼び出しと同じ効果があります。
* ブラウザでは、コンポーネントのレンダリング中、Effect内、イベントハンドラ内など、どの状況でも`preinit`を呼び出すことができます。
* サーバーサイドレンダリングやServer Componentsのレンダリング時には、コンポーネントのレンダリング中またはコンポーネントのレンダリングから派生した非同期コンテキストで呼び出した場合にのみ`preinit`が効果を発揮します。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダリング時の事前初期化 {/*preiniting-when-rendering*/}

特定のリソースを使用することがわかっている場合、またはそのリソースがダウンロードされるとすぐに評価されて効果を発揮することを許容する場合、コンポーネントのレンダリング時に`preinit`を呼び出します。

<Recipes titleText="事前初期化の例">

#### 外部スクリプトの事前初期化 {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

ブラウザにスクリプトをダウンロードさせたいがすぐに実行させたくない場合は、代わりに[`preload`](/reference/react-dom/preload)を使用してください。ESMモジュールをロードしたい場合は、[`preinitModule`](/reference/react-dom/preinitModule)を使用してください。

<Solution />

#### スタイルシートの事前初期化 {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

必須の`precedence`オプションを使用すると、ドキュメント内のスタイルシートの順序を制御できます。優先度の高いスタイルシートは、優先度の低いスタイルシートを上書きできます。

スタイルシートをダウンロードしたいがすぐにドキュメントに挿入したくない場合は、代わりに[`preload`](/reference/react-dom/preload)を使用してください。

<Solution />

</Recipes>

### イベントハンドラでの事前初期化 {/*preiniting-in-an-event-handler*/}

外部リソースが必要になるページや状態に遷移する前に、イベントハンドラで`preinit`を呼び出します。これにより、新しいページや状態のレンダリング中に呼び出すよりも早くプロセスが開始されます。

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```