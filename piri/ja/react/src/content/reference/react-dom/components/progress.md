---
title: <progress>
---

<Intro>

[組み込みブラウザの `<progress>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) を使用すると、進行状況インジケーターを表示できます。

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `<progress>` {/*progress*/}

進行状況インジケーターを表示するには、[組み込みブラウザの `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) コンポーネントをレンダリングします。

```js
<progress value={0.5} />
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<progress>` はすべての[共通要素の props](/reference/react-dom/components/common#props)をサポートします。

さらに、`<progress>` は次の props をサポートします：

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max): 数値。最大の `value` を指定します。デフォルトは `1` です。
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value): `0` から `max` までの数値、または不確定な進行状況の場合は `null`。完了した量を指定します。

---

## 使用法 {/*usage*/}

### 進行状況インジケーターの制御 {/*controlling-a-progress-indicator*/}

進行状況インジケーターを表示するには、`<progress>` コンポーネントをレンダリングします。指定した `max` 値の間で `0` から `max` までの数値 `value` を渡すことができます。`max` 値を渡さない場合、デフォルトで `1` と見なされます。

操作が進行中でない場合は、`value={null}` を渡して進行状況インジケーターを不確定状態にします。

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>