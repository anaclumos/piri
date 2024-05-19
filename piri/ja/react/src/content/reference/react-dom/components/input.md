---
title: <input>
---

<Intro>

[組み込みブラウザの `<input>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) を使用すると、さまざまな種類のフォーム入力をレンダリングできます。

```js
<input />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<input>` {/*input*/}

入力を表示するには、[組み込みブラウザの `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) コンポーネントをレンダリングします。

```js
<input name="myInput" />
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<input>` はすべての[共通要素の props](/reference/react-dom/components/common#props) をサポートします。

<Canary>

React の `formAction` プロパティへの拡張は現在、React の Canary および実験的チャンネルでのみ利用可能です。React の安定版リリースでは、`formAction` は[組み込みブラウザ HTML コンポーネント](/reference/react-dom/components#all-html-components) としてのみ機能します。 [React のリリースチャンネルについてはこちら](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction) を参照してください。

</Canary>

[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 文字列または関数。`type="submit"` および `type="image"` の場合、親の `<form action>` をオーバーライドします。URL が `action` に渡されると、フォームは標準の HTML フォームのように動作します。関数が `formAction` に渡されると、その関数がフォーム送信を処理します。 [`<form action>`](/reference/react-dom/components/form#props) を参照してください。

これらの props を渡すことで、[入力を制御](#controlling-an-input-with-a-state-variable) できます:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): ブール値。チェックボックス入力またはラジオボタンの場合、選択されているかどうかを制御します。
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): 文字列。テキスト入力の場合、そのテキストを制御します。（ラジオボタンの場合、そのフォームデータを指定します。）

これらのいずれかを渡す場合、渡された値を更新する `onChange` ハンドラも渡す必要があります。

これらの `<input>` props は、非制御入力にのみ関連します:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): ブール値。`type="checkbox"` および `type="radio"` 入力の[初期値](#providing-an-initial-value-for-an-input) を指定します。
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): 文字列。テキスト入力の[初期値](#providing-an-initial-value-for-an-input) を指定します。

これらの `<input>` props は、非制御入力および制御入力の両方に関連します:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): 文字列。`type="file"` 入力で受け入れられるファイルタイプを指定します。
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): 文字列。`type="image"` 入力の代替画像テキストを指定します。
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): 文字列。`type="file"` 入力でキャプチャされるメディア（マイク、ビデオ、カメラ）を指定します。
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): 文字列。可能な[オートコンプリート動作](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) のいずれかを指定します。
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): ブール値。`true` の場合、React はマウント時に要素にフォーカスします。
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): 文字列。要素の方向性のためのフォームフィールド名を指定します。
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): ブール値。`true` の場合、入力はインタラクティブではなくなり、薄暗く表示されます。
* `children`: `<input>` は子要素を受け入れません。
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): 文字列。この入力が属する `<form>` の `id` を指定します。省略された場合、最も近い親フォームです。
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 文字列。`type="submit"` および `type="image"` の場合、親の `<form action>` をオーバーライドします。
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): 文字列。`type="submit"` および `type="image"` の場合、親の `<form enctype>` をオーバーライドします。
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): 文字列。`type="submit"` および `type="image"` の場合、親の `<form method>` をオーバーライドします。
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): 文字列。`type="submit"` および `type="image"` の場合、親の `<form noValidate>` をオーバーライドします。
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): 文字列。`type="submit"` および `type="image"` の場合、親の `<form target>` をオーバーライドします。
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): 文字列。`type="image"` 入力の画像の高さを指定します。
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): 文字列。オートコンプリートオプションを持つ `<datalist>` の `id` を指定します。
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): 数値。数値および日時入力の最大値を指定します。
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): 数値。テキストおよびその他の入力の最大長を指定します。
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): 数値。数値および日時入力の最小値を指定します。
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): 数値。テキストおよびその他の入力の最小長を指定します。
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): ブール値。`<type="file"` および `type="email"` に対して複数の値が許可されるかどうかを指定します。
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 文字列。この入力の名前を指定します。[フォーム送信時に送信されます。](#reading-the-input-values-when-submitting-a-form)
* `onChange`: [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。[制御された入力](#controlling-an-input-with-a-state-variable) に必要です。ユーザーによって入力の値が変更されたときにすぐに発火します（例えば、キーを押すたびに発火します）。ブラウザの [`input` イベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) のように動作します。
* `onChangeCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events) で発火する `onChange` のバージョン。
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。ユーザーによって値が変更されたときにすぐに発火します。歴史的な理由から、React では `onChange` を使用するのが慣例であり、同様に動作します。
* `onInputCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events) で発火する `onInput` のバージョン。
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。フォーム送信時に入力が検証に失敗した場合に発火します。組み込みの `invalid` イベントとは異なり、React の `onInvalid` イベントはバブルします。
* `onInvalidCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events) で発火する `onInvalid` のバージョン。
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。`<input>` 内の選択が変更された後に発火します。React は空の選択や編集（選択に影響を与える可能性がある）でも `onSelect` イベントを発火させます。
* `onSelectCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events) で発火する `onSelect` のバージョン。
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): 文字列。`value` が一致する必要があるパターンを指定します。
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): 文字列。入力値が空のときに薄暗い色で表示されます。
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): ブール値。`true` の場合、ユーザーは入力を編集できません。
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): ブール値。`true` の場合、フォームを送信するために値を提供する必要があります。
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): 数値。幅を設定するのと似ていますが、単位はコントロールによって異なります。
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): 文字列。`type="image"` 入力の画像ソースを指定します。
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): 正の数値または `'any'` 文字列。妥当な値の間隔を指定します。
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): 文字列。[入力タイプ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) のいずれか。
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): 文字列。`type="image"` 入力の画像の幅を指定します。

#### 注意点 {/*caveats*/}

- チェックボックスには `value`（または `defaultValue`）ではなく、`checked`（または `defaultChecked`）が必要です。
- テキスト入力が文字列の `value` プロパティを受け取ると、それは[制御されたものとして扱われます。](#controlling-an-input-with-a-state-variable)
- チェックボックスまたはラジオボタンがブール値の `checked` プロパティを受け取ると、それは[制御されたものとして扱われます。](#controlling-an-input-with-a-state-variable)
- 入力は同時に制御されたものと非制御されたものの両方にはなれません。
- 入力はそのライフタイム中に制御されたものと非制御されたものの間で切り替えることはできません。
- すべての制御された入力には、そのバックアップ値を同期的に更新する `onChange` イベントハンドラが必要です。

---

## 使用法 {/*usage*/}

### 異なるタイプの入力を表示する {/*displaying-inputs-of-different-types*/}

入力を表示するには、`<input>` コンポーネントをレンダリングします。デフォルトでは、テキスト入力になります。`type="checkbox"` を渡すとチェックボックスになり、`type="radio"` を渡すとラジオボタンになります。[または他の入力タイプのいずれか。](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### 入力にラベルを提供する {/*providing-a-label-for-an-input*/}

通常、すべての `<input>` を [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) タグ内に配置します。これにより、ブラウザはこのラベルがその入力に関連していることを認識します。ユーザーがラベルをクリックすると、ブラウザは自動的に入力にフォーカスします。これはアクセシビリティのためにも重要です。スクリーンリーダーは、ユーザーが関連する入力にフォーカスしたときにラベルのキャプションを読み上げます。

`<input>` を `<label>` にネストできない場合、同じ ID を `<input id>` と [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) に渡して関連付けます。複数のコンポーネントインスタンス間での競合を避けるために、[`useId`](/reference/react/useId) を使用してそのような ID を生成します。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### 入力の初期値を提供する {/*providing-an-initial-value-for-an-input*/}

任意で、任意の入力の初期値を指定できます。テキスト入力の場合は `defaultValue` 文字列として渡します。チェックボックスおよびラジオボタンは、代わりに `defaultChecked` ブール値で初期値を指定する必要があります。

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### フォーム送信時に入力値を読み取る {/*reading-the-input-values-when-submitting-a-form*/}

入力の周りに [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) を追加し、内部に [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) を配置します。これにより、`<form onSubmit>` イベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在の URL に送信し、ページをリフレッシュします。この動作をオーバーライドするには、`e.preventDefault()` を呼び出します。フォームデータは [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) で読み取ります。

<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // ブラウザがページをリロードするのを防ぐ
    e.preventDefault();

    // フォームデータを読み取る
    const form = e.target;
    const formData = new FormData(form);

    // フォームデータを fetch のボディとして直接渡すことができます:
    fetch('/some-api', { method: form.method, body: formData });

    // または、プレーンオブジェクトとして操作することもできます:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

すべての `<input>` に `name` を付けてください。例えば `<input name="firstName" defaultValue="Taylor" />` のように。指定した `name` はフォームデータのキーとして使用されます。例えば `{ firstName: "Taylor" }` のように。

</Note>

<Pitfall>

デフォルトでは、*任意の* `<button>` が `<form>` 内にあるとそれを送信します。これは驚くかもしれません！独自のカスタム `Button` React コンポーネントがある場合、`<button>` の代わりに [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) を返すことを検討してください。そして、送信するボタンには明示的に `<button type="submit">` を使用します。

</Pitfall>

---

### 状態変数で入力を制御する {/*controlling-an-input-with-a-state-variable*/}

`<input />` のような入力は *非制御* です。たとえ [初期値を渡す](#providing-an-initial-value-for-an-input) としても、例えば `<input defaultValue="Initial text" />` のように、JSX は初期値のみを指定します。現在の値を制御するわけではありません。

**_制御された_ 入力をレンダリングするには、`value` プロパティを渡します（チェックボックスやラジオボタンの場合は `checked`）。** React は常に渡された `value` を入力に強制します。通常、これは [状態変数を宣言することによって行います:](/reference/react/useState)

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // 状態変数を宣言...
  // ...
  return (
    <input
      value={firstName} // ...入力の値を状態変数に一致させる...
      onChange={e => setFirstName(e.target.value)} // ...そして編集時に状態変数を更新します！
    />
  );
}
```

制御された入力は、例えば編集ごとに UI を再レンダリングする必要がある場合に意味があります:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

また、ボタンをクリックするなど、複数の方法で入力状態を調整したい場合にも便利です:

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

制御されたコンポーネントに渡す `value` は `undefined` や `null` であってはなりません。初期値が空である必要がある場合（例えば `firstName` フィールド）、状態変数を空文字列 (`''`) に初期化します。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}。</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**`onChange` なしで `value` を渡すと、入力にタイプすることができなくなります。** 入力を渡された `value` で制御する場合、常に渡された値を持つように強制します。したがって、状態変数を `value` として渡し、`onChange` イベントハンドラでその状態変数を同期的に更新しないと、React は各キー入力後に指定された `value` に入力を戻します。

</Pitfall>

---

### 各キー入力時の再レンダリングの最適化 {/*optimizing-re-rendering-on-every-keystroke*/}

制御された入力を使用する場合、各キー入力時に状態を設定します。状態を含むコンポーネントが大きなツリーを再レンダリングする場合、これが遅くなることがあります。再レンダリングのパフォーマンスを最適化する方法はいくつかあります。

例えば、各キー入力時にすべてのページコンテンツを再レンダリングするフォームから始めるとします:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

`<PageContent />` が入力状態に依存しないため、入力状態を独自のコンポーネントに移動できます:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

これにより、`SignupForm` のみが各キー入力時に再レンダリングされるため、パフォーマンスが大幅に向上します。

再レンダリングを避ける方法がない場合（例えば、`PageContent` が検索入力の値に依存する場合）、[`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) を使用すると、大規模な再レンダリングの途中でも制御された入力をレスポンシブに保つことができます。

---

## トラブルシューティング {/*troubleshooting*/}

### テキスト入力にタイプしても更新されない {/*my-text-input-doesnt-update-when-i-type-into-it*/}

`value` を持つ入力を `onChange` なしでレンダリングすると、コンソールにエラーが表示されます:

```js
// 🔴 バグ: onChange ハンドラのない制御されたテキスト入力
<input value={something} />
```

<ConsoleBlock level="error">

`onChange` ハンドラなしでフォームフィールドに `value` プロパティを提供しました。これにより、読み取り専用フィールドがレンダリングされます。フィールドが変更可能であるべき場合は `defaultValue` を使用してください。それ以外の場合は、`onChange` または `readOnly` を設定してください。

</ConsoleBlock>

エラーメッセージが示すように、[初期値のみを指定したい場合](#providing-an-initial-value-for-an-input) は、代わりに `defaultValue` を渡します:

```js
// ✅ 良い: 初期値を持つ非制御入力
<input defaultValue={something} />
```

[この入力を状態変数で制御したい場合](#controlling-an-input-with-a-state-variable) は、`onChange` ハンドラを指定します:

```js
// ✅ 良い: onChange を持つ制御された入力
<input value={something} onChange={e => setSomething(e.target.value)} />
```

値が意図的に読み取り専用である場合、エラーを抑制するために `readOnly` プロパティを追加します:

```js
// ✅ 良い: onChange なしの読み取り専用制御入力
<input value={something} readOnly={true} />
```

---

### チェックボックスをクリックしても更新されない {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

`checked` を持つチェックボックスを `onChange` なしでレンダリングすると、コンソールにエラーが表示されます:

```js
// 🔴 バグ: onChange ハンドラのない制御されたチェックボックス
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

`onChange` ハンドラなしでフォームフィールドに `checked` プロパティを提供しました。これにより、読み取り専用フィールドがレンダリングされます。フィールドが変更可能であるべき場合は `defaultChecked` を使用してください。それ以外の場合は、`onChange` または `readOnly` を設定してください。

</ConsoleBlock>

エラーメッセージが示すように、[初期値のみを指定したい場合](#providing-an-initial-value-for-an-input) は、代わりに `defaultChecked` を渡します:

```js
// ✅ 良い: 初期値を持つ非制御チェックボックス
<input type="checkbox" defaultChecked={something} />
```

[このチェックボックスを状態変数で制御したい場合](#controlling-an-input-with-a-state-variable) は、`onChange` ハンドラを指定します:

```js
// ✅ 良い: onChange を持つ制御されたチェックボックス
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

チェックボックスの場合、`e.target.value` ではなく `e.target.checked` を読み取る必要があります。

</Pitfall>

チェックボックスが意図的に読み取り専用である場合、エラーを抑制するために `readOnly` プロパティを追加します:

```js
// ✅ 良い: onChange なしの読み取り専用制御入力
<input type="checkbox" checked={something} readOnly={true} />
```

---

### 入力キャレットが各キー入力時に先頭にジャンプする {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

[入力を制御する場合](#controlling-an-input-with-a-state-variable)、`onChange` 中に DOM から入力の値に状態変数を更新する必要があります。

`e.target.value`（またはチェックボックスの場合は `e.target.checked`）以外のものに更新することはできません:

```js
function handleChange(e) {
  // 🔴 バグ: e.target.value 以外のものに入力を更新する
  setFirstName(e.target.value.toUpperCase());
}
```

また、非同期に更新することもできません:

```js
function handleChange(e) {
  // 🔴 バグ: 非同期に入力を更新する
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

コードを修正するには、`e.target.value` に同期的に更新します:

```js
function handleChange(e) {
  // ✅ e.target.value に制御された入力を同期的に更新する
  setFirstName(e.target.value);
}
```

これで問題が解決しない場合、入力が各キー入力時に DOM から削除され再追加されている可能性があります。これは、例えば入力またはその親のいずれかが常に異なる `key` 属性を受け取る場合や、コンポーネント関数定義をネストしている場合（これはサポートされておらず、「内部」コンポーネントが常に異なるツリーと見なされるため）に発生する可能性があります。

---

### エラーが発生しています: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

コンポーネントに `value` を提供する場合、そのライフタイム中は文字列である必要があります。

最初に `value={undefined}` を渡し、後で `value="some string"` を渡すことはできません。React はコンポーネントが非制御であるべきか制御されるべきかを判断できません。制御されたコンポーネントは常に文字列の `value` を受け取るべきであり、`null` や `undefined` ではありません。

`value` が API や状態変数から来る場合、それは `null` や `undefined` に初期化される可能性があります。その場合、最初に空文字列 (`''`) に設定するか、`value={someValue ?? ''}` を渡して `value` が文字列であることを確認します。

同様に、チェックボックスに `checked` を渡す場合、それが常にブール値であることを確認します。