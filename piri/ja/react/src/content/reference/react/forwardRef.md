---
title: forwardRef
---

<Intro>

`forwardRef`を使用すると、コンポーネントが親コンポーネントにDOMノードを[ref](/learn/manipulating-the-dom-with-refs)で公開できます。

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

`forwardRef()`を呼び出して、コンポーネントがrefを受け取り、それを子コンポーネントに転送できるようにします。

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `render`: コンポーネントのレンダリング関数。Reactはこの関数を、親から受け取ったpropsと`ref`で呼び出します。返されるJSXがコンポーネントの出力となります。

#### 戻り値 {/*returns*/}

`forwardRef`はJSXでレンダリングできるReactコンポーネントを返します。通常の関数として定義されたReactコンポーネントとは異なり、`forwardRef`によって返されるコンポーネントは`ref`プロップも受け取ることができます。

#### 注意点 {/*caveats*/}

* ストリクトモードでは、Reactは[偶発的な不純物を見つけるのを助けるために](/reference/react/useState#my-initializer-or-updater-function-runs-twice)、**レンダリング関数を2回呼び出します**。これは開発時のみの動作であり、本番環境には影響しません。レンダリング関数が純粋であれば（そうであるべきですが）、コンポーネントのロジックには影響しません。呼び出しの1つの結果は無視されます。

---

### `render`関数 {/*render-function*/}

`forwardRef`は引数としてレンダリング関数を受け取ります。Reactはこの関数を`props`と`ref`で呼び出します。

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### パラメータ {/*render-parameters*/}

* `props`: 親コンポーネントから渡されたprops。

* `ref`: 親コンポーネントから渡された`ref`属性。`ref`はオブジェクトまたは関数である可能性があります。親コンポーネントがrefを渡していない場合、それは`null`になります。受け取った`ref`を他のコンポーネントに渡すか、[`useImperativeHandle`](/reference/react/useImperativeHandle)に渡す必要があります。

#### 戻り値 {/*render-returns*/}

`forwardRef`はJSXでレンダリングできるReactコンポーネントを返します。通常の関数として定義されたReactコンポーネントとは異なり、`forwardRef`によって返されるコンポーネントは`ref`プロップも受け取ることができます。

---

## 使用法 {/*usage*/}

### 親コンポーネントにDOMノードを公開する {/*exposing-a-dom-node-to-the-parent-component*/}

デフォルトでは、各コンポーネントのDOMノードはプライベートです。しかし、時にはDOMノードを親に公開することが有用です。例えば、フォーカスを当てるためです。これを行うには、コンポーネント定義を`forwardRef()`でラップします。

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

<CodeStep step={1}>ref</CodeStep>をpropsの後の第2引数として受け取ります。公開したいDOMノードにそれを渡します。

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

これにより、親コンポーネント`Form`は`MyInput`によって公開された<CodeStep step={2}>`<input>` DOMノード</CodeStep>にアクセスできます。

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

この`Form`コンポーネントは`MyInput`に[refを渡します](/reference/react/useRef#manipulating-the-dom-with-a-ref)。`MyInput`コンポーネントはそのrefを`<input>`ブラウザタグに*転送*します。その結果、`Form`コンポーネントはその`<input>` DOMノードにアクセスし、[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)を呼び出すことができます。

コンポーネント内のDOMノードにrefを公開すると、後でコンポーネントの内部を変更するのが難しくなることに注意してください。通常、ボタンやテキスト入力のような再利用可能な低レベルのコンポーネントからDOMノードを公開しますが、アバターやコメントのようなアプリケーションレベルのコンポーネントでは行いません。

<Recipes titleText="refを転送する例">

#### テキスト入力にフォーカスを当てる {/*focusing-a-text-input*/}

ボタンをクリックすると入力にフォーカスが当たります。`Form`コンポーネントはrefを定義し、それを`MyInput`コンポーネントに渡します。`MyInput`コンポーネントはそのrefをブラウザの`<input>`に転送します。これにより、`Form`コンポーネントは`<input>`にフォーカスを当てることができます。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### ビデオの再生と一時停止 {/*playing-and-pausing-a-video*/}

ボタンをクリックすると、[`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)と[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)が`<video>` DOMノードで呼び出されます。`App`コンポーネントはrefを定義し、それを`MyVideoPlayer`コンポーネントに渡します。`MyVideoPlayer`コンポーネントはそのrefをブラウザの`<video>`ノードに転送します。これにより、`App`コンポーネントは`<video>`を再生および一時停止できます。

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 複数のコンポーネントを通してrefを転送する {/*forwarding-a-ref-through-multiple-components*/}

`ref`をDOMノードに転送する代わりに、`MyInput`のような独自のコンポーネントに転送することができます。

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

その`MyInput`コンポーネントがrefを`<input>`に転送する場合、`FormField`へのrefはその`<input>`を提供します。

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form`コンポーネントはrefを定義し、それを`FormField`に渡します。`FormField`コンポーネントはそのrefを`MyInput`に転送し、それがブラウザの`<input>` DOMノードに転送されます。これが`Form`がそのDOMノードにアクセスする方法です。

<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### DOMノードの代わりに命令的ハンドルを公開する {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

DOMノード全体を公開する代わりに、より制約されたメソッドセットを持つカスタムオブジェクト（命令的ハンドル）を公開することができます。これを行うには、DOMノードを保持するための別のrefを定義する必要があります。

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

受け取った`ref`を[`useImperativeHandle`](/reference/react/useImperativeHandle)に渡し、公開したい値を指定します。

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

あるコンポーネントが`MyInput`へのrefを取得すると、そのDOMノードの代わりに`{ focus, scrollIntoView }`オブジェクトのみを受け取ります。これにより、DOMノードに関する情報を最小限に制限できます。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // DOMノードが公開されていないため、これは機能しません:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[命令的ハンドルの使用についてさらに読む。](/reference/react/useImperativeHandle)

<Pitfall>

**refを過度に使用しないでください。** refは、スクロール、フォーカス、アニメーションのトリガー、テキストの選択など、プロップとして表現できない*命令的*な動作にのみ使用するべきです。

**プロップとして表現できるものにはrefを使用しないでください。** 例えば、`Modal`コンポーネントから`{ open, close }`のような命令的ハンドルを公開する代わりに、`<Modal isOpen={isOpen} />`のように`isOpen`をプロップとして受け取る方が良いです。[エフェクト](/learn/synchronizing-with-effects)は、プロップを介して命令的な動作を公開するのに役立ちます。

</Pitfall>

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントが`forwardRef`でラップされているが、refが常に`null`である {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

これは通常、受け取った`ref`を実際に使用するのを忘れたことを意味します。

例えば、このコンポーネントは`ref`で何もしていません。

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

これを修正するには、`ref`をDOMノードまたはrefを受け取ることができる他のコンポーネントに渡します。

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`MyInput`へのrefも、ロジックが条件付きの場合は`null`になる可能性があります。

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

`showInput`が`false`の場合、refはどのノードにも転送されず、`MyInput`へのrefは空のままです。これは、条件が別のコンポーネント内に隠れている場合に特に見落としやすいです。この例では`Panel```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```