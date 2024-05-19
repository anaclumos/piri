---
title: スナップショットとしての状態
---

<Intro>

状態変数は、読み書きできる通常のJavaScript変数のように見えるかもしれません。しかし、状態はスナップショットのように振る舞います。設定しても既存の状態変数は変わらず、再レンダリングをトリガーします。

</Intro>

<YouWillLearn>

* 状態を設定することで再レンダリングがトリガーされる仕組み
* 状態がいつ、どのように更新されるか
* 状態が設定直後に即座に更新されない理由
* イベントハンドラーが状態の「スナップショット」にアクセスする方法

</YouWillLearn>

## 状態の設定がレンダリングをトリガーする {/*setting-state-triggers-renders*/}

ユーザーインターフェースがクリックなどのユーザーイベントに直接反応して変化するように考えるかもしれません。Reactでは、このメンタルモデルとは少し異なります。前のページで、[状態の設定がReactに再レンダリングを要求する](/learn/render-and-commit#step-1-trigger-a-render)ことを見ました。つまり、インターフェースがイベントに反応するためには、*状態を更新する*必要があります。

この例では、「送信」ボタンを押すと、`setIsSent(true)`がReactにUIを再レンダリングするよう指示します：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

ボタンをクリックすると次のことが起こります：

1. `onSubmit`イベントハンドラーが実行されます。
2. `setIsSent(true)`が`isSent`を`true`に設定し、新しいレンダリングをキューに入れます。
3. Reactは新しい`isSent`の値に基づいてコンポーネントを再レンダリングします。

状態とレンダリングの関係を詳しく見てみましょう。

## レンダリングは時間のスナップショットを取る {/*rendering-takes-a-snapshot-in-time*/}

["レンダリング"](/learn/render-and-commit#step-2-react-renders-your-components)とは、Reactがコンポーネント（関数）を呼び出すことを意味します。その関数から返されるJSXは、時間の中のUIのスナップショットのようなものです。そのプロップス、イベントハンドラー、およびローカル変数はすべて、**レンダリング時の状態を使用して計算されました。**

写真や映画のフレームとは異なり、返されるUIの「スナップショット」はインタラクティブです。入力に対する反応を指定するイベントハンドラーのようなロジックが含まれています。Reactはこのスナップショットに合わせて画面を更新し、イベントハンドラーを接続します。その結果、ボタンを押すとJSXのクリックハンドラーがトリガーされます。

Reactがコンポーネントを再レンダリングする場合：

1. Reactは再び関数を呼び出します。
2. 関数は新しいJSXスナップショットを返します。
3. Reactはその関数が返したスナップショットに合わせて画面を更新します。

<IllustrationBlock sequential>
    <Illustration caption="Reactが関数を実行する" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="スナップショットを計算する" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOMツリーを更新する" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

コンポーネントのメモリとしての状態は、関数が返された後に消える通常の変数のようなものではありません。状態は実際にはReact自体に「棚の上にあるかのように」存在します。Reactがコンポーネントを呼び出すと、その特定のレンダリングの状態のスナップショットが提供されます。コンポーネントは、レンダリング時の状態値を使用して計算された新しいプロップスとイベントハンドラーを含むUIのスナップショットを返します。

<IllustrationBlock sequential>
  <Illustration caption="Reactに状態を更新するよう指示する" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="Reactが状態値を更新する" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="Reactがコンポーネントに状態値のスナップショットを渡す" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

これがどのように機能するかを示す小さな実験があります。この例では、`setNumber(number + 1)`を3回呼び出すため、「+3」ボタンをクリックするとカウンターが3回インクリメントされると予想するかもしれません。

「+3」ボタンをクリックするとどうなるか見てみましょう：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

`number`がクリックごとに1回しかインクリメントされないことに注意してください！

**状態の設定は、*次の*レンダリングのためにのみ変更されます。** 最初のレンダリング中、`number`は`0`でした。これが、*そのレンダリングの*`onClick`ハンドラーで、`setNumber(number + 1)`が呼び出された後でも`number`の値が常に`0`である理由です：

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

このボタンのクリックハンドラーがReactに指示することは次のとおりです：

1. `setNumber(number + 1)`: `number`は`0`なので`setNumber(0 + 1)`。
    - Reactは次のレンダリングで`number`を`1`に変更する準備をします。
2. `setNumber(number + 1)`: `number`は`0`なので`setNumber(0 + 1)`。
    - Reactは次のレンダリングで`number`を`1`に変更する準備をします。
3. `setNumber(number + 1)`: `number`は`0`なので`setNumber(0 + 1)`。
    - Reactは次のレンダリングで`number`を`1`に変更する準備をします。

`setNumber(number + 1)`を3回呼び出しても、*このレンダリングの*イベントハンドラーでは`number`は常に`0`なので、状態を3回`1`に設定します。これが、イベントハンドラーが終了した後、Reactが`number`を`3`ではなく`1`に設定してコンポーネントを再レンダリングする理由です。

コード内の状態変数をその値で置き換えることで、これを視覚化することもできます。*このレンダリング*の`number`状態変数が`0`であるため、そのイベントハンドラーは次のようになります：

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

次のレンダリングでは、`number`は`1`なので、*そのレンダリング*のクリックハンドラーは次のようになります：

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

これが、ボタンを再度クリックするとカウンターが`2`に設定され、次のクリックで`3`に設定される理由です。

## 時間経過による状態 {/*state-over-time*/}

さて、楽しかったですね。このボタンをクリックすると何がアラートされるか予想してみてください：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

前述の置換方法を使用すると、アラートは「0」を表示することが予想されます：

```js
setNumber(0 + 5);
alert(0);
```

しかし、アラートにタイマーを設定し、コンポーネントが再レンダリングされた後にのみ発火するようにした場合はどうでしょうか？「0」または「5」と表示されるでしょうか？予想してみてください！

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

驚きましたか？置換方法を使用すると、アラートに渡される状態の「スナップショット」が見えます。

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

アラートが実行される時点でReactに保存されている状態は変更されているかもしれませんが、それはユーザーが操作した時点の状態のスナップショットを使用してスケジュールされました！

**状態変数の値はレンダリング中には決して変わりません。** たとえそのイベントハンドラーのコードが非同期であっても、そのレンダリングの`onClick`内では、`setNumber(number + 5)`が呼び出された後でも`number`の値は`0`のままです。その値は、Reactがコンポーネントを呼び出してUIのスナップショットを取ったときに「固定」されました。

これが、イベントハンドラーがタイミングのミスに対してより耐性がある理由です。以下は、メッセージを5秒遅延で送信するフォームの例です。このシナリオを想像してください：

1. 「送信」ボタンを押して、アリスに「Hello」を送信します。
2. 5秒の遅延が終了する前に、「To」フィールドの値を「Bob」に変更します。

`alert`には何が表示されると思いますか？「You said Hello to Alice」と表示されるでしょうか？それとも「You said Hello to Bob」と表示されるでしょうか？知っていることに基づいて予想し、試してみてください：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**Reactは1つのレンダリングのイベントハンドラー内で状態値を「固定」します。** コードが実行されている間に状態が変更されたかどうかを心配する必要はありません。

しかし、再レンダリング前に最新の状態を読みたい場合はどうでしょうか？次のページで説明する[状態アップデータ関数](/learn/queueing-a-series-of-state-updates)を使用する必要があります！

<Recap>

* 状態の設定は新しいレンダリングを要求します。
* Reactは状態をコンポーネントの外部に保存します。
* `useState`を呼び出すと、Reactは*そのレンダリング*の状態のスナップショットを提供します。
* 変数とイベントハンドラーは再レンダリングを「生き延びる」ことはありません。各レンダリングには独自のイベントハンドラーがあります。
* 各レンダリング（およびその内部の関数）は常に*その*レンダリングにReactが提供した状態のスナップショットを「見る」ことができます。
* イベントハンドラー内で状態を置換することを考えると、レンダリングされたJSXと同様に考えることができます。
* 過去に作成されたイベントハンドラーは、それが作成されたレンダリングの状態値を持っています。

</Recap>

<Challenges>

#### 交通信号を実装する {/*implement-a-traffic-light*/}

ここに、ボタンが押されると切り替わる横断歩道の信号コンポーネントがあります：

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

クリックハンドラーに`alert`を追加してください。信号が緑で「Walk」と表示されているときにボタンをクリックすると、「Stop is next」と表示されるべきです。信号が赤で「Stop」と表示されているときにボタンをクリックすると、「Walk is next」と表示されるべきです。

`alert`を`setWalk`呼び出しの前に置くか後に置くかで違いはありますか？

<Solution>

`alert`は次のようにするべきです：

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

`setWalk`呼び出しの前に置くか後に置くかは関係ありません。そのレンダリングの`walk`の値は固定されています。`setWalk`を呼び出すことで、*次の*レンダリングのためにのみ変更されますが、前のレンダリングのイベントハンドラーの影響を受けません。

この行は最初は直感に反するかもしれません：

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

しかし、「信号が現在「Walk」を表示している場合、メッセージは「次はStop」と表示されるべきだ」と読むと意味が通ります。イベントハンドラー内の`walk`変数はそのレンダリングの`walk`の値と一致し、変更されません。

置換方法を適用して正しいことを確認できます。`walk`が`true`の場合、次のようになります：

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

したがって、「Change to Stop」をクリックすると、`walk`が`false`に設定されたレンダリングがキューに入り、「Stop is next」とアラートされます。

</Solution>

</Challenges>