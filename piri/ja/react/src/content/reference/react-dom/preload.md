---
title: preload
canary: true
---

<Canary>

`preload`関数は現在、ReactのCanaryおよび実験的なチャンネルでのみ利用可能です。[Reactのリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Note>

[Reactベースのフレームワーク](/learn/start-a-new-react-project)は、リソースの読み込みを自動的に処理することが多いため、このAPIを自分で呼び出す必要がないかもしれません。詳細はフレームワークのドキュメントを参照してください。

</Note>

<Intro>

`preload`を使用すると、スタイルシート、フォント、外部スクリプトなどのリソースを事前に取得することができます。

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preload(href, options)` {/*preload*/}

リソースを事前に読み込むには、`react-dom`から`preload`関数を呼び出します。

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[以下の例を参照してください。](#usage)

`preload`関数は、指定されたリソースのダウンロードを開始するようにブラウザにヒントを提供し、時間を節約することができます。

#### パラメータ {/*parameters*/}

* `href`: 文字列。ダウンロードしたいリソースのURL。
* `options`: オブジェクト。以下のプロパティを含みます:
  *  `as`: 必須の文字列。リソースの種類。[可能な値](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as)は`audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video`、`worker`。
  *  `crossOrigin`: 文字列。[CORSポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)を使用します。可能な値は`anonymous`と`use-credentials`です。`as`が`"fetch"`に設定されている場合に必要です。
  *  `referrerPolicy`: 文字列。取得時に送信する[Referrerヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy)。可能な値は`no-referrer-when-downgrade`（デフォルト）、`no-referrer`、`origin`、`origin-when-cross-origin`、`unsafe-url`。
  *  `integrity`: 文字列。リソースの暗号学的ハッシュで、[その真正性を確認](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)します。
  *  `type`: 文字列。リソースのMIMEタイプ。
  *  `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際にリソースを許可するための暗号学的[nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
  *  `fetchPriority`: 文字列。リソースの取得に対する相対的な優先度を示唆します。可能な値は`auto`（デフォルト）、`high`、`low`。
  *  `imageSrcSet`: 文字列。`as: "image"`の場合のみ使用します。画像の[ソースセット](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。
  *  `imageSizes`: 文字列。`as: "image"`の場合のみ使用します。画像の[サイズ](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。

#### 戻り値 {/*returns*/}

`preload`は何も返しません。

#### 注意点 {/*caveats*/}

* `preload`の複数の同等の呼び出しは、単一の呼び出しと同じ効果を持ちます。`preload`の呼び出しは、以下のルールに従って同等と見なされます:
  * `href`が同じ場合、2つの呼び出しは同等です。ただし:
  * `as`が`image`に設定されている場合、`href`、`imageSrcSet`、および`imageSizes`が同じであれば、2つの呼び出しは同等です。
* ブラウザでは、コンポーネントのレンダリング中、Effect内、イベントハンドラ内など、どの状況でも`preload`を呼び出すことができます。
* サーバーサイドレンダリングやServer Componentsのレンダリング時には、コンポーネントのレンダリング中またはコンポーネントのレンダリングから始まる非同期コンテキスト内で呼び出した場合にのみ`preload`が効果を持ちます。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダリング時の事前読み込み {/*preloading-when-rendering*/}

特定のリソースを使用することがわかっている場合、コンポーネントのレンダリング時に`preload`を呼び出します。

<Recipes titleText="事前読み込みの例">

#### 外部スクリプトの事前読み込み {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

ブラウザがスクリプトをすぐに実行し始めることを望む場合（ダウンロードだけでなく）、代わりに[`preinit`](/reference/react-dom/preinit)を使用してください。ESMモジュールを読み込みたい場合は、[`preloadModule`](/reference/react-dom/preloadModule)を使用してください。

<Solution />

#### スタイルシートの事前読み込み {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

スタイルシートをすぐにドキュメントに挿入したい場合（つまり、ブラウザがダウンロードだけでなくすぐに解析を開始することを意味します）、代わりに[`preinit`](/reference/react-dom/preinit)を使用してください。

<Solution />

#### フォントの事前読み込み {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

スタイルシートを事前に読み込む場合、そのスタイルシートが参照するフォントも事前に読み込むのが賢明です。そうすることで、ブラウザはスタイルシートをダウンロードして解析する前にフォントのダウンロードを開始できます。

<Solution />

#### 画像の事前読み込み {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

画像を事前に読み込む場合、`imageSrcSet`および`imageSizes`オプションは、ブラウザが[画面のサイズに適した画像を取得する](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)のに役立ちます。

<Solution />

</Recipes>

### イベントハンドラでの事前読み込み {/*preloading-in-an-event-handler*/}

外部リソースが必要になるページや状態に遷移する前に、イベントハンドラで`preload`を呼び出します。これにより、新しいページや状態のレンダリング中に呼び出すよりも早くプロセスが開始されます。

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>ウィザードを開始</button>
  );
}
```