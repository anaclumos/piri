---
title: <option>
---

<Intro>

[組み込みブラウザの`<option>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option)は、[`<select>`](/reference/react-dom/components/select)ボックス内にオプションをレンダリングすることができます。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<option>` {/*option*/}

[組み込みブラウザの`<option>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option)は、[`<select>`](/reference/react-dom/components/select)ボックス内にオプションをレンダリングすることができます。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<option>`はすべての[共通要素のprops](/reference/react-dom/components/common#props)をサポートします。

さらに、`<option>`は以下のpropsをサポートします：

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): ブール値。`true`の場合、オプションは選択できず、薄暗く表示されます。
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): 文字列。オプションの意味を指定します。指定されていない場合、オプション内のテキストが使用されます。
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): このオプションが選択された場合に[フォームで親の`<select>`を送信する際に使用される値](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form)。

#### 注意点 {/*caveats*/}

* Reactは`<option>`の`selected`属性をサポートしていません。代わりに、このオプションの`value`を親の[`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option)に渡して非制御のセレクトボックスにするか、[`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable)に渡して制御されたセレクトボックスにします。

---

## 使用法 {/*usage*/}

### オプション付きのセレクトボックスを表示する {/*displaying-a-select-box-with-options*/}

`<select>`内に`<option>`コンポーネントのリストをレンダリングして、セレクトボックスを表示します。各`<option>`に、フォームと共に送信されるデータを表す`value`を与えます。

[オプション付きの`<select>`を表示する方法について詳しく読む。](/reference/react-dom/components/select)

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  