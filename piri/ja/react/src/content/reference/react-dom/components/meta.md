---
meta: <meta>
canary: true
---

<Canary>

Reactの`<meta>`に対する拡張機能は、現在Reactのcanaryおよび実験的なチャンネルでのみ利用可能です。Reactの安定版リリースでは、`<meta>`は[組み込みのブラウザHTMLコンポーネント](https://react.dev/reference/react-dom/components#all-html-components)としてのみ機能します。[Reactのリリースチャンネルについてはこちら](https://react.dev/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>


<Intro>

[組み込みのブラウザ`<meta>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)を使用すると、ドキュメントにメタデータを追加できます。

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<meta>` {/*meta*/}

ドキュメントのメタデータを追加するには、[組み込みのブラウザ`<meta>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)をレンダリングします。どのコンポーネントからでも`<meta>`をレンダリングでき、Reactは常に対応するDOM要素をドキュメントのヘッドに配置します。

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<meta>`はすべての[共通要素のprops](/reference/react-dom/components/common#props)をサポートします。

次のpropsのうち*正確に1つ*を持つ必要があります: `name`, `httpEquiv`, `charset`, `itemProp`。どのpropsが指定されるかによって、`<meta>`コンポーネントの動作が異なります。

* `name`: 文字列。ドキュメントに添付する[メタデータの種類](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name)を指定します。
* `charset`: 文字列。ドキュメントで使用される文字セットを指定します。有効な値は`"utf-8"`のみです。
* `httpEquiv`: 文字列。ドキュメントの処理に関する指示を指定します。
* `itemProp`: 文字列。ドキュメント全体ではなく、ドキュメント内の特定の項目に関するメタデータを指定します。
* `content`: 文字列。`name`または`itemProp`のpropsと一緒に使用する場合は添付するメタデータを、`httpEquiv`のpropsと一緒に使用する場合は指示の動作を指定します。

#### 特殊なレンダリング動作 {/*special-rendering-behavior*/}

Reactは、Reactツリーのどこにレンダリングされても、`<meta>`コンポーネントに対応するDOM要素をドキュメントの`<head>`内に常に配置します。`<head>`はDOM内で`<meta>`が存在する唯一の有効な場所ですが、特定のページを表すコンポーネントが自分自身で`<meta>`コンポーネントをレンダリングできると便利であり、コンポーザブルな状態を保つことができます。

ただし、1つの例外があります。`<meta>`に[`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop)のpropsがある場合、この場合はドキュメントに関するメタデータではなく、ページの特定の部分に関するメタデータを表すため、特別な動作はありません。

---

## 使用法 {/*usage*/}

### ドキュメントにメタデータを注釈する {/*annotating-the-document-with-metadata*/}

キーワード、要約、または著者名などのメタデータをドキュメントに注釈できます。Reactは、Reactツリーのどこにレンダリングされても、このメタデータをドキュメントの`<head>`内に配置します。

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

どのコンポーネントからでも`<meta>`コンポーネントをレンダリングできます。Reactはドキュメントの`<head>`に`<meta>`のDOMノードを配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### ドキュメント内の特定の項目にメタデータを注釈する {/*annotating-specific-items-within-the-document-with-metadata*/}

`itemProp`のpropsを使用して、ドキュメント内の特定の項目にメタデータを注釈するために`<meta>`コンポーネントを使用できます。この場合、Reactはこれらの注釈をドキュメントの`<head>`内には配置せず、他のReactコンポーネントと同様に配置します。

```js
<section itemScope>
  <h3>特定の項目に注釈を付ける</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```