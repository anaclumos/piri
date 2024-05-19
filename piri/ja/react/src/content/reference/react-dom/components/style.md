---
style: <style>
canary: true
---

<Canary>

Reactの`<style>`への拡張は現在、Reactのカナリアおよび実験的なチャンネルでのみ利用可能です。Reactの安定版リリースでは、`<style>`は[組み込みのブラウザHTMLコンポーネント](https://react.dev/reference/react-dom/components#all-html-components)としてのみ機能します。[Reactのリリースチャンネルについてはこちら](https://react.dev/community/versioning-policy#all-release-channels)をご覧ください。

</Canary>

<Intro>

[組み込みのブラウザ`<style>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)を使用すると、ドキュメントにインラインCSSスタイルシートを追加できます。

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<style>` {/*style*/}

ドキュメントにインラインスタイルを追加するには、[組み込みのブラウザ`<style>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)をレンダリングします。任意のコンポーネントから`<style>`をレンダリングでき、Reactは[特定のケース](#special-rendering-behavior)で対応するDOM要素をドキュメントのヘッドに配置し、同一のスタイルを重複排除します。

```js
<style>{` p { color: red; } `}</style>
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<style>`はすべての[共通要素のプロパティ](/reference/react-dom/components/common#props)をサポートします。

* `children`: 文字列、必須。スタイルシートの内容。
* `precedence`: 文字列。ドキュメントの`<head>`内で他の`<style>`DOMノードに対する優先順位をReactに指示し、どのスタイルシートが他を上書きできるかを決定します。値は（優先順位の順に）`"reset"`、`"low"`、`"medium"`、`"high"`のいずれかです。同じ優先順位のスタイルシートは、`<link>`タグやインライン`<style>`タグ、または[`preload`](/reference/react-dom/preload)や[`preinit`](/reference/react-dom/preinit)関数を使用して読み込まれたものであっても一緒に配置されます。
* `href`: 文字列。同じ`href`を持つスタイルを[重複排除](#special-rendering-behavior)するためにReactが使用します。
* `media`: 文字列。スタイルシートを特定の[メディアクエリ](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)に制限します。
* `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際にリソースを許可するための暗号化[nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
* `title`: 文字列。[代替スタイルシート](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)の名前を指定します。

Reactでの使用が**推奨されない**プロパティ：

* `blocking`: 文字列。`"render"`に設定すると、スタイルシートが読み込まれるまでブラウザにページをレンダリングしないよう指示します。ReactはSuspenseを使用してより細かい制御を提供します。

#### 特殊なレンダリング動作 {/*special-rendering-behavior*/}

Reactは`<style>`コンポーネントをドキュメントの`<head>`に移動し、同一のスタイルシートを重複排除し、スタイルシートの読み込み中に[サスペンド](/reference/react/Suspense)することができます。

この動作を有効にするには、`href`および`precedence`プロパティを提供します。Reactは同じ`href`を持つスタイルを重複排除します。`precedence`プロパティは、ドキュメントの`<head>`内で他の`<style>`DOMノードに対する優先順位をReactに指示し、どのスタイルシートが他を上書きできるかを決定します。

この特殊な処理には2つの注意点があります：

* スタイルがレンダリングされた後にプロパティの変更があっても、Reactはそれを無視します。（開発中にこれが発生すると、Reactは警告を発します。）
* スタイルをレンダリングしたコンポーネントがアンマウントされた後でも、ReactはスタイルをDOMに残す場合があります。

---

## 使用法 {/*usage*/}

### インラインCSSスタイルシートのレンダリング {/*rendering-an-inline-css-stylesheet*/}

コンポーネントが正しく表示されるために特定のCSSスタイルに依存している場合、コンポーネント内でインラインスタイルシートをレンダリングできます。

`href`および`precedence`プロパティを指定すると、スタイルシートの読み込み中にコンポーネントがサスペンドされます。（インラインスタイルシートでも、スタイルシートが参照するフォントや画像の読み込み時間がかかる場合があります。）`href`プロパティはスタイルシートを一意に識別する必要があります。Reactは同じ`href`を持つスタイルシートを重複排除します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>