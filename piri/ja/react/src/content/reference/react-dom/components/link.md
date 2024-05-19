---
link: <link>
canary: true
---

<Canary>

Reactの`<link>`に対する拡張機能は現在、Reactのcanaryおよび実験的なチャンネルでのみ利用可能です。Reactの安定版リリースでは、`<link>`は[組み込みのブラウザHTMLコンポーネント](https://react.dev/reference/react-dom/components#all-html-components)としてのみ機能します。[Reactのリリースチャンネルについてはこちら](https://react.dev/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

[組み込みのブラウザ`<link>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)を使用すると、スタイルシートなどの外部リソースを使用したり、リンクメタデータでドキュメントに注釈を付けたりできます。

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<link>` {/*link*/}

スタイルシート、フォント、アイコンなどの外部リソースにリンクするか、リンクメタデータでドキュメントに注釈を付けるには、[組み込みのブラウザ`<link>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)をレンダリングします。どのコンポーネントからでも`<link>`をレンダリングでき、Reactは[ほとんどの場合](#special-rendering-behavior)、対応するDOM要素をドキュメントのヘッドに配置します。

```js
<link rel="icon" href="favicon.ico" />
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<link>`はすべての[共通要素のprops](/reference/react-dom/components/common#props)をサポートします。

* `rel`: 文字列、必須。リソースとの[関係を指定](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)します。Reactは`rel="stylesheet"`のリンクを他のリンクとは[異なる扱い](#special-rendering-behavior)をします。

これらのpropsは`rel="stylesheet"`の場合に適用されます：

* `precedence`: 文字列。ドキュメントの`<head>`内の他の`<link>`DOMノードに対する順位をReactに伝え、どのスタイルシートが他のスタイルシートを上書きできるかを決定します。その値は（優先順位の順に）`"reset"`、`"low"`、`"medium"`、`"high"`です。同じ優先順位のスタイルシートは、`<link>`またはインライン`<style>`タグ、または[`preload`](/reference/react-dom/preload)や[`preinit`](/reference/react-dom/preinit)関数を使用してロードされたものであっても一緒に配置されます。
* `media`: 文字列。スタイルシートを特定の[メディアクエリ](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)に制限します。
* `title`: 文字列。[代替スタイルシート](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)の名前を指定します。

これらのpropsは`rel="stylesheet"`の場合に適用されますが、Reactの[スタイルシートの特別な扱い](#special-rendering-behavior)を無効にします：

* `disabled`: ブール値。スタイルシートを無効にします。
* `onError`: 関数。スタイルシートの読み込みに失敗したときに呼び出されます。
* `onLoad`: 関数。スタイルシートの読み込みが完了したときに呼び出されます。

これらのpropsは`rel="preload"`または`rel="modulepreload"`の場合に適用されます：

* `as`: 文字列。リソースの種類。可能な値は`audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video`、`worker`です。
* `imageSrcSet`: 文字列。`as="image"`の場合にのみ適用されます。画像の[ソースセット](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。
* `imageSizes`: 文字列。`as="image"`の場合にのみ適用されます。画像の[サイズ](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。

これらのpropsは`rel="icon"`または`rel="apple-touch-icon"`の場合に適用されます：

* `sizes`: 文字列。アイコンの[サイズ](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)です。

これらのpropsはすべての場合に適用されます：

* `href`: 文字列。リンクされたリソースのURL。
* `crossOrigin`: 文字列。使用する[CORSポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は`anonymous`と`use-credentials`です。`as`が`"fetch"`に設定されている場合に必須です。
* `referrerPolicy`: 文字列。フェッチ時に送信する[Referrerヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy)。可能な値は`no-referrer-when-downgrade`（デフォルト）、`no-referrer`、`origin`、`origin-when-cross-origin`、および`unsafe-url`です。
* `fetchPriority`: 文字列。リソースのフェッチの相対的な優先順位を示唆します。可能な値は`auto`（デフォルト）、`high`、および`low`です。
* `hrefLang`: 文字列。リンクされたリソースの言語。
* `integrity`: 文字列。リソースの暗号ハッシュで、その[真正性を検証](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)します。
* `type`: 文字列。リンクされたリソースのMIMEタイプ。

Reactでの使用が**推奨されない**props：

* `blocking`: 文字列。`"render"`に設定されている場合、スタイルシートが読み込まれるまでページをレンダリングしないようにブラウザに指示します。ReactはSuspenseを使用してより細かい制御を提供します。

#### 特別なレンダリング動作 {/*special-rendering-behavior*/}

Reactは、`<link>`コンポーネントに対応するDOM要素をReactツリー内のどこにレンダリングされてもドキュメントの`<head>`内に配置します。`<head>`はDOM内で`<link>`が存在する唯一の有効な場所ですが、特定のページを表すコンポーネントが自分自身で`<link>`コンポーネントをレンダリングできると便利であり、コンポーザブルな状態を保ちます。

これにはいくつかの例外があります：

* `<link>`に`rel="stylesheet"`プロップがある場合、この特別な動作を得るためには`precedence`プロップも必要です。これは、ドキュメント内のスタイルシートの順序が重要であるため、Reactが他のスタイルシートに対してこのスタイルシートをどのように順序付けするかを知る必要があるためです。`precedence`プロップが省略された場合、特別な動作はありません。
* `<link>`に[`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop)プロップがある場合、特別な動作はありません。この場合、ドキュメントには適用されず、ページの特定の部分に関するメタデータを表すためです。
* `<link>`に`onLoad`または`onError`プロップがある場合、その場合、リンクされたリソースの読み込みをReactコンポーネント内で手動で管理しているためです。

#### スタイルシートの特別な動作 {/*special-behavior-for-stylesheets*/}

さらに、`<link>`がスタイルシートへのリンクである場合（つまり、プロップに`rel="stylesheet"`がある場合）、Reactは次の方法で特別に扱います：

* `<link>`をレンダリングするコンポーネントは、スタイルシートが読み込まれている間[サスペンド](/reference/react/Suspense)します。
* 複数のコンポーネントが同じスタイルシートへのリンクをレンダリングする場合、Reactはそれらを重複排除し、DOMに単一のリンクのみを配置します。2つのリンクは、`href`プロップが同じである場合に同じと見なされます。

この特別な動作には2つの例外があります：

* リンクに`precedence`プロップがない場合、特別な動作はありません。これは、ドキュメント内のスタイルシートの順序が重要であるため、Reactが他のスタイルシートに対してこのスタイルシートをどのように順序付けするかを知る必要があるためです。
* `onLoad`、`onError`、または`disabled`プロップのいずれかを提供する場合、特別な動作はありません。これらのプロップは、コンポーネント内でスタイルシートの読み込みを手動で管理していることを示しているためです。

この特別な扱いには2つの注意点があります：

* リンクがレンダリングされた後にプロップの変更をReactは無視します。（これが発生した場合、開発中にReactは警告を発します。）
* リンクをレンダリングしたコンポーネントがアンマウントされた後でも、ReactはリンクをDOMに残す場合があります。

---

## 使用法 {/*usage*/}

### 関連リソースへのリンク {/*linking-to-related-resources*/}

アイコン、正規URL、またはpingbackなどの関連リソースへのリンクでドキュメントに注釈を付けることができます。Reactは、Reactツリー内のどこにレンダリングされても、このメタデータをドキュメントの`<head>`内に配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### スタイルシートへのリンク {/*linking-to-a-stylesheet*/}

コンポーネントが正しく表示されるために特定のスタイルシートに依存している場合、そのスタイルシートへのリンクをコンポーネント内でレンダリングできます。コンポーネントはスタイルシートが読み込まれている間[サスペンド](/reference/react/Suspense)します。`precedence`プロップを指定する必要があります。これは、他のスタイルシートに対してこのスタイルシートをどこに配置するかをReactに伝えます。優先順位の高いスタイルシートは、優先順位の低いスタイルシートを上書きできます。

<Note>
スタイルシートを使用する場合、[preinit](/reference/react-dom/preinit)関数を呼び出すことが有益です。この関数を呼び出すことで、単に`<link>`コンポーネントをレンダリングするよりも早くブラウザがスタイルシートのフェッチを開始できる場合があります。例えば、[HTTP Early Hintsレスポンス](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)を送信することによってです。
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### スタイルシートの優先順位の制御 {/*controlling-stylesheet-precedence*/}

スタイルシートは互いに競合することがあり、その場合、ブラウザはドキュメント内で後に来るものを採用します。Reactは`precedence`プロップを使用してスタイルシートの順序を制御できます。この例では、2つのコンポーネントがスタイルシートをレンダリングし、優先順位の高い方がドキュメント内で後に来ますが、レンダリングするコンポーネントは先に来ます。

{/*FIXME: 実際には機能していないようです -- おそらくprecedenceはまだ実装されていないのでは？*/}

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### 重複排除されたスタイルシートのレンダリング {/*deduplicated-stylesheet-rendering*/}

複数のコンポーネントから同じスタイルシートをレンダリングする場合、Reactはドキュメントのヘッドに単一の`<link>`のみを配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### ドキュメント内の特定の項目にリンクで注釈を付ける {/*annotating-specific-items-within-the-document-with-links*/}

`itemProp`プロップを使用して、ドキュメント内の特定の項目に関連リソースへのリンクで注釈を付けるために`<link>`コンポーネントを使用できます。この場合、Reactはこれらの注釈をドキュメントの`<head>`内に配置せず、他のReactコンポーネントと同様に配置します。

```js
<section itemScope>
  <h3>特定の項目に注釈を付ける</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```