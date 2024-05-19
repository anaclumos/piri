---
title: 入力に対する反応と状態
---

<Intro>

ReactはUIを操作するための宣言的な方法を提供します。UIの個々の部分を直接操作するのではなく、コンポーネントが取り得るさまざまな状態を記述し、ユーザー入力に応じてそれらの間を切り替えます。これはデザイナーがUIを考える方法に似ています。

</Intro>

<YouWillLearn>

* 宣言的UIプログラミングが命令的UIプログラミングとどのように異なるか
* コンポーネントが取り得るさまざまな視覚的状態を列挙する方法
* コードからさまざまな視覚的状態の間の変更を引き起こす方法

</YouWillLearn>

## 宣言的UIと命令的UIの比較 {/*how-declarative-ui-compares-to-imperative*/}

UIのインタラクションを設計する際、ユーザーのアクションに応じてUIがどのように*変化するか*を考えることが多いでしょう。例えば、ユーザーが回答を送信できるフォームを考えてみましょう：

* フォームに何かを入力すると、「送信」ボタンが**有効になります。**
* 「送信」を押すと、フォームとボタンの両方が**無効になり、**スピナーが**表示されます。**
* ネットワークリクエストが成功すると、フォームが**非表示になり、**「ありがとう」メッセージが**表示されます。**
* ネットワークリクエストが失敗すると、エラーメッセージが**表示され、**フォームが再び**有効になります。**

**命令的プログラミング**では、上記はインタラクションを実装する方法に直接対応します。何が起こったかに応じてUIを操作するための正確な指示を書かなければなりません。これを別の方法で考えてみましょう：車の隣に座っている人に、どこに行くかを一つ一つ指示することを想像してください。

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="JavaScriptを表す不安そうな人が運転する車の中で、乗客が運転手に複雑な道順を一つ一つ指示している。" />

彼らはあなたがどこに行きたいのかを知りません、ただあなたの指示に従うだけです。（そして、もし指示を間違えれば、間違った場所に行ってしまいます！）これは*命令的*と呼ばれます。なぜなら、スピナーからボタンまで各要素に*どのように*UIを更新するかを「命令」しなければならないからです。

この命令的UIプログラミングの例では、フォームはReactを使わずに構築されています。ブラウザの[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)のみを使用しています：

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

UIを命令的に操作することは、孤立した例では十分に機能しますが、より複雑なシステムでは管理が指数関数的に難しくなります。このようなフォームがたくさんあるページを更新することを想像してみてください。新しいUI要素や新しいインタラクションを追加するには、既存のコードを慎重にチェックして、バグを導入していないことを確認する必要があります（例えば、何かを表示または非表示にするのを忘れるなど）。

Reactはこの問題を解決するために作られました。

Reactでは、UIを直接操作することはありません。つまり、コンポーネントを直接有効化、無効化、表示、非表示にすることはありません。代わりに、**表示したいものを宣言し、**ReactがUIをどのように更新するかを判断します。タクシーに乗って運転手に行きたい場所を伝えるのと同じように、どこで曲がるかを正確に指示するのではなく、運転手に目的地を伝えるだけです。運転手の仕事はあなたをそこに連れて行くことであり、あなたが考慮していないショートカットを知っているかもしれません！

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="Reactが運転する車の中で、乗客が特定の場所に連れて行ってほしいと頼んでいる。Reactがそれをどうやって行うかを考える。" />

## 宣言的にUIを考える {/*thinking-about-ui-declaratively*/}

上記でフォームを命令的に実装する方法を見ました。Reactで考える方法をよりよく理解するために、以下でこのUIをReactで再実装する手順を見ていきます：

1. コンポーネントのさまざまな視覚的状態を**特定する**
2. それらの状態変化を引き起こすトリガーを**決定する**
3. `useState`を使用して状態をメモリに**表現する**
4. 不要な状態変数を**削除する**
5. イベントハンドラを状態設定に**接続する**

### ステップ1: コンポーネントのさまざまな視覚的状態を特定する {/*step-1-identify-your-components-different-visual-states*/}

コンピュータサイエンスでは、["状態機械"](https://en.wikipedia.org/wiki/Finite-state_machine)がいくつかの「状態」の一つにあると聞くことがあります。デザイナーと協力する場合、さまざまな「視覚的状態」のモックアップを見たことがあるかもしれません。Reactはデザインとコンピュータサイエンスの交差点に位置しているため、これらのアイデアの両方がインスピレーションの源となります。

まず、ユーザーが見る可能性のあるUIのさまざまな「状態」を視覚化する必要があります：

* **空**: フォームには無効な「送信」ボタンがあります。
* **入力中**: フォームには有効な「送信」ボタンがあります。
* **送信中**: フォームは完全に無効です。スピナーが表示されます。
* **成功**: フォームの代わりに「ありがとう」メッセージが表示されます。
* **エラー**: 入力中の状態と同じですが、追加のエラーメッセージがあります。

デザイナーのように、ロジックを追加する前にさまざまな状態の「モックアップ」または「モック」を作成したいと思うでしょう。例えば、ここではフォームの視覚的部分だけのモックがあります。このモックはデフォルト値が`'empty'`の`status`というプロップによって制御されています：

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

そのプロップの名前は何でも構いません、名前は重要ではありません。`status = 'empty'`を`status = 'success'`に編集して成功メッセージが表示されるのを試してみてください。モックを作成することで、ロジックを接続する前にUIを迅速に反復することができます。ここでは、同じコンポーネントのより詳細なプロトタイプを示します。まだ`status`プロップによって「制御」されています：

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### 多くの視覚的状態を一度に表示する {/*displaying-many-visual-states-at-once*/}

コンポーネントに多くの視覚的状態がある場合、それらを一つのページに表示するのが便利です：

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

このようなページは「リビングスタイルガイド」や「ストーリーブック」と呼ばれることがよくあります。

</DeepDive>

### ステップ2: それらの状態変化を引き起こすトリガーを決定する {/*step-2-determine-what-triggers-those-state-changes*/}

状態更新を引き起こす入力には2種類あります：

* **人間の入力**：ボタンをクリックする、フィールドに入力する、リンクをナビゲートするなど。
* **コンピュータの入力**：ネットワーク応答が到着する、タイムアウトが完了する、画像が読み込まれるなど。

<IllustrationBlock>
  <Illustration caption="人間の入力" alt="指。" src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="コンピュータの入力" alt="1と0。" src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

どちらの場合も、**UIを更新するために[状態変数](/learn/state-a-components-memory#anatomy-of-usestate)を設定する必要があります。** 開発中のフォームでは、いくつかの異なる入力に応じて状態を変更する必要があります：

* **テキスト入力の変更**（人間）は、テキストボックスが空かどうかに応じて*空*状態から*入力中*状態またはその逆に切り替える必要があります。
* **送信ボタンのクリック**（人間）は、*送信中*状態に切り替える必要があります。
* **成功したネットワーク応答**（コンピュータ）は、*成功*状態に切り替える必要があります。
* **失敗したネットワーク応答**（コンピュータ）は、対応するエラーメッセージとともに*エラー*状態に切り替える必要があります。

<Note>

人間の入力はしばしば[イベントハンドラ](/learn/responding-to-events)を必要とすることに注意してください！

</Note>

このフローを視覚化するために、各状態をラベル付きの円として紙に描き、2つの状態間の各変更を矢印として描いてみてください。このように多くのフローをスケッチし、実装前にバグを解決することができます。

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="左から右に移動するフローチャートで、5つのノードがあります。最初のノードは「empty」とラベル付けされており、「start typing」とラベル付けされたエッジが「typing」とラベル付けされたノードに接続されています。そのノードには「press submit」とラベル付けされたエッジがあり、「submitting」とラベル付けされたノードに接続されています。このノードには2つのエッジがあります。左のエッジは「network error」とラベル付けされ、「error」とラベル付けされたノードに接続されています。右のエッジは「network success」とラベル付けされ、「success」とラベル付けされたノードに接続されています。">

フォームの状態

</Diagram>

</DiagramGroup>

### ステップ3: `useState`で状態をメモリに表現する {/*step-3-represent-the-state-in-memory-with-usestate*/}

次に、コンポーネントの視覚的状態を[`useState`](/reference/react/useState)でメモリに表現する必要があります。シンプルさが鍵です：各状態は「動く部分」であり、**「動く部分」をできるだけ少なくしたい**のです。複雑さが増すとバグが増えます！

まず、*絶対に必要な*状態から始めます。例えば、入力の`answer`と、最後のエラーを保存するための`error`が必要です：

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

次に、表示したい視覚的状態を表す状態変数が必要です。これをメモリに表現する方法は通常複数ありますので、試行錯誤が必要です。

最適な方法をすぐに思いつかない場合は、すべての可能な視覚的状態がカバーされていることを*確実に*するために十分な状態を追加することから始めます：

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError,
setIsError] = useState(false);
```

最初のアイデアはおそらく最良ではありませんが、それで構いません。状態のリファクタリングはプロセスの一部です！

### ステップ4: 不要な状態変数を削除する {/*step-4-remove-any-non-essential-state-variables*/}

状態の内容の重複を避けることで、追跡する必要があるのは本質的なものだけになります。状態構造のリファクタリングに少し時間をかけることで、コンポーネントが理解しやすくなり、重複が減り、意図しない意味を避けることができます。目標は、**メモリ内の状態がユーザーに見せたい有効なUIを表さない場合を防ぐことです。**（例えば、エラーメッセージを表示し、同時に入力を無効にすると、ユーザーはエラーを修正できなくなります！）

状態変数について以下の質問をすることができます：

* **この状態は矛盾を引き起こしますか？** 例えば、`isTyping`と`isSubmitting`は同時に`true`にはなりません。矛盾は通常、状態が十分に制約されていないことを意味します。2つのブール値の組み合わせは4つありますが、有効な状態に対応するのは3つだけです。「不可能な」状態を取り除くために、これらを`status`に統合し、3つの値のいずれかでなければならないようにします：`'typing'`、`'submitting'`、または`'success'`。
* **同じ情報が既に他の状態変数にありますか？** もう一つの矛盾：`isEmpty`と`isTyping`は同時に`true`にはなりません。これらを別々の状態変数にすることで、同期が取れずバグを引き起こすリスクがあります。幸いなことに、`isEmpty`を削除し、代わりに`answer.length === 0`をチェックすることができます。
* **他の状態変数の逆から同じ情報を得ることができますか？** `isError`は必要ありません。代わりに`error !== null`をチェックすることができます。

このクリーンアップの後、7つから3つの*本質的な*状態変数が残ります：

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

これらが本質的であることがわかります。なぜなら、どれかを削除すると機能が壊れるからです。

<DeepDive>

#### リデューサーで「不可能な」状態を排除する {/*eliminating-impossible-states-with-a-reducer*/}

これらの3つの変数は、このフォームの状態を十分に表現しています。しかし、まだ完全には意味をなさない中間状態がいくつかあります。例えば、`status`が`'success'`のときに非nullの`error`は意味をなしません。状態をより正確にモデル化するために、[リデューサーに抽出することができます。](/learn/extracting-state-logic-into-a-reducer) リデューサーを使用すると、複数の状態変数を単一のオブジェクトに統一し、関連するロジックを統合することができます！

</DeepDive>

### ステップ5: イベントハンドラを状態設定に接続する {/*step-5-connect-the-event-handlers-to-set-state*/}

最後に、状態を更新するイベントハンドラを作成します。以下は、すべてのイベントハンドラが接続された最終的なフォームです：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

このコードは元の命令的な例よりも長いですが、はるかに壊れにくいです。すべてのインタラクションを状態変更として表現することで、新しい視覚的状態を導入しても既存のものを壊すことなく、各状態で表示する内容を変更することができます。

<Recap>

* 宣言的プログラミングは、UIを細かく管理する（命令的）代わりに、各視覚的状態のUIを記述することを意味します。
* コンポーネントを開発する際には：
  1. すべての視覚的状態を特定する。
  2. 状態変化の人間とコンピュータのトリガーを決定する。
  3. `useState`で状態をモデル化する。
  4. バグや矛盾を避けるために不要な状態を削除する。
  5. イベントハンドラを状態設定に接続する。

</Recap>

<Challenges>

#### CSSクラスの追加と削除 {/*add-and-remove-a-css-class*/}

画像をクリックすると、外側の`<div>`から`background--active` CSSクラスが*削除*され、`<img>`に`picture--active`クラスが*追加*されるようにします。背景を再度クリックすると、元のCSSクラスが復元されるようにします。

視覚的には、画像をクリックすると紫の背景が削除され、画像の境界線が強調表示されることを期待します。画像の外側をクリックすると背景が強調表示されますが、画像の境界線の強調表示は削除されます。

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

このコンポーネントには2つの視覚的状態があります：画像がアクティブな場合と、画像が非アクティブな場合です：

* 画像がアクティブな場合、CSSクラスは`background`と`picture picture--active`です。
* 画像が非アクティブな場合、CSSクラスは`background background--active`と`picture`です。

単一のブール状態変数で画像がアクティブかどうかを記憶するのに十分です。元のタスクはCSSクラスを削除または追加することでした。しかし、ReactではUI要素を*操作*するのではなく、表示したいものを*記述*する必要があります。したがって、現在の状態に基づいて両方のCSSクラスを計算する必要があります。また、画像をクリックしても背景のクリックとして登録されないように[伝播を停止](/learn/responding-to-events#stopping-propagation)する必要があります。

このバージョンが機能することを確認するために、画像をクリックしてからその外側をクリックしてみてください：

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

または、2つの別々のJSXチャンクを返すこともできます：

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

同じツリーを記述する2つの異なるJSXチャンクがある場合、そのネスト（最初の`<div>`→最初の`<img>`）が一致する必要があることを覚えておいてください。そうしないと、`isActive`を切り替えると、下のツリー全体が再作成され、[状態がリセットされます。](/learn/preserving-and-resetting-state) そのため、似たようなJSXツリーが両方の場合に返される場合、それらを単一のJSXチャンクとして書く方が良いです。

</Solution>

#### プロフィールエディタ {/*profile-editor*/}

ここに、プレーンなJavaScriptとDOMで実装された小さなフォームがあります。その動作を理解するために試してみてください：

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

このフォームは2つのモードを切り替えます：編集モードでは入力が表示され、表示モードでは結果のみが表示されます。ボタンのラベルは、現在のモードに応じて「編集」と「保存」の間で変わります。入力を変更すると、下部のウェルカムメッセージがリアルタイムで更新されます。

次のサンドボックスでReactで再実装するのが課題です。マークアップはすでにJSXに変換されていますが、元のように入力を表示および非表示にする必要があります。

また、下部のテキストも更新されるようにしてください！

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

入力値を保持するために2つの状態変数が必要です：`firstName`と`lastName`。また、入力を表示するかどうかを保持する`isEditing`状態変数も必要です。`fullName`変数は必要ありません。なぜなら、フルネームは常に`firstName`と`lastName`から計算できるからです。

最後に、`isEditing`に応じて入力を表示または非表示にするために[条件付きレンダリング](/learn/conditional-rendering)を使用する必要があります。

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

このソリューションを元の命令的なコードと比較してみてください。どのように異なっていますか？

</Solution>

#### Reactを使わずに命令的なソリューションをリファクタリングする {/*refactor-the-imperative-solution-without-react*/}

以下は前のチャレンジからの元のサンドボックスで、Reactを使わずに命令的に書かれています：

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Reactが存在しなかったと想像してみてください。このコードをリファクタリングして、ロジックをより壊れにくくし、Reactバージョンに似たものにすることができますか？状態が明示的である場合、どのように見えるでしょうか？

どこから始めればよいか悩んでいる場合は、以下のスタブにはすでにほとんどの構造が含まれています。ここから始める場合、`updateDOM`関数の不足しているロジックを埋めてください。（必要に応じて元のコードを参照してください。）

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

不足しているロジックには、入力とコンテンツの表示の切り替え、およびラベルの更新が含まれていました：

<Sandpack>

```js src/index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

あなたが書いた`updateDOM`関数は、状態を設定したときにReactが内部で行うことを示しています。（ただし、Reactは前回設定されたプロパティが変更されていない場合、そのDOMを触らないようにします。）

</Solution>

</Challenges>