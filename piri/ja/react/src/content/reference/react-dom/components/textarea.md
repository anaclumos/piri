---
title: <textarea>
---

<Intro>

[組み込みブラウザの `<textarea>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) を使用すると、複数行のテキスト入力をレンダリングできます。

```js
<textarea />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<textarea>` {/*textarea*/}

テキストエリアを表示するには、[組み込みブラウザの `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) コンポーネントをレンダリングします。

```js
<textarea name="postContent" />
```

[以下の例を参照してください。](#usage)

#### Props {/*props*/}

`<textarea>` はすべての[共通要素のプロパティ](/reference/react-dom/components/common#props)をサポートします。

`value` プロパティを渡すことで、[テキストエリアを制御](#controlling-a-text-area-with-a-state-variable)できます。

* `value`: 文字列。テキストエリア内のテキストを制御します。

`value` を渡す場合は、渡された値を更新する `onChange` ハンドラも渡す必要があります。

`<textarea>` が制御されていない場合は、代わりに `defaultValue` プロパティを渡すことができます。

* `defaultValue`: 文字列。テキストエリアの[初期値](#providing-an-initial-value-for-a-text-area)を指定します。

これらの `<textarea>` プロパティは、制御されていないテキストエリアと制御されたテキストエリアの両方に関連します。

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): `'on'` または `'off'` のいずれか。オートコンプリートの動作を指定します。
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): ブール値。`true` の場合、React はマウント時に要素にフォーカスします。
* `children`: `<textarea>` は子要素を受け入れません。初期値を設定するには `defaultValue` を使用します。
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): 数値。デフォルトの幅を平均文字幅で指定します。デフォルトは `20` です。
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): ブール値。`true` の場合、入力はインタラクティブではなくなり、薄暗く表示されます。
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): 文字列。この入力が属する `<form>` の `id` を指定します。省略した場合、最も近い親フォームになります。
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): 数値。テキストの最大長を指定します。
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): 数値。テキストの最小長を指定します。
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 文字列。この入力の名前を指定します。[フォームと一緒に送信されます。](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。[制御されたテキストエリア](#controlling-a-text-area-with-a-state-variable)に必要です。ユーザーが入力の値を変更したときにすぐに発火します（例えば、キーを押すたびに発火します）。ブラウザの [`input` イベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)のように動作します。
* `onChangeCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火する `onChange` のバージョン。
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。ユーザーが値を変更したときにすぐに発火します。歴史的な理由から、React では `onChange` を使用するのが慣例であり、同様に動作します。
* `onInputCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火する `onInput` のバージョン。
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。フォーム送信時に入力が検証に失敗した場合に発火します。組み込みの `invalid` イベントとは異なり、React の `onInvalid` イベントはバブルします。
* `onInvalidCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火する `onInvalid` のバージョン。
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。`<textarea>` 内の選択が変更された後に発火します。React は `onSelect` イベントを拡張して、空の選択や編集（選択に影響を与える可能性がある）でも発火するようにします。
* `onSelectCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火する `onSelect` のバージョン。
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): 文字列。テキストエリアの値が空のときに薄暗い色で表示されます。
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): ブール値。`true` の場合、ユーザーはテキストエリアを編集できません。
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): ブール値。`true` の場合、フォームを送信するために値を提供する必要があります。
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): 数値。デフォルトの高さを平均文字高さで指定します。デフォルトは `2` です。
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): `'hard'`、`'soft'`、または `'off'` のいずれか。フォーム送信時にテキストをどのように折り返すかを指定します。

#### 注意点 {/*caveats*/}

- `<textarea>something</textarea>` のように子要素を渡すことはできません。[初期コンテンツには `defaultValue` を使用します。](#providing-an-initial-value-for-a-text-area)
- テキストエリアが文字列の `value` プロパティを受け取ると、それは[制御されたものとして扱われます。](#controlling-a-text-area-with-a-state-variable)
- テキストエリアは同時に制御されている状態と制御されていない状態の両方になることはできません。
- テキストエリアはそのライフタイム中に制御されている状態と制御されていない状態を切り替えることはできません。
- すべての制御されたテキストエリアには、そのバックアップ値を同期的に更新する `onChange` イベントハンドラが必要です。

---

## 使用法 {/*usage*/}

### テキストエリアの表示 {/*displaying-a-text-area*/}

テキストエリアを表示するには、`<textarea>` をレンダリングします。デフォルトのサイズは [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) と [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) 属性で指定できますが、デフォルトではユーザーがサイズを変更できます。サイズ変更を無効にするには、CSSで `resize: none` を指定します。

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### テキストエリアにラベルを提供する {/*providing-a-label-for-a-text-area*/}

通常、すべての `<textarea>` を [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) タグ内に配置します。これにより、ブラウザはこのラベルがそのテキストエリアに関連していることを認識します。ユーザーがラベルをクリックすると、ブラウザはテキストエリアにフォーカスします。これはアクセシビリティのためにも重要です。スクリーンリーダーは、ユーザーがテキストエリアにフォーカスしたときにラベルのキャプションを読み上げます。

`<textarea>` を `<label>` にネストできない場合は、同じIDを `<textarea id>` と [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) に渡して関連付けます。コンポーネントのインスタンス間での競合を避けるために、[`useId`](/reference/react/useId) を使用してそのようなIDを生成します。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### テキストエリアに初期値を提供する {/*providing-an-initial-value-for-a-text-area*/}

テキストエリアの初期値をオプションで指定できます。`defaultValue` 文字列として渡します。

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

HTMLとは異なり、`<textarea>Some content</textarea>` のように初期テキストを渡すことはサポートされていません。

</Pitfall>

---

### フォーム送信時にテキストエリアの値を読み取る {/*reading-the-text-area-value-when-submitting-a-form*/}

テキストエリアの周りに [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) を追加し、内部に [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) を配置します。これにより、`<form onSubmit>` イベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在のURLに送信し、ページをリフレッシュします。この動作を上書きするには、`e.preventDefault()` を呼び出します。フォームデータは [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) で読み取ります。

<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // ブラウザがページをリロードするのを防ぐ
    e.preventDefault();

    // フォームデータを読み取る
    const form = e.target;
    const formData = new FormData(form);

    // フォームデータをfetchのボディとして直接渡すことができます
    fetch('/some-api', { method: form.method, body: formData });

    // または、プレーンオブジェクトとして操作することもできます
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
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

`<textarea>` に `name` を付けてください。例えば `<textarea name="postContent" />` のように。指定した `name` はフォームデータのキーとして使用されます。例えば `{ postContent: "Your post" }` のように。

</Note>

<Pitfall>

デフォルトでは、*任意の* `<button>` が `<form>` 内にあるとそれを送信します。これは驚くかもしれません！独自のカスタム `Button` React コンポーネントがある場合、`<button>` の代わりに [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) を返すことを検討してください。そして、フォームを送信するボタンには `<button type="submit">` を使用して明示的にします。

</Pitfall>

---

### 状態変数でテキストエリアを制御する {/*controlling-a-text-area-with-a-state-variable*/}

`<textarea />` のようなテキストエリアは*制御されていません*。たとえ [初期値を渡す](#providing-an-initial-value-for-a-text-area) としても、`<textarea defaultValue="Initial text" />` のように、JSX は初期値のみを指定し、現在の値は指定しません。

**_制御された_ テキストエリアをレンダリングするには、`value` プロパティを渡します。** React は常に渡された `value` を持つようにテキストエリアを強制します。通常、テキストエリアを制御するには、[状態変数を宣言します。](/reference/react/useState)

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // 状態変数を宣言...
  // ...
  return (
    <textarea
      value={postContent} // ...入力の値を状態変数に一致させるように強制し...
      onChange={e => setPostContent(e.target.value)} // ...編集時に状態変数を更新します！
    />
  );
}
```

これは、キーを押すたびにUIの一部を再レンダリングしたい場合に便利です。

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**`onChange` なしで `value` を渡すと、テキストエリアに入力することができなくなります。** テキストエリアを `value` を渡して制御する場合、渡された値を常に持つように強制します。したがって、`onChange` イベントハンドラで状態変数を同期的に更新するのを忘れると、React はキーを押すたびにテキストエリアを指定された `value` に戻します。

</Pitfall>

---

## トラブルシューティング {/*troubleshooting*/}

### テキストエリアに入力しても更新されない {/*my-text-area-doesnt-update-when-i-type-into-it*/}

`value` を指定してテキストエリアをレンダリングすると、`onChange` がない場合、コンソールにエラーが表示されます。

```js
// 🔴 バグ: onChange ハンドラのない制御されたテキストエリア
<textarea value={something} />
```

<ConsoleBlock level="error">

`onChange` ハンドラなしでフォームフィールドに `value` プロパティを提供しました。これにより、読み取り専用フィールドがレンダリングされます。フィールドが変更可能であるべき場合は `defaultValue` を使用してください。それ以外の場合は、`onChange` または `readOnly` を設定してください。

</ConsoleBlock>

エラーメッセージが示すように、*初期* 値のみを指定したい場合は、代わりに `defaultValue` を渡します。

```js
// ✅ 良い: 初期値を持つ制御されていないテキストエリア
<textarea defaultValue={something} />
```

このテキストエリアを状態変数で制御したい場合は、`onChange` ハンドラを指定します。

```js
// ✅ 良い: onChange を持つ制御されたテキストエリア
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

値が意図的に読み取り専用である場合は、エラーを抑制するために `readOnly` プロパティを追加します。

```js
// ✅ 良い: onChange なしの読み取り専用制御されたテキストエリア
<textarea value={something} readOnly={true} />
```

---

### テキストエリアのキャレットがキーを押すたびに先頭にジャンプする {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

テキストエリアを制御する場合、`onChange` 中にその状態変数をDOMのテキストエリアの値に更新する必要があります。

`e.target.value` 以外のものに更新することはできません。

```js
function handleChange(e) {
  // 🔴 バグ: e.target.value 以外のものに入力を更新する
  setFirstName(e.target.value.toUpperCase());
}
```

また、非同期に更新することもできません。

```js
function handleChange(e) {
  // 🔴 バグ: 非同期に入力を更新する
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

コードを修正するには、`e.target.value` に同期的に更新します。

```js
function handleChange(e) {
  // ✅ e.target.value に同期的に制御された入力を更新する
  setFirstName(e.target.value);
}
```

これで問題が解決しない場合、テキストエリアがキーを押すたびにDOMから削除されて再追加されている可能性があります。これは、テキストエリアまたはその親のいずれかが常に異なる `key` 属性を受け取る場合や、コンポーネント定義をネストしている場合（Reactでは許可されておらず、"inner" コンポーネントが毎回再マウントされる原因となります）に発生する可能性があります。

---

### エラーが発生しています: "A component is changing an uncontrolled input to be controlled" {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}

コンポーネントに `value` を提供する場合、そのライフタイム全体で文字列のままでなければなりません。

最初に `value={undefined}` を渡し、後で `value="some string"` を渡すことはできません。React はコンポーネントが制御されているのか制御されていないのかを判断できなくなります。制御されたコンポーネントは常に文字列の `value` を受け取る必要があり、`null` や `undefined` ではありません。

`value` がAPIや状態変数から来る場合、それは `null` や `undefined` に初期化される可能性があります。その場合、最初は空の文字列 (`''`) に設定するか、`value={someValue ?? ''}` を渡して `value` が文字列であることを確認します。