---
script: <script>
canary: true
---

<Canary>

Reactの`<script>`への拡張は現在、Reactのcanaryおよび実験的なチャンネルでのみ利用可能です。Reactの安定版リリースでは、`<script>`は[組み込みのブラウザHTMLコンポーネント](https://react.dev/reference/react-dom/components#all-html-components)としてのみ機能します。[Reactのリリースチャンネルについてはこちら](https://react.dev/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

[組み込みのブラウザ`<script>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)を使用すると、ドキュメントにスクリプトを追加できます。

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<script>` {/*script*/}

ドキュメントにインラインまたは外部スクリプトを追加するには、[組み込みのブラウザ`<script>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)をレンダリングします。任意のコンポーネントから`<script>`をレンダリングでき、Reactは[特定のケース](#special-rendering-behavior)で対応するDOM要素をドキュメントのヘッドに配置し、同一のスクリプトを重複しないようにします。

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[以下にさらに例を示します。](#usage)

#### Props {/*props*/}

`<script>`はすべての[共通要素のprops](/reference/react-dom/components/common#props)をサポートします。

* `children`: 文字列。インラインスクリプトのソースコード。
* `src`: 文字列。外部スクリプトのURL。

その他のサポートされているprops:

* `async`: ブール値。ブラウザがスクリプトの実行をドキュメントの他の部分が処理されるまで遅延させることを許可します。パフォーマンスのために推奨される動作です。
* `crossOrigin`: 文字列。[CORSポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)を使用します。可能な値は`anonymous`と`use-credentials`です。
* `fetchPriority`: 文字列。複数のスクリプトを同時にフェッチする際に、ブラウザがスクリプトの優先順位をランク付けすることを許可します。`"high"`、`"low"`、または`"auto"`（デフォルト）です。
* `integrity`: 文字列。スクリプトの暗号ハッシュで、[その真正性を検証](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)します。
* `noModule`: ブール値。ESモジュールをサポートするブラウザでスクリプトを無効にします。これにより、サポートしていないブラウザのためのフォールバックスクリプトが可能になります。
* `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際にリソースを許可するための暗号[nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)です。
* `referrer`: 文字列。スクリプトをフェッチする際に送信する[Refererヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy)を指定します。
* `type`: 文字列。スクリプトが[クラシックスクリプト、ESモジュール、またはインポートマップ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type)のいずれであるかを指定します。

Reactの[スクリプトの特別な処理](#special-rendering-behavior)を無効にするprops:

* `onError`: 関数。スクリプトの読み込みに失敗したときに呼び出されます。
* `onLoad`: 関数。スクリプトの読み込みが完了したときに呼び出されます。

Reactでの使用が**推奨されない**props:

* `blocking`: 文字列。`"render"`に設定すると、スクリプトシートが読み込まれるまでブラウザにページのレンダリングを指示しません。ReactはSuspenseを使用してより細かい制御を提供します。
* `defer`: 文字列。ドキュメントの読み込みが完了するまでブラウザがスクリプトを実行しないようにします。ストリーミングサーバーレンダリングコンポーネントとは互換性がありません。代わりに`async`プロップを使用してください。

#### 特別なレンダリング動作 {/*special-rendering-behavior*/}

Reactは`<script>`コンポーネントをドキュメントの`<head>`に移動し、同一のスクリプトを重複しないようにし、スクリプトの読み込み中に[サスペンド](/reference/react/Suspense)することができます。

この動作を有効にするには、`src`および`async={true}`プロップを提供します。Reactは同じ`src`を持つスクリプトを重複しないようにします。スクリプトを安全に移動するためには、`async`プロップがtrueである必要があります。

`onLoad`または`onError`プロップのいずれかを提供する場合、特別な動作はありません。これらのプロップは、コンポーネント内でスクリプトの読み込みを手動で管理していることを示しているためです。

この特別な処理には2つの注意点があります:

* スクリプトがレンダリングされた後にプロップの変更を無視します。（開発中にこれが発生すると、Reactは警告を発します。）
* スクリプトをレンダリングしたコンポーネントがアンマウントされた後でも、スクリプトをDOMに残す場合があります。（スクリプトはDOMに挿入されたときに一度だけ実行されるため、これは影響しません。）

---

## 使用法 {/*usage*/}

### 外部スクリプトのレンダリング {/*rendering-an-external-script*/}

特定のスクリプトに依存して正しく表示されるコンポーネントがある場合、そのコンポーネント内で`<script>`をレンダリングできます。

`src`および`async`プロップを提供すると、スクリプトの読み込み中にコンポーネントがサスペンドされます。Reactは同じ`src`を持つスクリプトを重複しないようにし、複数のコンポーネントがそれをレンダリングしてもDOMに1つだけ挿入します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
スクリプトを使用する場合、[preinit](/reference/react-dom/preinit)関数を呼び出すことが有益です。この関数を呼び出すことで、たとえば[HTTP Early Hintsレスポンス](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)を送信することにより、ブラウザがスクリプトを`<script>`コンポーネントをレンダリングするよりも早くフェッチを開始できる場合があります。
</Note>

### インラインスクリプトのレンダリング {/*rendering-an-inline-script*/}

インラインスクリプトを含めるには、スクリプトのソースコードを子として持つ`<script>`コンポーネントをレンダリングします。インラインスクリプトは重複しないようにされず、ドキュメントの`<head>`に移動されません。また、外部リソースを読み込まないため、コンポーネントがサスペンドすることはありません。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>