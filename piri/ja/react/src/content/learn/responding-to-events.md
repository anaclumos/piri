---
title: イベントへの対応
---

<Intro>

Reactでは、JSXに*イベントハンドラ*を追加できます。イベントハンドラは、クリック、ホバー、フォーム入力のフォーカスなどのインタラクションに応じてトリガーされる独自の関数です。

</Intro>

<YouWillLearn>

* イベントハンドラを書くさまざまな方法
* 親コンポーネントからイベント処理ロジックを渡す方法
* イベントの伝播とそれを停止する方法

</YouWillLearn>

## イベントハンドラの追加 {/*adding-event-handlers*/}

イベントハンドラを追加するには、まず関数を定義し、それを適切なJSXタグに[プロップとして渡します](/learn/passing-props-to-a-component)。例えば、以下はまだ何もしないボタンです：

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

ユーザーがクリックしたときにメッセージを表示するようにするには、次の3つのステップに従います：

1. `Button`コンポーネント内に`handleClick`という関数を宣言します。
2. その関数内にロジックを実装します（メッセージを表示するために`alert`を使用します）。
3. `<button>` JSXに`onClick={handleClick}`を追加します。

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

`handleClick`関数を定義し、それを`<button>`に[プロップとして渡しました](/learn/passing-props-to-a-component)。`handleClick`は**イベントハンドラ**です。イベントハンドラ関数は：

* 通常、コンポーネント内で定義されます。
* `handle`で始まり、イベント名が続く名前を持ちます。

慣例として、イベントハンドラは`handle`に続いてイベント名を付けることが一般的です。`onClick={handleClick}`、`onMouseEnter={handleMouseEnter}`などがよく見られます。

また、JSX内でインラインでイベントハンドラを定義することもできます：

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

または、より簡潔に、アロー関数を使用して：

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

これらのスタイルはすべて同等です。インラインイベントハンドラは短い関数に便利です。

<Pitfall>

イベントハンドラに渡す関数は、呼び出すのではなく渡す必要があります。例えば：

| 関数を渡す（正しい）             | 関数を呼び出す（間違い）             |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

違いは微妙です。最初の例では、`handleClick`関数が`onClick`イベントハンドラとして渡されます。これは、Reactにそれを覚えておいて、ユーザーがボタンをクリックしたときにのみ関数を呼び出すように指示します。

2番目の例では、`handleClick()`の末尾の`()`が関数を*即座に* [レンダリング中](/learn/render-and-commit)に実行します。これは、[JSX `{`と`}`](/learn/javascript-in-jsx-with-curly-braces)内のJavaScriptがすぐに実行されるためです。

インラインでコードを書くときも、同じ落とし穴が異なる形で現れます：

| 関数を渡す（正しい）                    | 関数を呼び出す（間違い）            |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

このようにインラインコードを渡すと、クリック時に発火せず、コンポーネントがレンダリングされるたびに発火します：

```jsx
// このアラートはコンポーネントがレンダリングされるときに発火し、クリック時には発火しません！
<button onClick={alert('You clicked me!')}>
```

イベントハンドラをインラインで定義したい場合は、次のように無名関数でラップします：

```jsx
<button onClick={() => alert('You clicked me!')}>
```

これにより、レンダリングごとにコードを実行するのではなく、後で呼び出される関数が作成されます。

どちらの場合も、渡すべきものは関数です：

* `<button onClick={handleClick}>`は`handleClick`関数を渡します。
* `<button onClick={() => alert('...')}>`は`() => alert('...')`関数を渡します。

[アロー関数についてもっと読む。](https://javascript.info/arrow-functions-basics)

</Pitfall>

### イベントハンドラでプロップを読み取る {/*reading-props-in-event-handlers*/}

イベントハンドラはコンポーネント内で宣言されるため、コンポーネントのプロップにアクセスできます。以下は、クリックされたときに`message`プロップを含むアラートを表示するボタンです：

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

これにより、これらの2つのボタンが異なるメッセージを表示できるようになります。渡されるメッセージを変更してみてください。

### イベントハンドラをプロップとして渡す {/*passing-event-handlers-as-props*/}

多くの場合、親コンポーネントが子のイベントハンドラを指定したいことがあります。ボタンを考えてみてください：`Button`コンポーネントを使用する場所によって、異なる関数を実行したいかもしれません。例えば、あるボタンは映画を再生し、別のボタンは画像をアップロードします。

これを行うには、親から受け取ったプロップをイベントハンドラとして渡します：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

ここで、`Toolbar`コンポーネントは`PlayButton`と`UploadButton`をレンダリングします：

- `PlayButton`は`handlePlayClick`を`Button`内の`onClick`プロップとして渡します。
- `UploadButton`は`() => alert('Uploading!')`を`Button`内の`onClick`プロップとして渡します。

最後に、`Button`コンポーネントは`onClick`というプロップを受け取り、それを組み込みのブラウザ`<button>`に`onClick={onClick}`として直接渡します。これにより、Reactはクリック時に渡された関数を呼び出すように指示します。

[デザインシステム](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)を使用する場合、ボタンのようなコンポーネントはスタイリングを含むが、動作を指定しないことが一般的です。代わりに、`PlayButton`や`UploadButton`のようなコンポーネントがイベントハンドラを渡します。

### イベントハンドラプロップの命名 {/*naming-event-handler-props*/}

`<button>`や`<div>`のような組み込みコンポーネントは、`onClick`のような[ブラウザイベント名](/reference/react-dom/components/common#common-props)のみをサポートします。しかし、独自のコンポーネントを作成する場合、そのイベントハンドラプロップの名前は自由に決めることができます。

慣例として、イベントハンドラプロップは`on`で始まり、その後に大文字が続くべきです。

例えば、`Button`コンポーネントの`onClick`プロップは`onSmash`と呼ばれることもあります：

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

この例では、`<button onClick={onSmash}>`は、ブラウザの`<button>`（小文字）がまだ`onClick`というプロップを必要とすることを示していますが、カスタム`Button`コンポーネントが受け取るプロップ名は自由に決めることができます！

コンポーネントが複数のインタラクションをサポートする場合、アプリ固有の概念に基づいてイベントハンドラプロップを命名することがあります。例えば、この`Toolbar`コンポーネントは`onPlayMovie`と`onUploadImage`イベントハンドラを受け取ります：

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

`App`コンポーネントは`Toolbar`が`onPlayMovie`や`onUploadImage`をどう扱うかを知る必要はありません。それは`Toolbar`の実装の詳細です。ここでは、`Toolbar`はそれらを`Button`の`onClick`ハンドラとして渡しますが、後でキーボードショートカットでそれらをトリガーすることもできます。`onPlayMovie`のようなアプリ固有のインタラクションにプロップを命名することで、後でそれらの使用方法を変更する柔軟性が得られます。

<Note>

イベントハンドラに適切なHTMLタグを使用することを確認してください。例えば、クリックを処理するには、[`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)を使用し、`<div onClick={handleClick}>`を使用しないでください。実際のブラウザ`<button>`を使用することで、キーボードナビゲーションなどの組み込みのブラウザ動作が有効になります。ボタンのデフォルトのブラウザスタイリングが気に入らず、リンクや別のUI要素のように見せたい場合は、CSSで実現できます。[アクセシブルなマークアップの書き方についてもっと学ぶ。](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

</Note>

## イベントの伝播 {/*event-propagation*/}

イベントハンドラは、コンポーネントが持つ子要素からのイベントもキャッチします。イベントがツリーを「バブル」または「伝播」すると言います：イベントが発生した場所から始まり、ツリーを上に向かって進みます。

この`<div>`には2つのボタンが含まれています。`<div>`と各ボタンにはそれぞれ独自の`onClick`ハンドラがあります。ボタンをクリックすると、どのハンドラが発火すると思いますか？

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

どちらかのボタンをクリックすると、その`onClick`が最初に実行され、その後に親`<div>`の`onClick`が実行されます。したがって、2つのメッセージが表示されます。ツールバー自体をクリックすると、親`<div>`の`onClick`のみが実行されます。

<Pitfall>

すべてのイベントはReactで伝播しますが、`onScroll`はそれをアタッチしたJSXタグでのみ機能します。

</Pitfall>

### 伝播の停止 {/*stopping-propagation*/}

イベントハンドラは**イベントオブジェクト**を唯一の引数として受け取ります。慣例として、それは通常`e`と呼ばれ、「イベント」を意味します。このオブジェクトを使用して、イベントに関する情報を読み取ることができます。

そのイベントオブジェクトを使用して伝播を停止することもできます。イベントが親コンポーネントに到達するのを防ぎたい場合は、次のように`e.stopPropagation()`を呼び出す必要があります：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

ボタンをクリックすると：

1. Reactは`<button>`に渡された`onClick`ハンドラを呼び出します。
2. そのハンドラは、`Button`内で定義されており、次のことを行います：
   * `e.stopPropagation()`を呼び出し、イベントのさらなるバブルを防ぎます。
   * `onClick`関数を呼び出します。これは`Toolbar`コンポーネントから渡されたプロップです。
3. `Toolbar`コンポーネントで定義されたその関数は、ボタン自身のアラートを表示します。
4. 伝播が停止されたため、親`<div>`の`onClick`ハンドラは実行されません。

その結果、`e.stopPropagation()`により、ボタンをクリックすると、2つのアラート（`<button>`と親ツールバー`<div>`から）ではなく、ボタン自身のアラートのみが表示されます。ボタンをクリックすることは、周囲のツールバーをクリックすることとは異なるため、このUIでは伝播を停止することが理にかなっています。

<DeepDive>

#### キャプチャフェーズイベント {/*capture-phase-events*/}

まれに、*伝播を停止した場合でも*子要素のすべてのイベントをキャッチする必要があるかもしれません。例えば、伝播ロジックに関係なく、すべてのクリックを分析に記録したい場合です。これを行うには、イベント名の末尾に`Capture`を追加します：

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

各イベントは3つのフェーズで伝播します：

1. 下に移動し、すべての`onClickCapture`ハンドラを呼び出します。
2. クリックされた要素の`onClick`ハンドラを実行します。
3. 上に移動し、すべての`onClick`ハンドラを呼び出します。

キャプチャイベントはルーターや分析のようなコードに役立ちますが、アプリコードではあまり使用しないでしょう。

</DeepDive>

### 伝播の代替としてハンドラを渡す {/*passing-handlers-as-alternative-to-propagation*/}

このクリックハンドラがコードの行を実行し、その後に親から渡された`onClick`プロップを呼び出す方法に注目してください：

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

このハンドラにさらにコードを追加してから、親の`onClick`イベントハンドラを呼び出すこともできます。このパターンは伝播の*代替*を提供します。子コンポーネントがイベントを処理しながら、親コンポーネントが追加の動作を指定できるようにします。伝播とは異なり、自動ではありません。しかし、このパターンの利点は、イベントの結果として実行されるコードのチェーン全体を明確に追跡できることです。

伝播に依存していて、どのハンドラが実行されるのか、なぜ実行されるのかを追跡するのが難しい場合は、このアプローチを試してみてください。

### デフォルトの動作を防ぐ {/*preventing-default-behavior*/}

一部のブラウザイベントにはデフォルトの動作が関連付けられています。例えば、フォームの送信イベントは、内部のボタンがクリックされたときにページ全体をリロードします：

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

これを防ぐには、イベントオブジェクトで`e.preventDefault()`を呼び出します：

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

`e.stopPropagation()`と`e.preventDefault()`を混同しないでください。どちらも有用ですが、無関係です：

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)は、上位のタグにアタッチされたイベントハンドラが発火するのを防ぎます。
* [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault)は、デフォルトのブラウザ動作を持ついくつかのイベントのデフォルト動作を防ぎます。

## イベントハンドラは副作用を持つことができますか？ {/*can-event-handlers-have-side-effects*/}

もちろんです！イベントハンドラは副作用に最適な場所です。

レンダリング関数とは異なり、イベントハンドラは[純粋](/learn/keeping-components-pure)である必要はないため、何かを*変更*するのに最適な場所です。例えば、入力の値を入力に応じて変更したり、ボタンの押下に応じてリストを変更したりします。しかし、何かを変更するためには、まずそれを保存する方法が必要です。Reactでは、これは[状態、コンポーネントのメモリ](/learn/state-a-components-memory)を使用して行います。次のページでそのすべてを学びます。

<Recap>

* `<button>`のような要素に関数をプロップとして渡すことでイベントを処理できます。
* イベントハンドラは渡されるべきであり、**呼び出されるべきではありません！** `onClick={handleClick}`、`onClick={handleClick()}`ではありません。
* イベントハンドラ関数は別々に定義することも、インラインで定義することもできます。
* イベントハンドラはコンポーネント内で定義されるため、プロップにアクセスできます。
* 親でイベントハンドラを宣言し、それを子にプロップとして渡すことができます。
* アプリケーション固有の名前で独自のイベントハンドラプロップを定義できます。
* イベントは上向きに伝播します。最初の引数で`e.stopPropagation()`を呼び出してそれを防ぎます。
* イベントには不要なデフォルトのブラウザ動作があるかもしれません。`e.preventDefault()`を呼び出してそれを防ぎます。
* 子ハンドラからイベントハンドラプロップを明示的に呼び出すことは、伝播の良い代替手段です。

</Recap>

<Challenges>

#### イベントハンドラを修正する {/*fix-an-event-handler*/}

このボタンをクリックすると、ページの背景が白と黒の間で切り替わるはずです。しかし、クリックしても何も起こりません。問題を修正してください（`handleClick`内のロジックについては心配しないでください—その部分は問題ありません）。

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

問題は、`<button onClick={handleClick()}>`が`handleClick`関数を渡すのではなく、レンダリング中に呼び出していることです。`()`呼び出しを削除して`<button onClick={handleClick}>`にすることで問題が解決します：

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

または、呼び出しを別の関数にラップすることもできます。例えば、`<button onClick={() => handleClick()}>`のように：

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### イベントを接続する {/*wire-up-the-events*/}

この`ColorSwitch`コンポーネントはボタンをレンダリングします。ページの色を変更することになっています。ボタンをクリックすると色が変わるように、親から受け取った`onChangeColor`イベントハンドラプロップに接続してください。

これを行った後、ボタンをクリックするとページのクリックカウンターも増加することに気づくでしょう。親コンポーネントを書いた同僚は、`onChangeColor`がカウンターを増加させないと主張しています。他に何が起こっている可能性がありますか？ボタンをクリックすると*色だけ*が変わり、カウンターが増加しないように修正してください。

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

まず、イベントハンドラを追加する必要があります。例えば、`<button onClick={onChangeColor}>`のように。

しかし、これによりカウンターが増加する問題が発生します。`onChangeColor`がこれを行わないと同僚が主張する場合、問題はこのイベントが伝播し、上位のハンドラがそれを行っていることです。この問題を解決するには、伝播を停止する必要があります。しかし、`onChangeColor`を呼び出すことを忘れないでください。

<Sandpack>

```js src/ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>