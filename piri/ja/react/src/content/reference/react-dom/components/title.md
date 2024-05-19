---
title: <title>
canary: true
---

<Canary>

Reactの`<title>`への拡張は現在、Reactのcanaryおよび実験的なチャンネルでのみ利用可能です。Reactの安定版リリースでは、`<title>`は[組み込みのブラウザHTMLコンポーネント](https://react.dev/reference/react-dom/components#all-html-components)としてのみ機能します。[Reactのリリースチャンネルについてはこちら](https://react.dev/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>


<Intro>

[組み込みのブラウザ`<title>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)を使用すると、ドキュメントのタイトルを指定できます。

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<title>` {/*title*/}

ドキュメントのタイトルを指定するには、[組み込みのブラウザ`<title>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)をレンダリングします。どのコンポーネントからでも`<title>`をレンダリングできますが、Reactは常に対応するDOM要素をドキュメントのヘッドに配置します。

```js
<title>My Blog</title>
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<title>`はすべての[共通要素のprops](/reference/react-dom/components/common#props)をサポートします。

* `children`: `<title>`は子としてテキストのみを受け入れます。このテキストがドキュメントのタイトルになります。テキストのみをレンダリングする限り、独自のコンポーネントを渡すこともできます。

#### 特殊なレンダリング動作 {/*special-rendering-behavior*/}

Reactは、Reactツリーのどこにレンダリングされても、`<title>`コンポーネントに対応するDOM要素をドキュメントの`<head>`内に常に配置します。`<head>`はDOM内で`<title>`が存在する唯一の有効な場所ですが、特定のページを表すコンポーネントが自分自身で`<title>`をレンダリングできると便利であり、構成可能性が保たれます。

これには2つの例外があります：
* `<title>`が`<svg>`コンポーネント内にある場合、このコンテキストではドキュメントのタイトルではなく、そのSVGグラフィックの[アクセシビリティ注釈](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)を表すため、特別な動作はありません。
* `<title>`に[`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop)プロップがある場合、この場合も特別な動作はありません。この場合、ドキュメントのタイトルではなく、ページの特定の部分に関するメタデータを表します。

<Pitfall>

一度に単一の`<title>`のみをレンダリングしてください。複数のコンポーネントが同時に`<title>`タグをレンダリングすると、Reactはそれらすべてのタイトルをドキュメントのヘッドに配置します。この場合、ブラウザや検索エンジンの動作は未定義です。

</Pitfall>

---

## 使用法 {/*usage*/}

### ドキュメントのタイトルを設定する {/*set-the-document-title*/}

任意のコンポーネントから子としてテキストを持つ`<title>`コンポーネントをレンダリングします。Reactはドキュメントの`<head>`に`<title>`DOMノードを配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### タイトルに変数を使用する {/*use-variables-in-the-title*/}

`<title>`コンポーネントの子は単一のテキスト文字列でなければなりません。（または単一の数値、または`toString`メソッドを持つ単一のオブジェクト。）次のようにJSXの中括弧を使用すると：

```js
<title>Results page {pageNumber}</title> // 🔴 問題: これは単一の文字列ではありません
```

... 実際には`<title>`コンポーネントの子として2要素の配列（文字列`"Results page"`と`pageNumber`の値）が渡されます。これによりエラーが発生します。代わりに、文字列補間を使用して`<title>`に単一の文字列を渡します：

```js
<title>{`Results page ${pageNumber}`}</title>
```