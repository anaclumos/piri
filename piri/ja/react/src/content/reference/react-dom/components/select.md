---
title: <select>
---

<Intro>

[組み込みブラウザの`<select>`コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)を使用すると、オプション付きのセレクトボックスをレンダリングできます。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `<select>` {/*select*/}

セレクトボックスを表示するには、[組み込みブラウザの`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)コンポーネントをレンダリングします。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<select>`はすべての[共通要素のprops](/reference/react-dom/components/common#props)をサポートします。

`value`プロップを渡すことで、[セレクトボックスを制御](#controlling-a-select-box-with-a-state-variable)できます。

* `value`: 文字列（または[`multiple={true}`](#enabling-multiple-selection)の場合は文字列の配列）。選択されているオプションを制御します。すべての値文字列は、`<select>`内にネストされた`<option>`の`value`と一致します。

`value`を渡す場合は、渡された値を更新する`onChange`ハンドラも渡す必要があります。

`<select>`が非制御の場合は、代わりに`defaultValue`プロップを渡すことができます。

* `defaultValue`: 文字列（または[`multiple={true}`](#enabling-multiple-selection)の場合は文字列の配列）。[最初に選択されるオプション](#providing-an-initially-selected-option)を指定します。

これらの`<select>`プロップは、非制御および制御セレクトボックスの両方に関連します。

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): 文字列。可能な[オートコンプリート動作](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)の1つを指定します。
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): ブール値。`true`の場合、Reactはマウント時に要素にフォーカスします。
* `children`: `<select>`は[`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option)、[`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)、および[`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist)コンポーネントを子要素として受け入れます。許可されたコンポーネントの1つを最終的にレンダリングする限り、独自のコンポーネントを渡すこともできます。独自のコンポーネントを渡して最終的に`<option>`タグをレンダリングする場合、レンダリングする各`<option>`には`value`が必要です。
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): ブール値。`true`の場合、セレクトボックスはインタラクティブではなくなり、薄暗く表示されます。
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): 文字列。このセレクトボックスが属する`<form>`の`id`を指定します。省略した場合、最も近い親フォームになります。
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): ブール値。`true`の場合、ブラウザは[複数選択](#enabling-multiple-selection)を許可します。
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): 文字列。フォームと共に[送信される](#reading-the-select-box-value-when-submitting-a-form)このセレクトボックスの名前を指定します。
* `onChange`: [`Event`ハンドラ](/reference/react-dom/components/common#event-handler)関数。[制御されたセレクトボックス](#controlling-a-select-box-with-a-state-variable)に必要です。ユーザーが異なるオプションを選択するとすぐに発火します。ブラウザの[`input`イベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)のように動作します。
* `onChangeCapture`: [キャプチャフェーズ](#capture-phase-events)で発火する`onChange`のバージョン。
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event`ハンドラ](/reference/react-dom/components/common#event-handler)関数。ユーザーによって値が変更されるとすぐに発火します。歴史的な理由から、Reactでは`onChange`を使用するのが慣例であり、同様に動作します。
* `onInputCapture`: [キャプチャフェーズ](#capture-phase-events)で発火する`onInput`のバージョン。
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event`ハンドラ](/reference/react-dom/components/common#event-handler)関数。フォーム送信時に入力が検証に失敗した場合に発火します。組み込みの`invalid`イベントとは異なり、Reactの`onInvalid`イベントはバブルします。
* `onInvalidCapture`: [キャプチャフェーズ](#capture-phase-events)で発火する`onInvalid`のバージョン。
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): ブール値。`true`の場合、フォームを送信するために値が必要です。
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): 数値。`multiple={true}`セレクトの場合、最初に表示される項目の推奨数を指定します。

#### 注意点 {/*caveats*/}

- HTMLとは異なり、`<option>`に`selected`属性を渡すことはサポートされていません。代わりに、非制御セレクトボックスには[`<select defaultValue>`](#providing-an-initially-selected-option)を、制御セレクトボックスには[`<select value>`](#controlling-a-select-box-with-a-state-variable)を使用してください。
- セレクトボックスが`value`プロップを受け取ると、それは[制御されたものとして扱われます](#controlling-a-select-box-with-a-state-variable)。
- セレクトボックスは同時に制御および非制御にはできません。
- セレクトボックスはそのライフタイム中に制御と非制御を切り替えることはできません。
- すべての制御されたセレクトボックスには、そのバックアップ値を同期的に更新する`onChange`イベントハンドラが必要です。

---

## 使用法 {/*usage*/}

### オプション付きのセレクトボックスを表示する {/*displaying-a-select-box-with-options*/}

セレクトボックスを表示するには、リスト内の`<option>`コンポーネントを含む`<select>`をレンダリングします。各`<option>`に、フォームと共に送信されるデータを表す`value`を与えます。

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

---

### セレクトボックスにラベルを提供する {/*providing-a-label-for-a-select-box*/}

通常、すべての`<select>`を[`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)タグ内に配置します。これにより、ブラウザはこのラベルがそのセレクトボックスに関連していることを認識します。ユーザーがラベルをクリックすると、ブラウザは自動的にセレクトボックスにフォーカスします。これはアクセシビリティのためにも重要です。スクリーンリーダーは、ユーザーがセレクトボックスにフォーカスしたときにラベルのキャプションを読み上げます。

`<select>`を`<label>`にネストできない場合は、同じIDを`<select id>`と[`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)に渡して関連付けます。複数のコンポーネントインスタンス間での競合を避けるために、[`useId`](/reference/react/useId)を使用してそのようなIDを生成します。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### 最初に選択されるオプションを提供する {/*providing-an-initially-selected-option*/}

デフォルトでは、ブラウザはリスト内の最初の`<option>`を選択します。デフォルトで異なるオプションを選択するには、その`<option>`の`value`を`defaultValue`として`<select>`要素に渡します。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
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

<Pitfall>

HTMLとは異なり、個々の`<option>`に`selected`属性を渡すことはサポートされていません。

</Pitfall>

---

### 複数選択を有効にする {/*enabling-multiple-selection*/}

ユーザーが複数のオプションを選択できるようにするには、`<select>`に`multiple={true}`を渡します。その場合、最初に選択されるオプションを指定するために`defaultValue`を指定する場合、それは配列でなければなりません。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### フォーム送信時にセレクトボックスの値を読み取る {/*reading-the-select-box-value-when-submitting-a-form*/}

セレクトボックスの周りに[`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)を追加し、内部に[`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)を配置します。これにより、`<form onSubmit>`イベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在のURLに送信し、ページをリフレッシュします。この動作を上書きするには、`e.preventDefault()`を呼び出します。[`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)を使用してフォームデータを読み取ります。
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // ブラウザがページをリロードするのを防ぐ
    e.preventDefault();
    // フォームデータを読み取る
    const form = e.target;
    const formData = new FormData(form);
    // フォームデータをfetchのボディとして直接渡すことができます:
    fetch('/some-api', { method: form.method, body: formData });
    // ブラウザがデフォルトで行うように、URLを生成することができます:
    console.log(new URLSearchParams(formData).toString());
    // プレーンオブジェクトとして操作することができます。
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) これは複数のセレクト値を含みません
    // または、名前と値のペアの配列を取得することができます。
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

`<select>`に`name`を付けます。例えば、`<select name="selectedFruit" />`です。指定した`name`はフォームデータのキーとして使用されます。例えば、`{ selectedFruit: "orange" }`のようになります。

`<select multiple={true}>`を使用する場合、フォームから読み取る[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)には、各選択された値が個別の名前と値のペアとして含まれます。上記の例のコンソールログをよく見てください。

</Note>

<Pitfall>

デフォルトでは、*任意の*`<button>`が`<form>`内にあると、それがフォームを送信します。これは驚くかもしれません！独自のカスタム`Button` Reactコンポーネントがある場合、`<button>`の代わりに[`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button)を返すことを検討してください。そして、フォームを送信するためのボタンには明示的に`<button type="submit">`を使用します。

</Pitfall>

---

### 状態変数でセレクトボックスを制御する {/*controlling-a-select-box-with-a-state-variable*/}

`<select />`のようなセレクトボックスは*非制御*です。たとえ[最初に選択される値](#providing-an-initially-selected-option)を`<select defaultValue="orange" />`のように渡しても、JSXは初期値のみを指定し、現在の値を指定するわけではありません。

**_制御された_セレクトボックスをレンダリングするには、`value`プロップを渡します。** Reactは渡された`value`を常に持つようにセレクトボックスを強制します。通常、セレクトボックスを制御するには、[状態変数](/reference/react/useState)を宣言します。

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // 状態変数を宣言...
  // ...
  return (
    <select
      value={selectedFruit} // ...セレクトの値を状態変数に一致させるように強制...
      onChange={e => setSelectedFruit(e.target.value)} // ...そして変更があるたびに状態変数を更新！
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select  );
}
```

これは、各選択に応じてUIの一部を再レンダリングしたい場合に便利です。

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**`value`を`onChange`なしで渡すと、オプションを選択することが不可能になります。** `value`を渡してセレクトボックスを制御する場合、渡した値を常に持つように強制します。そのため、`value`として状態変数を渡しても、`onChange`イベントハンドラでその状態変数を同期的に更新しないと、Reactは各キー入力後にセレクトボックスを指定した`value`に戻します。

HTMLとは異なり、個々の`<option>`に`selected`属性を渡すことはサポートされていません。

</Pitfall>