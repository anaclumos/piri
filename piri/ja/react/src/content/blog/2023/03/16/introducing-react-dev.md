---
title: react.dev の紹介
author: Dan Abramov and Rachel Nabors
date: 2023/03/16
description: 本日、Reactとそのドキュメントの新しいホームであるreact.devを立ち上げることに大変興奮しています。この投稿では、新しいサイトのツアーをご紹介したいと思います。
---

2023年3月16日 [Dan Abramov](https://twitter.com/dan_abramov) と [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Intro>

本日、Reactとそのドキュメントの新しいホームである [react.dev](https://react.dev) を発表できることを非常に嬉しく思います。この投稿では、新しいサイトのツアーをご紹介します。

</Intro>

---

## tl;dr {/*tldr*/}

* 新しいReactサイト ([react.dev](https://react.dev)) は、関数コンポーネントとHooksを使ったモダンなReactを教えます。
* 図解、イラスト、チャレンジ、そして600以上の新しいインタラクティブな例を含めました。
* 以前のReactドキュメントサイトは [legacy.reactjs.org](https://legacy.reactjs.org) に移動しました。

## 新しいサイト、新しいドメイン、新しいホームページ {/*new-site-new-domain-new-homepage*/}

まずは、少し整理整頓をしましょう。

新しいドキュメントの公開を祝うため、そしてより重要なこととして、古いコンテンツと新しいコンテンツを明確に分けるために、短い [react.dev](https://react.dev) ドメインに移行しました。古い [reactjs.org](https://reactjs.org) ドメインはここにリダイレクトされます。

古いReactドキュメントは [legacy.reactjs.org](https://legacy.reactjs.org) にアーカイブされました。既存の古いコンテンツへのリンクはすべて自動的にそこにリダイレクトされ、「ウェブを壊す」ことを避けるためですが、レガシーサイトは多くの更新を受けることはありません。

信じられないかもしれませんが、Reactはもうすぐ10歳になります。JavaScriptの年齢では、まるで一世紀のようです！私たちは [Reactのホームページを刷新しました](https://react.dev) ので、なぜReactが今日のユーザーインターフェースを作成するための素晴らしい方法であると考えているのかを反映し、モダンなReactベースのフレームワークをより目立つように紹介するためのガイドを更新しました。

まだ新しいホームページを見ていない場合は、ぜひチェックしてください！

## Hooksを使ったモダンなReactに全力投球 {/*going-all-in-on-modern-react-with-hooks*/}

2018年にReact Hooksをリリースしたとき、Hooksのドキュメントはクラスコンポーネントに精通している読者を前提としていました。これにより、コミュニティはHooksを非常に迅速に採用することができましたが、しばらくすると古いドキュメントは新しい読者に対応できなくなりました。新しい読者は、クラスコンポーネントとHooksの両方を学ぶ必要がありました。

**新しいドキュメントは最初からHooksを使ってReactを教えます。** ドキュメントは主に2つのセクションに分かれています：

* **[Learn React](/learn)** は、Reactをゼロから教える自己ペースのコースです。
* **[API Reference](/reference)** は、すべてのReact APIの詳細と使用例を提供します。

各セクションで見つけることができるものを詳しく見てみましょう。

<Note>

まだHookベースの同等のものがないいくつかの稀なクラスコンポーネントの使用例があります。クラスコンポーネントは引き続きサポートされており、新しいサイトの [Legacy API](/reference/react/legacy) セクションにドキュメント化されています。

</Note>

## クイックスタート {/*quick-start*/}

Learnセクションは [Quick Start](/learn) ページから始まります。これはReactの短い紹介ツアーです。コンポーネント、props、stateなどの概念の構文を紹介しますが、それらの使用方法については詳しく説明しません。

実際に手を動かして学ぶのが好きな方は、次に [Tic-Tac-Toe Tutorial](/learn/tutorial-tic-tac-toe) をチェックすることをお勧めします。これはReactを使って小さなゲームを作成する方法を教え、日常的に使用するスキルを教えます。以下はあなたが作成するものです：

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

また、[Thinking in React](/learn/thinking-in-react) を強調したいと思います。これは多くの人にとってReactが「クリック」したチュートリアルです。**これらのクラシックなチュートリアルの両方を関数コンポーネントとHooksを使用するように更新しました**ので、新品同様です。

<Note>

上記の例は *sandbox* です。サイト全体に600以上のサンドボックスを追加しました。どのサンドボックスも編集でき、右上の「Fork」を押すと別のタブで開くことができます。サンドボックスを使ってReact APIをすばやく試したり、アイデアを探求したり、理解を確認したりできます。

</Note>

## ステップバイステップでReactを学ぶ {/*learn-react-step-by-step*/}

世界中の誰もが無料で自分のペースでReactを学ぶ機会を平等に持てるようにしたいと考えています。

そのため、Learnセクションは章ごとに分かれた自己ペースのコースのように構成されています。最初の2章はReactの基本を説明します。Reactに初めて触れる方や、記憶をリフレッシュしたい方はここから始めてください：

- **[UIの記述](/learn/describing-the-ui)** は、コンポーネントを使って情報を表示する方法を教えます。
- **[インタラクティビティの追加](/learn/adding-interactivity)** は、ユーザー入力に応じて画面を更新する方法を教えます。

次の2章はより高度で、より難しい部分についての深い洞察を提供します：

- **[状態の管理](/learn/managing-state)** は、アプリが複雑になるにつれてロジックを整理する方法を教えます。
- **[エスケープハッチ](/learn/escape-hatches)** は、Reactの外に「ステップアウト」する方法と、その最適なタイミングを教えます。

各章は関連するいくつかのページで構成されています。これらのページのほとんどは特定のスキルや技術を教えます—例えば、[JSXでマークアップを書く](/learn/writing-markup-with-jsx)、[状態のオブジェクトを更新する](/learn/updating-objects-in-state)、または[コンポーネント間で状態を共有する](/learn/sharing-state-between-components) などです。一部のページはアイデアの説明に焦点を当てています—例えば、[レンダーとコミット](/learn/render-and-commit) や [スナップショットとしての状態](/learn/state-as-a-snapshot) などです。そして、[エフェクトが必要ないかもしれない](/learn/you-might-not-need-an-effect) など、これまでの経験に基づいた提案を共有するページもあります。

これらの章を順番に読む必要はありません。誰がそんな時間を持っているでしょうか？！でも、読むこともできます。Learnセクションのページは、前のページで紹介された概念にのみ依存しています。本のように読みたい場合は、どうぞ！

### チャレンジで理解を確認する {/*check-your-understanding-with-challenges*/}

Learnセクションのほとんどのページは、理解を確認するためのいくつかのチャレンジで終わります。例えば、[条件付きレンダリング](/learn/conditional-rendering#challenges) のページからのいくつかのチャレンジを以下に示します。

今すぐ解決する必要はありません！本当にやりたい場合を除いて。

<Challenges noTitle={true}>

#### `? :` を使って未完了のアイテムにアイコンを表示する {/*show-an-icon-for-incomplete-items-with--*/}

条件演算子 (`cond ? a : b`) を使用して、`isPacked` が `true` でない場合に ❌ をレンダリングします。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&` を使ってアイテムの重要度を表示する {/*show-the-item-importance-with-*/}

この例では、各 `Item` が数値の `importance` prop を受け取ります。`&&` 演算子を使用して、重要度がゼロでないアイテムにのみイタリック体で "_(Importance: X)_" をレンダリングします。アイテムリストは次のようになります：

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

2つのラベルの間にスペースを追加するのを忘れないでください！

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

これでうまくいくはずです：

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

注意：`importance > 0 && ...` と書く必要があります。`importance && ...` と書くと、`importance` が `0` の場合に `0` が結果としてレンダリングされてしまいます！

この解決策では、名前と重要度ラベルの間にスペースを挿入するために2つの別々の条件が使用されています。代わりに、先頭にスペースを持つフラグメントを使用することもできます：`importance > 0 && <> <i>...</i></>` または `<i>` のすぐ内側にスペースを追加することもできます：`importance > 0 && <i> ...</i>`。

</Solution>

</Challenges>

左下隅の「Show solution」ボタンに注目してください。自分を確認したい場合に便利です！

### 図解やイラストで直感を養う {/*build-an-intuition-with-diagrams-and-illustrations*/}

コードや言葉だけでは説明が難しい場合、直感を提供するための図解を追加しました。例えば、[状態の保持とリセット](/learn/preserving-and-resetting-state) の一つの図解はこちらです：

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="3つのセクションがあり、それぞれの間に矢印で遷移しています。最初のセクションには、'div'とラベル付けされたReactコンポーネントがあり、1つの子要素として'Counter'が含まれています。'Counter'には'count'とラベル付けされた状態バブルがあり、値は3です。中央のセクションでは、同じ'div'親があり、子コンポーネントは削除され、黄色の'proof'画像で示されています。3番目のセクションでは、再び同じ'div'親があり、新しい子要素として'Counter'が含まれ、状態バブル'count'の値は0です。すべてが黄色で強調されています。">

`section` が `div` に変わると、`section` は削除され、新しい `div` が追加されます

</Diagram>

また、ドキュメント全体にいくつかのイラストもあります—こちらは [ブラウザが画面を描画する](/learn/render-and-commit#epilogue-browser-paint) イラストの一つです：

<Illustration alt="ブラウザが「カード要素の静物画」を描いている。" src="/images/docs/illustrations/i_browser-paint.png" />

ブラウザベンダーに確認したところ、この描写は100%科学的に正確です。

## 新しく詳細なAPIリファレンス {/*a-new-detailed-api-reference*/}

[APIリファレンス](/reference/react) では、すべてのReact APIに専用のページがあります。これには、さまざまなAPIが含まれます：

- [`useState`](/reference/react/useState) のような組み込みのHooks。
- [`<Suspense>`](/reference/react/Suspense) のような組み込みのコンポーネント。
- [`<input>`](/reference/react-dom/components/input) のような組み込みのブラウザコンポーネント。
- [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream) のようなフレームワーク指向のAPI。
- [`memo`](/reference/react/memo) のようなその他のReact API。

すべてのAPIページは少なくとも2つのセグメントに分かれています：*Reference* と *Usage*。

[Reference](/reference/react/useState#reference) は、引数と戻り値をリストアップして正式なAPIシグネチャを説明します。簡潔ですが、そのAPIに慣れていない場合は少し抽象的に感じるかもしれません。APIが何をするかを説明しますが、どのように使用するかは説明しません。

[Usage](/reference/react/useState#usage) は、このAPIを実際にどのように使用するかを示します。Reactチームが意図した**各APIの標準的なシナリオ**を示します。色分けされたスニペット、異なるAPIを一緒に使用する例、コピーして貼り付けることができるレシピを追加しました：

<Recipes titleText="基本的なuseStateの例" titleId="examples-basic">

#### カウンター（数値） {/*counter-number*/}

この例では、`count` 状態変数が数値を保持します。ボタンをクリックすると、それがインクリメントされます。

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
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### テキストフィールド（文字列） {/*text-field-string*/}

この例では、`text` 状態変数が文字列を保持します。入力すると、`handleChange` がブラウザの入力DOM要素から最新の入力値を読み取り、`setText` を呼び出して状態を更新します。これにより、現在の `text` を下に表示できます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### チェックボックス（ブール値） {/*checkbox-boolean*/}

この例では、`liked` 状態変数がブール値を保持します。入力をクリックすると、`setLiked` がブラウザのチェックボックス入力がチェックされているかどうかで `liked` 状態変数を更新します。`liked` 変数はチェックボックスの下にテキストをレンダリングするために使用されます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### フォーム（2つの変数） {/*form-two-variables*/}

同じコンポーネントで複数の状態変数を宣言できます。各状態変数は完全に独立しています。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

一部のAPIページには、[トラブルシューティング](/reference/react/useEffect#troubleshooting)（一般的な問題）や [代替案](/reference/react-dom/findDOMNode#alternatives)（廃止されたAPI）も含まれています。

このアプローチが、APIリファレンスを引数を調べるためだけでなく、特定のAPIでできるすべてのことを見て、それが他のAPIとどのように接続されているかを理解するための方法として役立つことを願っています。

## 次は何ですか？ {/*whats-next*/}

これで私たちの小さなツアーは終了です！新しいウェブサイトを見て、気に入った点や気に入らない点を確認し、[issue tracker](https://github.com/reactjs/react.dev/issues) でフィードバックをお寄せください。

このプロジェクトが出荷されるまでに長い時間がかかったことを認めます。Reactコミュニティが求める高い品質基準を維持したいと考えていました。これらのドキュメントを書き、すべての例を作成する中で、私たち自身の説明の中で間違いを見つけ、Reactのバグを発見し、Reactの設計におけるギャップを見つけました。これらを今後解決していく予定です。新しいドキュメントが、将来的にReact自体をより高い基準に保つのに役立つことを願っています。

ウェブサイトのコンテンツと機能を拡充するための多くのリクエストを聞いています。例えば：

- すべての例のTypeScriptバージョンを提供すること；
- 更新されたパフォーマンス、テスト、およびアクセシビリティガイドを作成すること；
- フレームワークから独立してReact Server Componentsを文書化すること；
- 新しいドキュメントを翻訳するために国際的なコミュニティと協力すること；
- 新しいウェブサイトに欠けている機能を追加すること（例えば、このブログのRSS）。

[react.dev](https://react.dev/) が公開された今、サードパーティのReact教育リソースに「追いつく」ことから、新しい情報を追加し、新しいウェブサイトをさらに改善することに焦点を移すことができます。

Reactを学ぶのにこれ以上の時期はないと思います。

## 誰がこれに取り組んだのですか？ {/*who-worked-on-this*/}

Reactチームでは、[Rachel Nabors](https://twitter.com/rachelnabors/) がプロジェクトをリードし（イラストも提供しました）、[Dan Abramov](https://twitter.com/dan_abramov) がカリキュラムを設計しました。彼らはほとんどのコンテンツを共同執筆しました。

もちろん、これほど大きなプロジェクトは孤立して行われるものではありません。感謝すべき多くの人々がいます！

[Sylwia Vargas](https://twitter.com/SylwiaVargas) は、例を「foo/bar/baz」や子猫を超えて、世界中の科学者、アーティスト、都市を特徴とするものにオーバーホールしました。[Maggie Appleton](https://twitter.com/Mappletons) は、私たちの落書きを明確な図解システムに変えました。

追加の執筆貢献をしてくれた [David McCabe](https://twitter.com/mcc_abe)、[Sophie Alpert](https://twitter.com/sophiebits)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Andrew Clark](https://twitter.com/acdlite)、および [Matt Carroll](https://twitter.com/mattcarrollcode) に感謝します。また、アイデアやフィードバックを提供してくれた [Natalia Tepluhina](https://twitter.com/n_tepluhina) と [Sebastian Markbåge](https://twitter.com/sebmarkbage) にも感謝します。

サイトデザインを担当した [Dan Lebowitz](https://twitter.com/lebo) と、サンドボックスデザインを担当した [Razvan Gradinar](https://dribbble.com/GradinarRazvan) に感謝します。

開発面では、プロトタイプ開発を担当した [Jared Palmer](https://twitter.com/jaredpalmer) に感謝します。UI開発をサポートしてくれた [Dane Grant](https://twitter.com/danecando) と [Dustin Goodman](https://twitter.com/dustinsgoodman) から [ThisDotLabs](https://www.thisdot.co/) に感謝します。サンドボックス統合に取り組んでくれた [Ives van Hoorne](https://twitter.com/CompuIves)、[Alex Moldovan](https://twitter.com/alexnmoldovan)、[Jasper De Moor](https://twitter.com/JasperDeMoor)、および [Danilo Woznica](https://twitter.com/danilowoz) から [CodeSandbox](https://codesandbox.io/) に感謝します。色や細部を微調整してくれた [Rick Hanlon](https://twitter.com/rickhanlonii) に感謝します。サイトに新機能を追加し、維持するのを手伝ってくれた [Harish Kumar](https://www.strek.in/) と [Luna Ruan](https://twitter.com/lunaruan) に感謝します。

アルファおよびベータテストプログラムに参加してくれた方々に大きな感謝を捧げます。あなたの熱意と貴重なフィードバックがこれらのドキュメントを形作るのに役立ちました。特に、React Conf 2021でReactドキュメントの使用経験について講演してくれたベータテスターの [Debbie O'Brien](https://twitter.com/debs_obrien) に感謝します。

最後に、この努力の背後にあるインスピレーションであるReactコミュニティに感謝します。あなたがいるからこそ、私たちはこれを行っています。新しいドキュメントが、あなたが望むどんなユーザーインターフェースでもReactを使って構築するのに役立つことを願っています。