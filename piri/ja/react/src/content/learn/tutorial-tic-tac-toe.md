---
title: チュートリアル: 三目並べ
---

<Intro>

このチュートリアルでは、小さな三目並べゲームを作成します。このチュートリアルは、Reactの既存の知識を前提としていません。チュートリアルで学ぶ技術は、どのReactアプリを構築する際にも基本的なものであり、完全に理解することでReactの深い理解が得られます。

</Intro>

<Note>

このチュートリアルは、**実践しながら学ぶ**ことを好み、すぐに何か具体的なものを作ってみたい人向けに設計されています。各概念を一歩ずつ学ぶことを好む場合は、[UIの説明](/learn/describing-the-ui)から始めてください。

</Note>

チュートリアルは以下のセクションに分かれています：

- [チュートリアルのセットアップ](#setup-for-the-tutorial)では、チュートリアルを進めるための**出発点**を提供します。
- [概要](#overview)では、Reactの**基本**であるコンポーネント、プロップス、ステートについて学びます。
- [ゲームの完成](#completing-the-game)では、React開発における**最も一般的な技術**を学びます。
- [タイムトラベルの追加](#adding-time-travel)では、Reactのユニークな強みについて**より深い洞察**を得ることができます。

### 何を作成するのか？ {/*what-are-you-building*/}

このチュートリアルでは、Reactを使ってインタラクティブな三目並べゲームを作成します。

完成したときの見た目は以下の通りです：

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

コードがまだ理解できない場合や、コードの構文に慣れていない場合でも心配しないでください！このチュートリアルの目標は、Reactとその構文を理解することです。

チュートリアルを続ける前に、上記の三目並べゲームを確認することをお勧めします。ゲームボードの右側に番号付きのリストがあることに気づくでしょう。このリストは、ゲーム中に発生したすべての手の履歴を提供し、ゲームが進行するにつれて更新されます。

完成した三目並べゲームで遊んだら、スクロールを続けてください。このチュートリアルでは、よりシンプルなテンプレートから始めます。次のステップは、ゲームの構築を開始できるようにセットアップすることです。

## チュートリアルのセットアップ {/*setup-for-the-tutorial*/}

以下のライブコードエディタで、右上の**Fork**をクリックして、CodeSandboxというウェブサイトでエディタを新しいタブで開きます。CodeSandboxは、ブラウザでコードを書き、作成したアプリがユーザーにどのように表示されるかをプレビューすることができます。新しいタブには、空の四角形とこのチュートリアルのスターターコードが表示されるはずです。

<Sandpack>

```js src/App.js
export default function Square() {
  return <button className="square">X</button>;
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

<Note>

このチュートリアルは、ローカルの開発環境を使用して進めることもできます。その場合、以下の手順が必要です：

1. [Node.js](https://nodejs.org/en/)をインストールする
1. 先ほど開いたCodeSandboxタブで、左上のボタンを押してメニューを開き、そのメニューで**Download Sandbox**を選択して、ファイルのアーカイブをローカルにダウンロードする
1. アーカイブを解凍し、ターミナルを開いて解凍したディレクトリに`cd`する
1. `npm install`で依存関係をインストールする
1. `npm start`を実行してローカルサーバーを起動し、ブラウザでコードが動作しているのを確認する

もし途中でつまずいたら、これにこだわらず、オンラインで進めて後で再度ローカルセットアップを試してみてください。

</Note>

## 概要 {/*overview*/}

セットアップが完了したので、Reactの概要を見てみましょう！

### スターターコードの確認 {/*inspecting-the-starter-code*/}

CodeSandboxでは、主に3つのセクションが表示されます：

![CodeSandbox with starter code](../images/tutorial/react-starter-code-codesandbox.png)

1. `App.js`、`index.js`、`styles.css`などのファイルリストと`public`というフォルダが表示される_Files_セクション
1. 選択したファイルのソースコードが表示される_コードエディタ_
1. 書いたコードがどのように表示されるかを確認できる_ブラウザ_セクション

_Files_セクションで`App.js`ファイルが選択されているはずです。そのファイルの内容が_コードエディタ_に表示されます：

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_ブラウザ_セクションには、次のようにXが表示された四角形が表示されるはずです：

![x-filled square](../images/tutorial/x-filled-square.png)

次に、スターターコードのファイルを見てみましょう。

#### `App.js` {/*appjs*/}

`App.js`のコードは_コンポーネント_を作成します。Reactでは、コンポーネントはユーザーインターフェイスの一部を表す再利用可能なコードの一部です。コンポーネントは、アプリケーションのUI要素をレンダリング、管理、および更新するために使用されます。コンポーネントが何をしているのかを行ごとに見てみましょう：

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

最初の行は`Square`という関数を定義します。`export`というJavaScriptのキーワードは、この関数をこのファイルの外部からアクセス可能にします。`default`キーワードは、他のファイルがこのコードを使用する際に、これがファイルのメイン関数であることを示します。

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

2行目はボタンを返します。`return`というJavaScriptのキーワードは、その後に続くものが関数の呼び出し元に値として返されることを意味します。`<button>`は*JSX要素*です。JSX要素は、表示したい内容を記述するJavaScriptコードとHTMLタグの組み合わせです。`className="square"`は、ボタンのプロパティまたは*プロップ*で、CSSにボタンのスタイルを指示します。`X`はボタン内に表示されるテキストであり、`</button>`はJSX要素を閉じて、後続のコンテンツがボタン内に配置されないことを示します。

#### `styles.css` {/*stylescss*/}

CodeSandboxの_Files_セクションで`styles.css`というラベルのファイルをクリックします。このファイルは、Reactアプリのスタイルを定義します。最初の2つの_CSSセレクタ_（`*`と`body`）は、アプリの大部分のスタイルを定義し、`.square`セレクタは、`className`プロパティが`square`に設定されているコンポーネントのスタイルを定義します。コード内では、これは`App.js`ファイルの`Square`コンポーネントのボタンに一致します。

#### `index.js` {/*indexjs*/}

CodeSandboxの_Files_セクションで`index.js`というラベルのファイルをクリックします。このファイルはチュートリアル中に編集しませんが、`App.js`ファイルで作成したコンポーネントとウェブブラウザの間の橋渡しをします。

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

1-5行目は必要なすべての部分をまとめます：

* React
* ウェブブラウザと対話するためのReactのライブラリ（React DOM）
* コンポーネントのスタイル
* `App.js`で作成したコンポーネント

ファイルの残りの部分は、すべての部分をまとめて、`public`フォルダの`index.html`に最終的な製品を注入します。

### ボードの作成 {/*building-the-board*/}

`App.js`に戻りましょう。ここでチュートリアルの残りの部分を過ごします。

現在、ボードは1つの四角形だけですが、9つ必要です。四角形をコピーして2つの四角形を作成しようとすると、次のようになります：

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

このエラーが発生します：

<ConsoleBlock level="error">

/src/App.js: 隣接するJSX要素は囲むタグでラップする必要があります。JSXフラグメント`<>...</>`を使用しますか？

</ConsoleBlock>

Reactコンポーネントは、複数の隣接するJSX要素ではなく、単一のJSX要素を返す必要があります。これを修正するには、*フラグメント*（`<>`と`</>`）を使用して、複数の隣接するJSX要素をラップします：

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

これで次のように表示されるはずです：

![two x-filled squares](../images/tutorial/two-x-filled-squares.png)

素晴らしい！次に、コピー＆ペーストを数回行って9つの四角形を追加し...

![nine x-filled squares in a line](../images/tutorial/nine-x-filled-squares.png)

ああ！四角形がすべて1行に並んでいて、ボードのようなグリッドにはなっていません。これを修正するには、四角形を`div`で行にグループ化し、いくつかのCSSクラスを追加する必要があります。ついでに、各四角形に番号を付けて、各四角形がどこに表示されているかを確認できるようにします。

`App.js`ファイルで、`Square`コンポーネントを次のように更新します：

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css`で定義されたCSSは、`className`が`board-row`の`div`をスタイルします。これで、コンポーネントを行にグループ化し
たスタイル付きの`div`を使用して、三目並べのボードが完成しました：

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

しかし、今度は問題があります。`Square`という名前のコンポーネントが、実際にはもう四角形ではありません。これを修正するために、名前を`Board`に変更しましょう：

```js {1}
export default function Board() {
  //...
}
```

この時点で、コードは次のようになっているはずです：

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
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

<Note>

ふぅ... たくさんのコードを入力しましたね！このページからコードをコピー＆ペーストしても構いませんが、少し挑戦したい場合は、少なくとも一度手動で入力したコードだけをコピーすることをお勧めします。

</Note>

### プロップスを通じてデータを渡す {/*passing-data-through-props*/}

次に、ユーザーが四角形をクリックしたときに四角形の値を空から「X」に変更したいと思います。これまでのボードの作り方では、四角形ごとにコードを9回コピー＆ペーストする必要があります（各四角形ごとに1回ずつ）。コピー＆ペーストの代わりに、Reactのコンポーネントアーキテクチャを使用して、重複したコードを避けるために再利用可能なコンポーネントを作成できます。

まず、最初の四角形を定義する行（`<button className="square">1</button>`）を`Board`コンポーネントから新しい`Square`コンポーネントにコピーします：

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

次に、`Board`コンポーネントを更新して、JSX構文を使用してその`Square`コンポーネントをレンダリングします：

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

ブラウザの`div`とは異なり、独自のコンポーネント`Board`と`Square`は大文字で始める必要があることに注意してください。

見てみましょう：

![one-filled board](../images/tutorial/board-filled-with-ones.png)

ああ！以前の番号付きの四角形が失われました。今では各四角形に「1」と表示されています。これを修正するために、親コンポーネント（`Board`）から子コンポーネント（`Square`）に各四角形の値を渡すために*プロップス*を使用します。

`Square`コンポーネントを更新して、`Board`から渡される`value`プロップを読み取ります：

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })`は、Squareコンポーネントが`value`というプロップを受け取ることができることを示しています。

次に、`value`を`1`の代わりに四角形内に表示します。次のようにしてみてください：

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

おっと、これは望んでいたものではありません：

![value-filled board](../images/tutorial/board-filled-with-value.png)

JavaScript変数`value`をコンポーネントからレンダリングしたかったのであり、「value」という単語ではありません。JSXからJavaScriptに「エスケープ」するには、中括弧が必要です。次のようにJSX内の`value`の周りに中括弧を追加します：

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

現在、空のボードが表示されるはずです：

![empty board](../images/tutorial/empty-board.png)

これは、`Board`コンポーネントがまだ各`Square`コンポーネントに`value`プロップを渡していないためです。これを修正するために、`Board`コンポーネントがレンダリングする各`Square`コンポーネントに`value`プロップを追加します：

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

これで再び番号付きのグリッドが表示されるはずです：

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

更新されたコードは次のようになります：

<Sandpack>

```js src/App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
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

### インタラクティブなコンポーネントの作成 {/*making-an-interactive-component*/}

四角形をクリックしたときに`Square`コンポーネントに`X`を表示しましょう。`Square`内に`handleClick`という関数を宣言します。次に、`Square`から返されるボタンJSX要素のプロップに`onClick`を追加します：

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

今、四角形をクリックすると、CodeSandboxの_ブラウザ_セクションの下部にある_コンソール_タブに`"clicked!"`というログが表示されるはずです。四角形を複数回クリックすると、`"clicked!"`が再びログに表示されます。同じメッセージの繰り返しのコンソールログは、コンソールに新しい行を作成しません。代わりに、最初の`"clicked!"`ログの横に増加するカウンターが表示されます。

<Note>

ローカル開発環境を使用してこのチュートリアルを進めている場合は、ブラウザのコンソールを開く必要があります。例えば、Chromeブラウザを使用している場合、**Shift + Ctrl + J**（Windows/Linux）または**Option + ⌘ + J**（macOS）というキーボードショートカットでコンソールを表示できます。

</Note>

次のステップとして、クリックされた`Square`コンポーネントが「記憶」して`X`マークで埋めるようにします。コンポーネントが何かを「記憶」するためには、*ステート*を使用します。

Reactは、コンポーネントから呼び出すことができる特別な関数`useState`を提供しており、それを使用してコンポーネントが何かを「記憶」することができます。`Square`の現在の値をステートに保存し、クリックされたときに変更します。

ファイルの先頭で`useState`をインポートします。`Square`コンポーネントから`value`プロップを削除します。代わりに、`Square`の最初の行に`useState`を呼び出す行を追加し、ステート変数`value`を返します：

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value`は値を保存し、`setValue`は値を変更するための関数です。`useState`に渡される`null`は、このステート変数の初期値として使用されるため、ここでは`value`は最初に`null`に設定されます。

`Square`コンポーネントはもはやプロップを受け取らないため、`Board`コンポーネントが作成する9つの`Square`コンポーネントから`value`プロップを削除します：

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

次に、`Square`をクリックされたときに`X`を表示するように変更します。`console.log("clicked!");`イベントハンドラを`setValue('X');`に置き換えます。これで`Square`コンポーネントは次のようになります：

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

この`set`関数を`onClick`ハンドラから呼び出すことで、`Square`の`<button>`がクリックされるたびにReactにその`Square`を再レンダリングするように指示しています。更新後、`Square`の`value`は`'X'`になるため、ゲームボードに`X`が表示されます。任意の`Square`をクリックすると、`X`が表示されるはずです：

![adding xes to board](../images/tutorial/tictac-adding-x-s.gif)

各`Square`は独自のステートを持っています：各`Square`に保存されている`value`は他の`Square`とは完全に独立しています。コンポーネント内で`set`関数を呼び出すと、Reactは自動的に内部の子コンポーネントも更新します。

上記の変更を行った後、コードは次のようになります：

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
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

### React Developer Tools {/*react-developer-tools*/}

React DevToolsを使用すると、Reactコンポーネントのプロップスとステートを確認できます。CodeSandboxの_ブラウザ_セクションの下部にあるReact DevToolsタブを見つけることができます：

![React DevTools in CodeSandbox](../images/tutorial/codesandbox-devtools.png)

画面上の特定のコンポーネントを検査するには、React DevToolsの左上のボタンを使用します：

![Selecting components on the page with React DevTools](../images/tutorial/devtools-select.gif)

<Note>

ローカル開発環境では、React DevToolsは[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)、[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)、および[Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)のブラウザ拡張機能として利用できます。インストールすると、Reactを使用しているサイトのブラウザ開発者ツールに*Components*タブが表示されます。

</Note>

## ゲームの完成 {/*completing-the-game*/}

この時点で、三目並べゲームの基本的な構成要素はすべて揃っています。完全なゲームにするためには、ボード上に「X」と「O」を交互に配置し、勝者を決定する方法が必要です。

### ステートのリフトアップ {/*lifting-state-up*/}

現在、各`Square`コンポーネントはゲームのステートの一部を保持しています。三目並べゲームで勝者を確認するには、`Board`が9つの`Square`コンポーネントのステートを知る必要があります。

どうやってそれを実現しますか？最初は、`Board`が各`Square`にその`Square`のステートを「尋ねる」必要があると考えるかもしれません。このアプローチは
技術的にはReactで可能ですが、コードが理解しにくくなり、バグが発生しやすく、リファクタリングが難しくなるため、推奨されません。代わりに、ゲームのステートを各`Square`ではなく親の`Board`コンポーネントに保存するのが最良のアプローチです。`Board`コンポーネントは、各`Square`に表示する内容をプロップスを通じて指示できます。

**複数の子コンポーネントからデータを収集したり、2つの子コンポーネント間で通信する必要がある場合は、共有ステートを親コンポーネントに宣言します。親コンポーネントはそのステートをプロップスを通じて子コンポーネントに渡すことができます。これにより、子コンポーネントが親コンポーネントおよび他の子コンポーネントと同期を保つことができます。**

ステートを親コンポーネントにリフトアップすることは、Reactコンポーネントのリファクタリング時によく行われます。

この機会に試してみましょう。`Board`コンポーネントを編集して、9つの`null`の配列にデフォルト設定された`squares`というステート変数を宣言します：

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)`は9つの要素を持つ配列を作成し、それぞれに`null`を設定します。`useState()`呼び出しは、その配列に初期設定された`squares`ステート変数を宣言します。配列の各エントリは四角形の値に対応します。後でボードを埋めると、`squares`配列は次のようになります：

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

次に、`Board`コンポーネントがレンダリングする各`Square`に`value`プロップを渡す必要があります：

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

次に、`Square`コンポーネントを編集して、`Board`コンポーネントから`value`プロップを受け取るようにします。これには、`Square`コンポーネントの独自のステートフルな`value`の追跡とボタンの`onClick`プロップを削除する必要があります：

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

この時点で、空の三目並べボードが表示されるはずです：

![empty board](../images/tutorial/empty-board.png)

コードは次のようになっているはずです：

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
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

各`Square`は、`'X'`、`'O'`、または空の四角形のための`null`のいずれかの`value`プロップを受け取ります。

次に、`Square`がクリックされたときに何が起こるかを変更する必要があります。`Board`コンポーネントは現在、どの四角形が埋められているかを管理しています。`Square`が`Board`のステートを更新する方法を作成する必要があります。ステートはそれを定義したコンポーネントにプライベートであるため、`Square`から直接`Board`のステートを更新することはできません。

代わりに、`Board`コンポーネントから`Square`コンポーネントに関数を渡し、四角形がクリックされたときに`Square`がその関数を呼び出すようにします。まず、`Square`コンポーネントがクリックされたときに呼び出す関数を作成します。この関数を`onSquareClick`と呼びます：

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

次に、`Square`コンポーネントのプロップに`onSquareClick`関数を追加します：

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

次に、`onSquareClick`プロップを`Board`コンポーネント内の`handleClick`関数に接続します。最初の`Square`コンポーネントの`onSquareClick`プロップに関数を渡して接続します：

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

最後に、`Board`コンポーネント内で`handleClick`関数を定義し、ボードのステートを更新します：

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

`handleClick`関数は、JavaScriptの`slice()`メソッドを使用して`squares`配列のコピー（`nextSquares`）を作成します。次に、`handleClick`は`nextSquares`配列を更新して、最初の（`[0]`インデックス）四角形に`X`を追加します。

`setSquares`関数を呼び出すことで、Reactにコンポーネントのステートが変更されたことを知らせます。これにより、`squares`ステートを使用するコンポーネント（`Board`）およびその子コンポーネント（ボードを構成する`Square`コンポーネント）が再レンダリングされます。

<Note>

JavaScriptは[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)をサポートしているため、内部関数（例：`handleClick`）は外部関数（例：`Board`）内で定義された変数や関数にアクセスできます。`handleClick`関数は、`Board`関数内で定義されているため、`squares`ステートを読み取り、`setSquares`メソッドを呼び出すことができます。

</Note>

これでボードにXを追加できますが、左上の四角形にのみ追加できます。`handleClick`関数は左上の四角形（`0`）のインデックスを更新するようにハードコーディングされています。`handleClick`が任意の四角形を更新できるように更新します。`handleClick`関数に四角形のインデックスを受け取る引数`i`を追加します：

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

次に、その`i`を`handleClick`に渡す必要があります。JSX内で直接`handleClick(0)`を設定しようとすると、うまくいきません：

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

これがうまくいかない理由は、`handleClick(0)`呼び出しがボードコンポーネントのレンダリングの一部になるためです。`handleClick(0)`は`setSquares`を呼び出してボードコンポーネントのステートを変更するため、ボードコンポーネント全体が再レンダリングされます。しかし、これにより`handleClick(0)`が再び実行され、無限ループが発生します：

<ConsoleBlock level="error">

レンダリングが多すぎます。Reactは無限ループを防ぐためにレンダリングの数を制限します。

</ConsoleBlock>

なぜこの問題は以前発生しなかったのでしょうか？

`onSquareClick={handleClick}`を渡していたときは、`handleClick`関数をプロップとして渡していただけで、呼び出していませんでした！しかし、今はその関数をすぐに呼び出しています--`handleClick(0)`の括弧に注目してください--これが早すぎる実行の原因です。ユーザーがクリックするまで`handleClick`を呼び出したくありません！

これを修正するために、`handleClick(0)`を呼び出す`handleFirstSquareClick`のような関数を作成し、`handleClick(1)`を呼び出す`handleSecondSquareClick`のような関数を作成し、それらの関数をプロップとして渡すことができます。これにより無限ループが解決されます。

ただし、9つの異なる関数を定義し、それぞれに名前を付けるのは冗長すぎます。代わりに、次のようにします：

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

新しい`() =>`構文に注目してください。ここで、`() => handleClick(0)`は*アロー関数*であり、関数を定義する短い方法です。四角形がクリックされたとき、`=>`「矢印」の後のコードが実行され、`handleClick(0)`が呼び出されます。

次に、他の8つの四角形を更新して、`handleClick`を呼び出すアロー関数をプロップとして渡します。各`handleClick`の呼び出しの引数が正しい四角形のインデックスに対応するようにします：

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
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
};
```

これで、任意の四角形をクリックしてボードにXを追加できるようになりました：

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

しかし、今回はすべてのステート管理が`Board`コンポーネントによって処理されています！

コードは次のようになっているはずです：

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

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
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

ステート管理が`Board`コンポーネントにあるため、親の`Board`コンポーネントは子の`Square`コンポーネントにプロップスを渡して正しく表示させます。`Square`をクリックすると、子の`Square`コンポーネントは親の`Board`コンポーネントにボードのステートを更新するように依頼します。`Board`のステートが変更されると、`Board`コンポーネントとそのすべての子`Square`が自動的に再レンダリングされます。すべての四角形のステートを`Board`コンポーネントに保持することで、将来的に勝者を決定することができます
。

クリックして左上の四角形に`X`を追加する際に何が起こるかを振り返ってみましょう：

1. 左上の四角形をクリックすると、`button`が`Square`から受け取った`onClick`プロップとして関数が実行されます。`Square`コンポーネントはその関数を`onSquareClick`プロップとして`Board`から受け取りました。`Board`コンポーネントはその関数をJSX内で直接定義し、`handleClick`を引数`0`で呼び出します。
1. `handleClick`は引数（`0`）を使用して、`squares`配列の最初の要素を`null`から`X`に更新します。
1. `Board`コンポーネントの`squares`ステートが更新されると、`Board`とそのすべての子コンポーネントが再レンダリングされます。これにより、インデックス`0`の`Square`コンポーネントの`value`プロップが`null`から`X`に変更されます。

最終的に、ユーザーは左上の四角形がクリック後に空から`X`に変わったことを確認します。

<Note>

DOMの`<button>`要素の`onClick`属性は、Reactにとって特別な意味を持ちます。これは組み込みコンポーネントだからです。`Square`のようなカスタムコンポーネントの場合、名前は自由に決めることができます。`Square`の`onSquareClick`プロップや`Board`の`handleClick`関数に任意の名前を付けても、コードは同じように動作します。Reactでは、イベントを表すプロップには`onSomething`という名前を、イベントを処理する関数定義には`handleSomething`という名前を付けるのが慣例です。

</Note>

### 不変性の重要性 {/*why-immutability-is-important*/}

`handleClick`内で、既存の配列を変更する代わりに`.slice()`を呼び出して`squares`配列のコピーを作成していることに注目してください。これを説明するために、不変性とその重要性について説明する必要があります。

データを変更するには、一般的に2つのアプローチがあります。最初のアプローチは、データの値を直接変更することです。2つ目のアプローチは、変更したいデータの新しいコピーを作成することです。`squares`配列を変更する場合は次のようになります：

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// これで`squares`は["X", null, null, null, null, null, null, null, null]になります。
```

データを変更せずに変更する場合は次のようになります：

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// これで`squares`は変更されませんが、`nextSquares`の最初の要素は`null`ではなく`'X'`になります。
```

結果は同じですが、直接データを変更しないことで、いくつかの利点が得られます。

不変性は、複雑な機能の実装を非常に簡単にします。このチュートリアルの後半では、ゲームの履歴をレビューし、過去の手に「ジャンプバック」できる「タイムトラベル」機能を実装します。この機能はゲームに特有のものではなく、特定のアクションを元に戻したりやり直したりする機能はアプリケーションの一般的な要件です。直接データを変更しないことで、以前のデータバージョンをそのまま保持し、後で再利用することができます。

不変性にはもう一つの利点があります。デフォルトでは、親コンポーネントのステートが変更されると、すべての子コンポーネントが自動的に再レンダリングされます。これは、変更の影響を受けなかった子コンポーネントも含まれます。再レンダリングはユーザーにとって目に見えるものではないため（積極的に避けるべきではありません！）、パフォーマンスの理由から、明らかに影響を受けなかった部分の再レンダリングをスキップしたい場合があります。不変性は、コンポーネントがデータが変更されたかどうかを比較するのを非常に安価にします。Reactがコンポーネントを再レンダリングするタイミングを選択する方法については、[`memo` APIリファレンス](/reference/react/memo)で詳しく学ぶことができます。

### 順番にプレイする {/*taking-turns*/}

次に、この三目並べゲームの大きな欠陥を修正する時が来ました：`O`をボードにマークできません。

デフォルトで最初の手を`X`に設定します。これを追跡するために、`Board`コンポーネントに別のステートを追加します：

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

プレイヤーが手を進めるたびに、`xIsNext`（ブール値）が反転して次のプレイヤーを決定し、ゲームのステートが保存されます。`Board`の`handleClick`関数を更新して、`xIsNext`の値を反転させます：

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

これで、異なる四角形をクリックすると、`X`と`O`が交互に表示されるようになります！

しかし、問題があります。同じ四角形を複数回クリックしてみてください：

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

`X`が`O`に上書きされます！これはゲームに非常に興味深いひねりを加えますが、今回は元のルールに従います。

四角形に`X`または`O`をマークする際に、最初にその四角形にすでに`X`または`O`の値があるかどうかを確認していません。これを修正するために、*早期リターン*を行います。四角形にすでに`X`または`O`があるかどうかを確認します。四角形がすでに埋まっている場合、`handleClick`関数内で早期に`return`します--ボードのステートを更新する前に。

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

これで、`X`や`O`を空の四角形にのみ追加できるようになりました！この時点でコードは次のようになっているはずです：

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
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

### 勝者の宣言 {/*declaring-a-winner*/}

プレイヤーが交互に手を進めるようになったので、ゲームが勝利したときや、もう手を進めることができないときに表示するテキストを追加します。これを行うために、9つの四角形の配列を受け取り、勝者をチェックし、適切に`'X'`、`'O'`、または`null`を返す`calculateWinner`というヘルパー関数を追加します。`calculateWinner`関数はReactに特有のものではないので、あまり心配しないでください：

```js src/App.js
export default function Board() {
  //...
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
    [2, 4, 6]
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

<Note>

`calculateWinner`を`Board`の前に定義するか後に定義するかは関係ありません。毎回コンポーネントを編集するたびにスクロールする必要がないように、最後に配置しましょう。

</Note>

`Board`コンポーネントの`handleClick`関数内で`calculateWinner(squares)`を呼び出して、プレイヤーが勝利したかどうかを確認します。ユーザーがすでに`X`または`O`をクリックした四角形をクリックしたかどうかを確認するのと同時に、このチェックを行います。両方の場合に早期にリターンしたいと思います：

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

ゲームが終了したことをプレイヤーに知らせるために、「Winner: X」や「Winner: O」などのテキストを表示できます。これを行うために、`Board`コンポーネントに`status`セクションを追加します。ゲームが終了した場合は勝者を表示し、ゲームが進行中の場合は次のプレイヤーのターンを表示します：

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

おめでとうございます！これで動作する三目並べゲームが完成しました。そして、Reactの基本も学びました。つまり、ここでの真の勝者はあなたです。コードは次のようになっているはずです：

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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

## タイムトラ
ベルの追加 {/*adding-time-travel*/}

最後の演習として、ゲームの過去の手に「戻る」機能を追加しましょう。

### 手の履歴を保存する {/*storing-a-history-of-moves*/}

`Squares`配列を変更していた場合、タイムトラベルを実装するのは非常に難しいでしょう。

しかし、各手の後に`squares`配列の新しいコピーを作成し、不変として扱いました。これにより、過去の`squares`配列のすべてのバージョンを保存し、すでに発生した手の間を移動することができます。

過去の`squares`配列を`history`と呼ばれる別の配列に保存します。`history`配列は、最初の手から最後の手までのすべてのボード状態を表し、次のような形になります：

```jsx
[
  // 最初の手の前
  [null, null, null, null, null, null, null, null, null],
  // 最初の手の後
  [null, null, null, null, 'X', null, null, null, null],
  // 2番目の手の後
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### 再度ステートをリフトアップする {/*lifting-state-up-again*/}

過去の手のリストを表示するために、新しいトップレベルコンポーネント`Game`を作成します。ここに、ゲームの履歴を含む`history`ステートを配置します。

`history`ステートを`Game`コンポーネントに配置することで、`squares`ステートを子の`Board`コンポーネントから削除できます。`Square`コンポーネントから`Board`コンポーネントにステートを「リフトアップ」したように、`Board`からトップレベルの`Game`コンポーネントにステートをリフトアップします。これにより、`Game`コンポーネントが`Board`のデータを完全に制御し、`history`から以前の手をレンダリングするように`Board`に指示できます。

まず、`export default`を使用して`Game`コンポーネントを追加します。`Board`コンポーネントといくつかのマークアップをレンダリングします：

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

`function Board() {`宣言の前に`export default`キーワードを削除し、`function Game() {`宣言の前に追加します。これにより、`index.js`ファイルがトップレベルコンポーネントとして`Board`コンポーネントではなく`Game`コンポーネントを使用するように指示します。`Game`コンポーネントが返す追加の`div`は、後でボードに追加するゲーム情報のスペースを確保します。

`Game`コンポーネントに、次のプレイヤーを追跡するステートと手の履歴を追跡するステートを追加します：

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

`[Array(9).fill(null)]`は、9つの`null`を持つ単一のアイテムを含む配列です。

現在の手の四角形をレンダリングするために、`history`の最後の四角形配列を読み取ります。これには`useState`は必要ありません。レンダリング中に計算するだけで十分です：

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

次に、`Game`コンポーネント内に`handlePlay`関数を作成し、プレイヤーが手を進めたときに`Board`コンポーネントから呼び出されるようにします。`xIsNext`、`currentSquares`、および`handlePlay`をプロップとして`Board`コンポーネントに渡します：

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

`Board`コンポーネントを完全に受け取ったプロップによって制御されるようにします。`Board`コンポーネントを3つのプロップ（`xIsNext`、`squares`、およびプレイヤーが手を進めたときに更新された四角形配列を`onPlay`関数に渡す新しい`onPlay`関数）を受け取るように変更します。次に、`Board`関数の最初の2行を削除します：

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

次に、`Board`コンポーネントの`handleClick`関数内の`setSquares`および`setXIsNext`呼び出しを削除し、新しい`onPlay`関数を呼び出すように置き換えます。これにより、ユーザーが四角形をクリックしたときに`Game`コンポーネントが`Board`を更新できるようになります：

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

`Board`コンポーネントは、`Game`コンポーネントから渡されたプロップによって完全に制御されます。ゲームを再び動作させるために、`Game`コンポーネント内の`handlePlay`関数を実装する必要があります。

`handlePlay`が呼び出されたときに何をすべきか？`Board`は更新された配列で`setSquares`を呼び出していましたが、今は更新された`squares`配列を`onPlay`に渡しています。

`handlePlay`関数は、`Game`のステートを更新して再レンダリングをトリガーする必要がありますが、`setSquares`関数はもうありません。代わりに、`history`ステート変数を使用してこの情報を保存しています。`history`を更新して、更新された`squares`配列を新しい履歴エントリとして追加します。また、`xIsNext`を切り替えます。これは`Board`が以前行っていたことです：

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

ここで、`[...history, nextSquares]`は、`history`内のすべてのアイテムの後に`nextSquares`を含む新しい配列を作成します。（`...history`[*スプレッド構文*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)は「`history`内のすべてのアイテムを列挙する」と読むことができます。）

例えば、`history`が`[[null,null,null], ["X",null,null]]`で、`nextSquares`が`["X",null,"O"]`の場合、新しい`[...history, nextSquares]`配列は`[[null,null,null], ["X",null,null], ["X",null,"O"]]`になります。

この時点で、ステートを`Game`コンポーネントに移動し、UIはリファクタリング前と同じように完全に動作するはずです。コードは次のようになっているはずです：

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

### 過去の手を表示する {/*showing-the-past-moves*/}

三目並べゲームの履歴を記録しているので、プレイヤーに過去の手のリストを表示できます。

`<button>`のようなReact要素は通常のJavaScriptオブジェクトです。アプリケーション内で渡すことができます。Reactで複数のアイテムをレンダリングするには、React要素の配列を使用できます。

すでにステート内に`history`の配列があるので、これをReact要素の配列に変換して、画面上にボタンのリストを表示します。JavaScriptでは、配列を別の配列に変換するために[配列の`map`メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)を使用できます：

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

`Game`コンポーネント内で`history`を`map`して、過去の手のリストを表示するReact要素に変換します：

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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
```

コードが次のようになっているはずです。開発者ツールのコンソールに次のエラーが表示されるはずです：

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>

次のセクションでこのエラーを修正します。

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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

`history`配列を`map`メソッドで反復処理する際、`squares`引数は`history`の各要素を通過し、`move`引数は各配列インデックス（`0`、`1`、`2`、…）を通過します。ほとんどの場合、実際の配列要素が必要ですが、手のリストをレンダリングするためにはインデックスだけが必要です。

三目並べゲームの履歴の各手に対して、ボタン`<button>`を含むリストアイテム`<li>`を作成します。ボタンには`jumpTo`という関数を呼び出す`onClick`ハンドラがあります（まだ実装していません）。

現時点では、ゲームの履歴に発生した手のリストが表示され、開発者ツールのコンソールにエラーが表示されます。「key」エラーが何を意味するのかを説明しましょう。

### キーの選択 {/*picking-a-key*/}

リストをレンダリングする際、Reactは各レンダリングされたリストアイテムに関する情報を保存します。リストを更新する際、Reactは何が変更されたのかを判断する必要があります。アイテムが追加、削除、再配置、または更新された可能性があります。

次のように移行することを想像してください：

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

から

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

更新されたカウントに加えて、人間がこれを読むと、AlexaとBenの順序が入れ替わり、ClaudiaがAlexaとBenの間に挿入されたと考えるでしょう。しかし、Reactはコンピュータプログラムであり、意図を知ることはできないため、各リストアイテムを兄弟から区別するためにキーを指定する必要があります。データがデータベースからのものであれば、Alexa、Ben、ClaudiaのデータベースIDをキーとして使用できます。

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

リストが再レンダリングされると、Reactは各リストアイテムのキーを取り、前のリストアイテムの中から一致するキーを検索します。現在のリストに以前存在しなかったキーがある場合、Reactはコンポーネントを作成します。現在のリストに以前存在していたキーがない場合、Reactは以前のコンポーネントを破棄します。2つのキーが一致する場合、対応するコンポーネントが移動されます。

キーはReactに各コンポーネントの識別情報を伝え、再レンダリング間でステートを維持することができます。コンポーネントのキーが変更されると、コンポーネントは破棄され、新しいステートで再作成されます。

**動的リストを構築する際には、適切なキーを割り当てることを強くお勧めします。** 適切なキーがない場合は、データを再構築してキーを持つようにすることを検討するかもしれません。

キーが指定されていない場合、Reactはエラーを報告し、デフォルトで配列インデックスをキーとして使用します。配列インデックスをキーとして使用することは、リストアイテムの再配置や挿入/削除を試みる際に問題があります。明示的に`key={i}`を渡すことでエラーは解消されますが、配列インデックスと同じ問題があり、ほとんどの場合推奨されません。

キーはグローバルに一意である必要はなく、コンポーネントとその兄弟間で一意であれば十分です。

### タイムトラベルの実装 {/*implementing-time-travel*/}

三目並べゲームの履歴では、各過去の手には一意のIDが関連付けられています。それは手の連続番号です。手は再配置、削除、または途中で挿入されることはないため、手のインデックスをキーとして使用するのは安全です。

`Game`関数内で、`<li key={move}>`としてキーを追加します。レンダリングされたゲームをリロードすると、Reactの「キー」エラーが消えるはずです：

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

`jumpTo`を実装する前に、`Game`コンポーネントがユーザーが現在表示しているステップを追跡する必要があります。これを行うために、`currentMove`という新しいステート変数を定義し、デフォルトを`0`に設定します：

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

次に、`Game`内の`jumpTo`関数を更新して、その`currentMove`を更新します。また、`currentMove`を変更する数が偶数である場合、`xIsNext`を`true`に設定します。

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

次に、四角形をクリックしたときに呼び出される`Game`の`handlePlay`関数に2つの変更を加えます。

- 「タイムトラベル」してから新しい手を進める場合、その時点までの履歴のみを保持したいです。`history`内のすべてのアイテムの後に`nextSquares`を追加する代わりに、`history.slice(0, currentMove + 1)`内のすべてのアイテムの後に追加します。これにより、古い履歴のその部分のみを保持します。
- 各手が進められるたびに、`currentMove`を最新の履歴エントリを指すように更新する必要があります。

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

最後に、常に最終手をレンダリングするのではなく、現在選択されている手をレンダリングするように`Game`コンポーネントを変更します：

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

ゲームの履歴の任意のステップをクリックすると、三目並べボードがそのステップが発生した後のボードの状態を即座に表示するはずです。

<Sandpack>

```js src/App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
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

export default function Game(){
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
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

### 最終的なクリーンアップ {/*final-cleanup*/}

コードを非常に注意深く見ると、`xIsNext === true`は`currentMove`が偶数のときであり、`xIsNext === false`は`currentMove`が奇数のときであることに気付くかもしれません。言い換えれば、`currentMove`の値がわかれば、`xIsNext`が何であるべきかを常に把握できます。

これらの両方をステートに保存する理由はありません。実際、冗長なステートを避けるように常に努めてください。ステートに保存する内容を簡素化することで、バグが減り、コードが理解しやすくなります。`Game`を変更して、`xIsNext`を別のステート変数として保存せず、`currentMove`に基づいて計算するようにします：

```js {4,11,15}
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
  // ...
}
```

`xIsNext`のステート宣言や`setXIsNext`の呼び出しはもう必要ありません。これで、`xIsNext`が`currentMove`と同期しなくなる可能性はなくなります。

### まとめ {/*wrapping-up*/}

おめでとうございます！次の機能を持つ三目並べゲームを作成しました：

- 三目並べをプレイできる
- プレイヤーがゲームに勝ったときに表示する
- ゲームが進行するにつれてゲームの履歴を保存する
- プレイヤーがゲームの履歴をレビューし、ゲームのボードの以前のバージョンを表示できる

素晴らしい仕事です！これでReactの基本的な理解ができたと思います。

最終結果をここで確認できます：

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

時間がある場合や新しいReactスキルを練習したい場合は、次のような改善案を試してみてください。難易度の低い順にリストされています：

1. 現在の手のみ、「You are at move #...」と表示し、ボタンを表示しない。
1. `Board`をリライトして、ハードコーディングするのではなく、ループを使用して四角形を作成する。
1. 手のリストを昇順または降順に並べ替えるトグルボタンを追加する。
1. 誰かが勝ったとき、勝利を引き起こした3つの四角形をハイライトする（誰も勝たなかった場合、引き分けのメッセージを表示する）。
1. 各手の位置を（行、列）の形式で手の履歴リストに表示する。

このチュートリアルを通じて、要素、コンポーネント、プロップス、ステートなどのReactの概念に触れました。これらの概念がゲームを構築する際にどのように機能するかを見たので、[Thinking in React](/learn/thinking-in-react)をチェックして、アプリのUIを構築する際に同じReactの概念がどのように機能するかを確認してください。