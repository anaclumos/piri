---
title: 一連の状態更新のキューイング
---

<Intro>

状態変数を設定すると、別のレンダーがキューに入ります。しかし、次のレンダーをキューに入れる前に値に対して複数の操作を行いたい場合があります。これを行うには、Reactが状態更新をどのようにバッチ処理するかを理解することが役立ちます。

</Intro>

<YouWillLearn>

* 「バッチ処理」とは何か、そしてReactがそれを使用して複数の状態更新を処理する方法
* 同じ状態変数に対して連続して複数の更新を適用する方法

</YouWillLearn>

## Reactは状態更新をバッチ処理します {/*react-batches-state-updates*/}

`setNumber(number + 1)`を3回呼び出すため、「+3」ボタンをクリックするとカウンターが3回インクリメントされると期待するかもしれません：

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

しかし、前のセクションから思い出すかもしれませんが、[各レンダーの状態値は固定されています](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)ので、最初のレンダーのイベントハンドラー内の`number`の値は常に`0`です。何回`setNumber(1)`を呼び出しても同じです：

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

しかし、ここにはもう一つの要因があります。**Reactはイベントハンドラー内のすべてのコードが実行されるまで状態更新を処理しません。** これが、これらの`setNumber()`呼び出しの後にのみ再レンダーが発生する理由です。

これはレストランで注文を取るウェイターを思い出させるかもしれません。ウェイターは最初の料理の言及でキッチンに走ることはありません！ 代わりに、注文が完了するのを待ち、変更を加えることを許し、テーブルの他の人からの注文も受けます。

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="レストランで注文を複数回行うエレガントなカーソルがReactの役割を果たし、ウェイターの役割を果たします。彼女がsetState()を複数回呼び出した後、ウェイターは彼女が最後に要求したものを最終注文として書き留めます。" />

これにより、複数の状態変数を更新することができ、[再レンダー](/learn/render-and-commit#re-renders-when-state-updates)が多すぎることを防ぎます。しかし、これはまた、イベントハンドラーとその中のコードが完了するまでUIが更新されないことを意味します。この動作は**バッチ処理**とも呼ばれ、Reactアプリをより高速に実行させます。また、変数の一部だけが更新された「半完成」のレンダーに対処する必要がなくなります。

**Reactは複数の意図的なイベント（クリックなど）をまたいでバッチ処理を行いません**—各クリックは個別に処理されます。Reactは一般的に安全である場合にのみバッチ処理を行うので安心してください。例えば、最初のボタンクリックがフォームを無効にした場合、2回目のクリックは再度送信しません。

## 次のレンダーの前に同じ状態を複数回更新する {/*updating-the-same-state-multiple-times-before-the-next-render*/}

これは一般的ではないユースケースですが、次のレンダーの前に同じ状態変数を複数回更新したい場合、`setNumber(number + 1)`のように次の状態値を渡す代わりに、`setNumber(n => n + 1)`のように前のキュー内の状態に基づいて次の状態を計算する*関数*を渡すことができます。これはReactに「状態値で何かをする」ように指示する方法です。

カウンターをインクリメントしてみてください：

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
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

ここで、`n => n + 1`は**アップデータ関数**と呼ばれます。これを状態セッターに渡すと：

1. Reactはこの関数をイベントハンドラー内の他のすべてのコードが実行された後に処理するためにキューに入れます。
2. 次のレンダー中に、Reactはキューを通過し、最終的な更新された状態を提供します。

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Reactがイベントハンドラーを実行しながらこれらのコード行をどのように処理するかを見てみましょう：

1. `setNumber(n => n + 1)`: `n => n + 1`は関数です。Reactはこれをキューに追加します。
1. `setNumber(n => n + 1)`: `n => n + 1`は関数です。Reactはこれをキューに追加します。
1. `setNumber(n => n + 1)`: `n => n + 1`は関数です。Reactはこれをキューに追加します。

次のレンダー中に`useState`を呼び出すと、Reactはキューを通過します。前の`number`状態は`0`だったので、それがReactが最初のアップデータ関数に`n`引数として渡すものです。次に、Reactは前のアップデータ関数の戻り値を取り、それを次のアップデータに`n`として渡します。

|  キューに入れた更新 | `n` | 戻り値 |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

Reactは最終結果として`3`を保存し、それを`useState`から返します。

これが、上記の例で「+3」をクリックすると値が正しく3増加する理由です。
### 状態を置き換えた後に状態を更新するとどうなるか {/*what-happens-if-you-update-state-after-replacing-it*/}

このイベントハンドラーはどうでしょうか？次のレンダーで`number`はどうなると思いますか？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

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
        setNumber(n => n + 1);
      }}>数を増やす</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

このイベントハンドラーがReactに指示する内容は次のとおりです：

1. `setNumber(number + 5)`: `number`は`0`なので、`setNumber(0 + 5)`。Reactは「`5`に置き換える」をキューに追加します。
2. `setNumber(n => n + 1)`: `n => n + 1`はアップデータ関数です。Reactはその関数をキューに追加します。

次のレンダー中に、Reactは状態キューを通過します：

|   キューに入れた更新       | `n` | 戻り値 |
|--------------|---------|-----|
| "replace with `5`" | `0` (未使用) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

Reactは最終結果として`6`を保存し、それを`useState`から返します。 

<Note>

`setState(5)`は実際には`setState(n => 5)`のように機能しますが、`n`は未使用です！

</Note>

### 状態を更新した後に状態を置き換えるとどうなるか {/*what-happens-if-you-replace-state-after-updating-it*/}

もう一つの例を試してみましょう。次のレンダーで`number`はどうなると思いますか？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

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
        setNumber(n => n + 1);
        setNumber(42);
      }}>数を増やす</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Reactがこのイベントハンドラーを実行しながらこれらのコード行をどのように処理するかを見てみましょう：

1. `setNumber(number + 5)`: `number`は`0`なので、`setNumber(0 + 5)`。Reactは「`5`に置き換える」をキューに追加します。
2. `setNumber(n => n + 1)`: `n => n + 1`はアップデータ関数です。Reactはその関数をキューに追加します。
3. `setNumber(42)`: Reactは「`42`に置き換える」をキューに追加します。

次のレンダー中に、Reactは状態キューを通過します：

|   キューに入れた更新       | `n` | 戻り値 |
|--------------|---------|-----|
| "replace with `5`" | `0` (未使用) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "replace with `42`" | `6` (未使用) | `42` |

次にReactは最終結果として`42`を保存し、それを`useState`から返します。

要約すると、`setNumber`状態セッターに渡すものを次のように考えることができます：

* **アップデータ関数**（例：`n => n + 1`）はキューに追加されます。
* **その他の値**（例：数値`5`）は「`5`に置き換える」をキューに追加し、既にキューにあるものを無視します。

イベントハンドラーが完了した後、Reactは再レンダーをトリガーします。再レンダー中に、Reactはキューを処理します。アップデータ関数はレンダリング中に実行されるため、**アップデータ関数は[純粋](/learn/keeping-components-pure)**でなければならず、結果を*返す*だけです。内部から状態を設定したり、他の副作用を実行しようとしないでください。Strict Modeでは、Reactは各アップデータ関数を2回実行します（ただし2回目の結果は破棄されます）ので、ミスを見つけるのに役立ちます。

### 命名規則 {/*naming-conventions*/}

アップデータ関数の引数を対応する状態変数の最初の文字で命名するのが一般的です：

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

より冗長なコードを好む場合、もう一つの一般的な規則は、状態変数名を繰り返すことです。例えば、`setEnabled(enabled => !enabled)`や、`setEnabled(prevEnabled => !prevEnabled)`のようにプレフィックスを使用することです。

<Recap>

* 状態を設定しても既存のレンダー内の変数は変更されませんが、新しいレンダーを要求します。
* Reactはイベントハンドラーが実行を終了した後に状態更新を処理します。これをバッチ処理と呼びます。
* 一つのイベントで複数回状態を更新するには、`setNumber(n => n + 1)`アップデータ関数を使用できます。

</Recap>



<Challenges>

#### リクエストカウンターを修正する {/*fix-a-request-counter*/}

アートアイテムの複数の注文を同時にユーザーが送信できるアートマーケットプレイスアプリに取り組んでいます。ユーザーが「購入」ボタンを押すたびに、「保留中」カウンターが1増加する必要があります。3秒後に「保留中」カウンターが減少し、「完了」カウンターが増加します。

しかし、「保留中」カウンターは意図した通りに動作しません。「購入」を押すと、`-1`に減少します（これは不可能なはずです！）。そして、素早く2回クリックすると、両方のカウンターが予測不可能に動作するようです。

なぜこれが起こるのでしょうか？両方のカウンターを修正してください。

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        購入     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

`handleClick`イベントハンドラー内では、`pending`と`completed`の値はクリックイベント時のもので対応しています。最初のレンダーでは、`pending`は`0`だったので、`setPending(pending - 1)`は`setPending(-1)`となり、これは間違っています。カウンターを*インクリメント*または*デクリメント*したいので、クリック時に決定された具体的な値を設定するのではなく、アップデータ関数を渡すことができます：

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        購入     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

これにより、カウンターをインクリメントまたはデクリメントする際に、クリック時の状態ではなく*最新の*状態に対して行うことが保証されます</Solution>

#### 状態キューを自分で実装する {/*implement-the-state-queue-yourself*/}

このチャレンジでは、Reactの一部をゼロから再実装します！それほど難しくはありません。

サンドボックスのプレビューをスクロールしてください。**4つのテストケース**が表示されます。これらは、このページで見た例に対応しています。あなたのタスクは、`getFinalState`関数を実装して、それぞれのケースに対して正しい結果を返すことです。正しく実装すれば、4つのテストすべてがパスするはずです。

2つの引数を受け取ります：`baseState`は初期状態（例えば`0`）、`queue`は追加された順に数値（例えば`5`）とアップデータ関数（例えば`n => n + 1`）の混合を含む配列です。

あなたのタスクは、最終的な状態を返すことです。このページの表が示すように！

<Hint>

行き詰まった場合は、このコード構造から始めてください：

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: アップデータ関数を適用する
    } else {
      // TODO: 状態を置き換える
    }
  }

  return finalState;
}
```

欠けている行を埋めてください！

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: キューで何かをする...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

これは、このページで説明されているReactが最終状態を計算するために使用する正確なアルゴリズムです：

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // アップデータ関数を適用する
      finalState = update(finalState);
    } else {
      // 次の状態を置き換える
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

これでReactのこの部分がどのように機能するかがわかりました！

</Solution>

</Challenges>