---
title: Refsを使った値の参照
---

<Intro>

コンポーネントがいくつかの情報を「記憶」する必要があるが、その情報が[新しいレンダーを引き起こさない](/learn/render-and-commit)場合、*ref*を使用できます。

</Intro>

<YouWillLearn>

- コンポーネントにrefを追加する方法
- refの値を更新する方法
- refとstateの違い
- refを安全に使用する方法

</YouWillLearn>

## コンポーネントにrefを追加する {/*adding-a-ref-to-your-component*/}

`useRef`フックをReactからインポートすることで、コンポーネントにrefを追加できます。

```js
import { useRef } from 'react';
```

コンポーネント内で、`useRef`フックを呼び出し、参照したい初期値を唯一の引数として渡します。例えば、値`0`へのrefは次のようになります。

```js
const ref = useRef(0);
```

`useRef`は次のようなオブジェクトを返します。

```js
{ 
  current: 0 // useRefに渡した値
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="「current」と書かれた矢印が「ref」と書かれたポケットに詰め込まれている。" />

そのrefの現在の値には`ref.current`プロパティを通じてアクセスできます。この値は意図的に変更可能であり、読み取りと書き込みの両方が可能です。これは、Reactが追跡しないコンポーネントの秘密のポケットのようなものです。（これがReactの一方向データフローからの「エスケープハッチ」と呼ばれる理由です—詳細は以下で説明します！）

ここでは、ボタンがクリックされるたびに`ref.current`をインクリメントします。

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

refは数値を指していますが、[state](/learn/state-a-components-memory)のように、文字列、オブジェクト、さらには関数を指すこともできます。stateとは異なり、refは`current`プロパティを持つ単純なJavaScriptオブジェクトであり、読み取りと変更が可能です。

**コンポーネントはインクリメントごとに再レンダリングされない**ことに注意してください。stateのように、refsは再レンダリング間でReactによって保持されます。しかし、stateを設定するとコンポーネントが再レンダリングされます。refを変更しても再レンダリングは発生しません！

## 例: ストップウォッチの作成 {/*example-building-a-stopwatch*/}

refsとstateを1つのコンポーネントで組み合わせることができます。例えば、ユーザーがボタンを押してストップウォッチを開始または停止できるようにしましょう。ユーザーが「開始」ボタンを押してから経過した時間を表示するには、「開始」ボタンが押された時刻と現在の時刻を追跡する必要があります。**この情報はレンダリングに使用されるため、stateに保持します。**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

ユーザーが「開始」を押すと、[`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval)を使用して10ミリ秒ごとに時刻を更新します。

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // カウントを開始します。
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // 10ミリ秒ごとに現在の時刻を更新します。
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>経過時間: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        開始
      </button>
    </>
  );
}
```

</Sandpack>

「停止」ボタンが押されたとき、既存のインターバルをキャンセルして`now` state変数の更新を停止する必要があります。これを行うには、[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)を呼び出しますが、ユーザーが開始を押したときに`setInterval`呼び出しによって以前に返されたインターバルIDを渡す必要があります。このインターバルIDをどこかに保持する必要があります。**インターバルIDはレンダリングには使用されないため、refに保持できます。**

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
      <h1>経過時間: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        開始
      </button>
      <button onClick={handleStop}>
        停止
      </button>
    </>
  );
}
```

</Sandpack>

レンダリングに使用される情報はstateに保持します。イベントハンドラでのみ必要で、変更しても再レンダリングが不要な情報は、refを使用する方が効率的です。

## refsとstateの違い {/*differences-between-refs-and-state*/}

おそらく、refsはstateよりも「厳しくない」と感じるかもしれません。例えば、state設定関数を常に使用する必要があるのではなく、refsを変更できます。しかし、ほとんどの場合、stateを使用することをお勧めします。refsはあまり頻繁に必要としない「エスケープハッチ」です。stateとrefsの比較は次の通りです。

| refs                                                                                  | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)`は`{ current: initialValue }`を返します                            | `useState(initialValue)`はstate変数の現在の値とstate設定関数（ `[value, setValue]`）を返します |
| 変更しても再レンダリングを引き起こしません。                                         | 変更すると再レンダリングを引き起こします。                                                                                    |
| 変更可能—レンダリングプロセスの外で`current`の値を変更および更新できます。 | 「不変」—state変数を変更するにはstate設定関数を使用して再レンダリングをキューに入れる必要があります。                       |
| レンダリング中に`current`の値を読み取ったり書き込んだりしないでください。 | いつでもstateを読み取ることができます。ただし、各レンダリングには変更されないstateの[スナップショット](/learn/state-as-a-snapshot)があります。

ここにstateで実装されたカウンターボタンがあります。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

`count`の値が表示されるため、state値を使用するのが理にかなっています。カウンターの値が`setCount()`で設定されると、Reactはコンポーネントを再レンダリングし、画面が新しいカウントを反映するように更新されます。

これをrefで実装しようとすると、Reactはコンポーネントを再レンダリングしないため、カウントが変わるのを見ることはできません！このボタンをクリックしても**テキストが更新されない**ことを確認してください。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // これではコンポーネントが再レンダリングされません！
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

これが、レンダリング中に`ref.current`を読み取ることが信頼性の低いコードにつながる理由です。これが必要な場合は、代わりにstateを使用してください。

<DeepDive>

#### useRefの内部動作 {/*how-does-use-ref-work-inside*/}

`useState`と`useRef`はどちらもReactによって提供されていますが、原則として`useRef`は`useState`の上に実装することができます。Reactの内部で`useRef`が次のように実装されていると想像できます。

```js
// Reactの内部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

最初のレンダリング中に、`useRef`は`{ current: initialValue }`を返します。このオブジェクトはReactによって保存されるため、次のレンダリング中には同じオブジェクトが返されます。この例ではstateセッターが使用されていないことに注意してください。`useRef`は常に同じオブジェクトを返す必要があるため、不要です！

`useRef`は実際には一般的なstate変数でセッターがないものと考えることができます。オブジェクト指向プログラミングに慣れている場合、refsはインスタンスフィールドを思い出させるかもしれませんが、`this.something`の代わりに`somethingRef.current`と書きます。

</DeepDive>

## refsを使用するタイミング {/*when-to-use-refs*/}

通常、コンポーネントがReactの外に「ステップアウト」して外部APIと通信する必要がある場合にrefを使用します。多くの場合、コンポーネントの外観に影響を与えないブラウザAPIです。以下はそのような稀な状況のいくつかです。

- [タイムアウトID](https://developer.mozilla.org/docs/Web/API/setTimeout)の保存
- [DOM要素](https://developer.mozilla.org/docs/Web/API/Element)の保存と操作（次のページで説明します）[the next page](/learn/manipulating-the-dom-with-refs)
- JSXを計算するために必要ない他のオブジェクトの保存

コンポーネントが値を保存する必要があるが、それがレンダリングロジックに影響を与えない場合は、refsを選択します。

## refsのベストプラクティス {/*best-practices-for-refs*/}

これらの原則に従うことで、コンポーネントがより予測可能になります。

- **refsをエスケープハッチとして扱う。** refsは外部システムやブラウザAPIと連携する際に役立ちます。アプリケーションロジックやデータフローの多くがrefsに依存している場合は、アプローチを再考する必要があるかもしれません。
- **レンダリング中に`ref.current`を読み書きしない。** レンダリング中に必要な情報は[state](/learn/state-a-components-memory)を使用してください。Reactは`ref.current`が変更されたときに認識しないため、レンダリング中にそれを読み取ることはコンポーネントの動作を予測しにくくします。（唯一の例外は、`if (!ref.current) ref.current = new Thing()`のようなコードで、最初のレンダリング中にのみrefを設定する場合です。）

React stateの制限はrefsには適用されません。例えば、stateは[各レンダリングのスナップショット](/learn/state-as-a-snapshot)のように機能し、[同期的に更新されません。](/learn/queueing-a-series-of-state-updates) しかし、refの現在の値を変更すると、即座に変更されます。

```js
ref.current = 5;
console.log(ref.current); // 5
```

これは**ref自体が通常のJavaScriptオブジェクトである**ため、そのように動作するからです。

また、refを操作する際に[ミューテーションを避ける](/learn/updating-objects-in-state)ことを心配する必要もありません。レンダリングに使用されないオブジェクトを操作している限り、Reactはrefやその内容に対して何をしても気にしません。

## refsとDOM {/*refs-and-the-dom*/}

refは任意の値を指すことができます。しかし、refの最も一般的な使用例はDOM要素にアクセスすることです。例えば、プログラム的に入力にフォーカスを当てたい場合に便利です。JSXで`<div ref={myRef}>`のように`ref`属性にrefを渡すと、Reactは対応するDOM要素を`myRef.current`に入れます。要素がDOMから削除されると、Reactは`myRef.current`を`null`に更新します。詳細は[Manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs)で読むことができます。

<Recap>

- refsはレンダリングに使用されない値を保持するためのエスケープハッチです。頻繁には必要ありません。
- refは`current`という単一のプロパティを持つ単純なJavaScriptオブジェクトです。読み取りや設定が可能です。
- `useRef`フックを呼び出すことでReactにrefを要求できます。
- stateのように、refsはコンポーネントの再レンダリング間で情報を保持します。
- stateとは異なり、refの`current`値を設定しても再レンダリングは発生しません。
- レンダリング中に`ref.current`を読み書きしないでください。これにより、コンポーネントの予測が難しくなります。

</Recap>

<Challenges>

#### 壊れたチャット入力を修正する {/*fix-a-broken-chat-input*/}

メッセージを入力して「送信」をクリックします。「送信済み！」のアラートが表示されるまでに3秒の遅延があることに気付くでしょう。この遅延中に「元に戻す」ボタンが表示されます。これをクリックします。この「元に戻す」ボタンは、`handleSend`中に保存されたタイムアウトIDに対して[`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)を呼び出すことで「送信済み！」メッセージの表示を停止することになっています。しかし、「元に戻す」をクリックしても「送信済み！」メッセージが表示されます。なぜ機能しないのかを見つけて修正してください。

<Hint>

`let timeoutID`のような通常の変数は、再レンダリング間で「生き残る」ことができません。なぜなら、各レンダリングはコンポーネントを実行し（変数を初期化し）直すからです。タイムアウトIDを他の場所に保持する必要がありますか？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

コンポーネントが再レンダリングされるたびに（例えばstateを設定したとき）、すべてのローカル変数が最初から初期化されます。これが、ローカル変数`timeoutID`にタイムアウトIDを保存しても、将来のイベントハンドラがそれを「見る」ことができない理由です。代わりに、Reactがレンダリング間で保持するrefに保存します。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>

#### コンポーネントが再レンダリングされない問題を修正する {/*fix-a-component-failing-to-re-render*/}

このボタンは「On」と「Off」を切り替えるはずですが、常に「Off」と表示されます。このコードの何が問題ですか？修正してください。

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

この例では、refの現在の値がレンダリング出力を計算するために使用されています：`{isOnRef.current ? 'On' : 'Off'}`。これは、この情報がrefではなくstateにあるべきであることを示しています。修正するには、refを削除し、代わりにstateを使用します。

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### デバウンスの修正 {/*fix-debouncing*/}

この例では、すべてのボタンクリックハンドラが["デバウンス"](https://redd.one/blog/debounce-vs-throttle)されています。これが何を意味するかを見るために、ボタンの1つを押してください。メッセージが1秒後に表示されることに気付くでしょう。待っている間にボタンを押すと、タイマーがリセットされます。したがって、同じボタンを何度も素早くクリックし続けると、メッセージはクリックを止めた1秒*後*に表示されます。デバウンスは、ユーザーが「何かをやめる」までアクションを遅らせることを可能にします。

この例は動作しますが、意図した通りには動作しません。ボタンは独立していません。問題を見るために、1つのボタンをクリックし、すぐに別のボタンをクリックしてください。遅延後に両方のボタンのメッセージが表示されることを期待しますが、最後のボタンのメッセージだけが表示されます。最初のボタンのメッセージは失われます。

なぜボタンが互いに干渉しているのでしょうか？問題を見つけて修正してください。

<Hint>

最後のタイムアウトID変数はすべての`DebouncedButton`コンポーネント間で共有されています。これが、1つのボタンをクリックすると他のボタンのタイムアウトがリセットされる理由です。各ボタンに別々のタイムアウトIDを保存できますか？

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

`timeoutID`のような変数はすべてのコンポーネント間で共有されます。これが、2番目のボタンをクリックすると最初のボタンの保留中のタイムアウトがリセットされる理由です。これを修正するには、タイムアウトをrefに保持します。各ボタンは独自のrefを取得するため、互いに干渉しません。2つのボタンを素早くクリックすると、両方のメッセージが表示されることに注意してください。

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### 最新のstateを読み取る {/*read-the-latest-state*/}

この例では、「送信」を押すと、メッセージが表示されるまでに少し遅延があります。「hello」と入力し、「送信」を押してからすぐに入力を再度編集します。編集にもかかわらず、アラートには依然として「hello」と表示されます（これはボタンがクリックされた[時点の](/learn/state-as-a-snapshot#state-over-time)stateの値です）。

通常、この動作はアプリで望ましいものです。しかし、非同期コードが最新のstateバージョンを読み取る必要がある場合もあります。アラートがクリック時のテキストではなく、*現在の*入力テキストを表示するようにする方法を考えられますか？

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

stateは[スナップショットのように機能する](/learn/state-as-a-snapshot)ため、非同期操作（タイムアウトなど）から最新のstateを読み取ることはできません。しかし、最新の入力テキストをrefに保持することができます。refは変更可能であるため、`current`プロパティをいつでも読み取ることができます。現在のテキストもレンダリングに使用されるため、この例では*state変数*（レンダリング用）と*ref*（タイムアウトで読み取る用）の両方が必要です。現在のref値を手動で更新する必要があります。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>