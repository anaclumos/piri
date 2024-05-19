---
title: useRef
---

<Intro>

`useRef`は、レンダリングに必要ない値を参照するためのReact Hookです。

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

コンポーネントのトップレベルで`useRef`を呼び出して、[ref](/learn/referencing-values-with-refs)を宣言します。

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `initialValue`: refオブジェクトの`current`プロパティに初期設定したい値。任意の型の値を指定できます。この引数は初回レンダリング後は無視されます。

#### 戻り値 {/*returns*/}

`useRef`は単一のプロパティを持つオブジェクトを返します：

* `current`: 初期値として渡した`initialValue`に設定されます。後で別の値に設定することもできます。refオブジェクトをJSXノードの`ref`属性としてReactに渡すと、Reactはその`current`プロパティを設定します。

次のレンダリング時には、`useRef`は同じオブジェクトを返します。

#### 注意点 {/*caveats*/}

* `ref.current`プロパティを変更することができます。状態とは異なり、これは変更可能です。ただし、レンダリングに使用されるオブジェクト（例えば、状態の一部）を保持している場合、そのオブジェクトを変更すべきではありません。
* `ref.current`プロパティを変更しても、Reactはコンポーネントを再レンダリングしません。refは単なるJavaScriptオブジェクトであるため、Reactはその変更を認識しません。
* レンダリング中に`ref.current`を読み書きしないでください。これはコンポーネントの動作を予測不可能にします。[初期化](#avoiding-recreating-the-ref-contents)を除いて。
* ストリクトモードでは、Reactは**コンポーネント関数を2回呼び出します**。これは[偶発的な不純物を見つけるのを助けるため](/reference/react/useState#my-initializer-or-updater-function-runs-twice)です。これは開発時のみの動作であり、本番環境には影響しません。各refオブジェクトは2回作成されますが、1つのバージョンは破棄されます。コンポーネント関数が純粋であれば（そうあるべきです）、これは動作に影響しません。

---

## 使用法 {/*usage*/}

### refを使って値を参照する {/*referencing-a-value-with-a-ref*/}

コンポーネントのトップレベルで`useRef`を呼び出して、1つ以上の[ref](/learn/referencing-values-with-refs)を宣言します。

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef`は<CodeStep step={1}>refオブジェクト</CodeStep>を返し、その<CodeStep step={2}>`current`プロパティ</CodeStep>は初期値として提供された<CodeStep step={3}>初期値</CodeStep>に設定されます。

次のレンダリング時には、`useRef`は同じオブジェクトを返します。`current`プロパティを変更して情報を保存し、後で読み取ることができます。これは[状態](/reference/react/useState)を思い出させるかもしれませんが、重要な違いがあります。

**refを変更しても再レンダリングはトリガーされません。** これは、視覚的な出力に影響を与えない情報を保存するのに最適です。例えば、[interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)を保存して後で取得する必要がある場合、refに入れることができます。ref内の値を更新するには、手動でその<CodeStep step={2}>`current`プロパティ</CodeStep>を変更する必要があります：

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

後で、そのinterval IDをrefから読み取って[そのintervalをクリア](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)することができます：

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

refを使用することで、以下のことが保証されます：

- **情報を再レンダリング間で保存**できます（通常の変数とは異なり、再レンダリングごとにリセットされます）。
- 変更しても**再レンダリングはトリガーされません**（状態変数とは異なり、再レンダリングをトリガーします）。
- **情報は各コンポーネントのコピーにローカル**です（外部の変数とは異なり、共有されます）。

refを変更しても再レンダリングはトリガーされないため、画面に表示したい情報を保存するには適していません。そのためには状態を使用してください。[`useRef`と`useState`の選択について詳しく読む](/learn/referencing-values-with-refs#differences-between-refs-and-state)

<Recipes titleText="useRefを使って値を参照する例" titleId="examples-value">

#### クリックカウンター {/*click-counter*/}

このコンポーネントは、ボタンがクリックされた回数を追跡するためにrefを使用します。ここでは、クリック数がイベントハンドラ内でのみ読み書きされるため、状態の代わりにrefを使用しても問題ありません。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

JSX内で`{ref.current}`を表示すると、クリックしても数値は更新されません。これは、`ref.current`を設定しても再レンダリングがトリガーされないためです。レンダリングに使用される情報は状態であるべきです。

<Solution />

#### ストップウォッチ {/*a-stopwatch*/}

この例では、状態とrefの組み合わせを使用します。`startTime`と`now`はレンダリングに使用されるため状態変数です。しかし、ボタンを押してintervalを停止するために[interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)を保持する必要もあります。interval IDはレンダリングに使用されないため、refに保持し、手動で更新するのが適切です。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**レンダリング中に`ref.current`を読み書きしないでください。**

Reactはコンポーネントの本体が[純粋関数のように振る舞う](/learn/keeping-components-pure)ことを期待しています：

- 入力（[props](/learn/passing-props-to-a-component)、[state](/learn/state-a-components-memory)、および[context](/learn/passing-data-deeply-with-context)）が同じであれば、正確に同じJSXを返すべきです。
- 異なる順序や異なる引数で呼び出しても、他の呼び出しの結果に影響を与えるべきではありません。

レンダリング中にrefを読み書きすることは、これらの期待を破ります。

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 レンダリング中にrefを書き込まないでください
  myRef.current = 123;
  // ...
  // 🚩 レンダリング中にrefを読み取らないでください
  return <h1>{myOtherRef.current}</h1>;
}
```

代わりに、イベントハンドラやエフェクトからrefを読み書きできます。

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ エフェクト内でrefを読み書きできます
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ イベントハンドラ内でrefを読み書きできます
    doSomething(myOtherRef.current);
  }
  // ...
}
```

レンダリング中に何かを読み書きする必要がある場合は、代わりに[状態を使用](/reference/react/useState)してください。

これらのルールを破ると、コンポーネントはまだ動作するかもしれませんが、Reactに追加している新しい機能のほとんどはこれらの期待に依存します。[コンポーネントを純粋に保つ方法について詳しく読む](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)

</Pitfall>

---

### refを使ってDOMを操作する {/*manipulating-the-dom-with-a-ref*/}

refを使って[DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API)を操作するのは特に一般的です。Reactはこれをサポートしています。

まず、<CodeStep step={1}>refオブジェクト</CodeStep>を`null`の<CodeStep step={3}>初期値</CodeStep>で宣言します：

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

次に、操作したいDOMノードのJSXに`ref`属性としてrefオブジェクトを渡します：

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

ReactがDOMノードを作成して画面に表示した後、Reactはrefオブジェクトの<CodeStep step={2}>`current`プロパティ</CodeStep>をそのDOMノードに設定します。これで、`<input>`のDOMノードにアクセスし、[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)などのメソッドを呼び出すことができます：

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

Reactはノードが画面から削除されたときに`current`プロパティを`null`に戻します。

[refを使ってDOMを操作する方法について詳しく読む](/learn/manipulating-the-dom-with-refs)

<Recipes titleText="useRefを使ってDOMを操作する例" titleId="examples-dom">

#### テキスト入力にフォーカスする {/*focusing-a-text-input*/}

この例では、ボタンをクリックすると入力にフォーカスが当たります：

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 画像をスクロールして表示する {/*scrolling-an-image-into-view*/}

この例では、ボタンをクリックすると画像が表示されるようにスクロールします。リストのDOMノードにrefを使用し、DOMの[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) APIを呼び出してスクロールしたい画像を見つけます。

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // この行は特定のDOM構造を前提としています：
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### ビデオの再生と一時停止 {/*playing-and-pausing-a-video*/}

この例では、refを使用して`<video>` DOMノードで[`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)と[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)を呼び出します。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### 自分のコンポーネントにrefを公開する {/*exposing-a-ref-to-your-own-component*/}

時々、親コンポーネントがあなたのコンポーネント内のDOMを操作できるようにしたい場合があります。例えば、`MyInput`コンポーネントを作成しているが、親が入力にフォーカスできるようにしたい場合（親はアクセスできません）。`useRef`を使用して入力を保持し、[`forwardRef`](/reference/react/forwardRef)を使用して親コンポーネントに公開することができます。詳細なウォークスルーは[こちら](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)を参照してください。

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### refの内容を再作成しないようにする {/*avoiding-recreating-the-ref-contents*/}

Reactは初期ref値を一度保存し、次のレンダリング時には無視します。

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()`の結果は初回レンダリング時にのみ使用されますが、毎回この関数を呼び出しています。これは高価なオブジェクトを作成している場合、無駄になります。

これを解決するために、次のようにrefを初期化することができます：

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

通常、レンダリング中に`ref.current`を読み書きすることは許可されていません。しかし、この場合は結果が常に同じであり、条件は初期化時にのみ実行されるため、完全に予測可能です。

<DeepDive>

#### useRefを後で初期化する際にnullチェックを避ける方法 {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

型チェッカーを使用していて、常に`null`をチェックしたくない場合は、次のようなパターンを試すことができます：

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

ここで、`playerRef`自体はnull可能です。しかし、`getPlayer()`が`null`を返すケースがないことを型チェッカーに納得させることができるはずです。その後、イベントハンドラ内で`getPlayer()`を使用します。

</DeepDive>

---

## トラブルシューティング {/*troubleshooting*/}

### カスタムコンポーネントにrefを取得できない {/*i-cant-get-a-ref-to-a-custom-component*/}

次のようにして自分のコンポーネントに`ref`を渡そうとすると：

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

コンソールにエラーが表示されるかもしれません：

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

デフォルトでは、自分のコンポーネントは内部のDOMノードにrefを公開しません。

これを修正するには、refを取得したいコンポーネントを見つけます：

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

そして、次のように[`forwardRef`](/reference/react/forwardRef)でラップします：

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

その後、親コンポーネントはそれにrefを取得できます。

[他のコンポーネントのDOMノードにアクセスする方法について詳しく読む](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)