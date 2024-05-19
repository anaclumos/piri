---
title: クイックスタート
---

<Intro>

React ドキュメントへようこそ！このページでは、日常的に使用する React の概念の 80% について紹介します。

</Intro>

<YouWillLearn>

- コンポーネントの作成とネストの方法
- マークアップとスタイルの追加方法
- データの表示方法
- 条件とリストのレンダリング方法
- イベントに応答して画面を更新する方法
- コンポーネント間でデータを共有する方法

</YouWillLearn>

## コンポーネントの作成とネスト {/*components*/}

React アプリは *コンポーネント* で構成されています。コンポーネントは独自のロジックと外観を持つ UI (ユーザーインターフェース) の一部です。コンポーネントはボタンのように小さいものから、ページ全体のように大きいものまであります。

React コンポーネントはマークアップを返す JavaScript 関数です：

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

`MyButton` を宣言したので、別のコンポーネントにネストできます：

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

`<MyButton />` が大文字で始まることに注目してください。これが React コンポーネントであることを示しています。React コンポーネントの名前は常に大文字で始める必要があり、HTML タグは小文字でなければなりません。

結果を見てみましょう：

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

`export default` キーワードはファイル内のメインコンポーネントを指定します。JavaScript の構文に慣れていない場合は、[MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) や [javascript.info](https://javascript.info/import-export) に素晴らしい参考資料があります。

## JSX でマークアップを書く {/*writing-markup-with-jsx*/}

上記のマークアップ構文は *JSX* と呼ばれます。これはオプションですが、ほとんどの React プロジェクトはその便利さから JSX を使用します。すべての [ローカル開発のために推奨するツール](/learn/installation) は、標準で JSX をサポートしています。

JSX は HTML よりも厳格です。タグを `<br />` のように閉じる必要があります。コンポーネントは複数の JSX タグを返すことはできません。共有の親、例えば `<div>...</div>` や空の `<>...</>` ラッパーに包む必要があります：

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

大量の HTML を JSX に移行する場合は、[オンラインコンバーター](https://transform.tools/html-to-jsx) を使用できます。

## スタイルの追加 {/*adding-styles*/}

React では、CSS クラスを `className` で指定します。これは HTML の [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) 属性と同じように機能します：

```js
<img className="avatar" />
```

次に、別の CSS ファイルでそのための CSS ルールを書きます：

```css
/* あなたの CSS 内 */
.avatar {
  border-radius: 50%;
}
```

React は CSS ファイルの追加方法を規定していません。最も簡単な場合、HTML に [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) タグを追加します。ビルドツールやフレームワークを使用している場合は、そのドキュメントを参照してプロジェクトに CSS ファイルを追加する方法を学んでください。

## データの表示 {/*displaying-data*/}

JSX では、マークアップを JavaScript に埋め込むことができます。中括弧を使用して JavaScript に「エスケープバック」し、コードから変数を埋め込んでユーザーに表示できます。例えば、これは `user.name` を表示します：

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

JSX 属性からも「JavaScript にエスケープ」できますが、引用符の代わりに中括弧を使用する必要があります。例えば、`className="avatar"` は `"avatar"` 文字列を CSS クラスとして渡しますが、`src={user.imageUrl}` は JavaScript の `user.imageUrl` 変数の値を読み取り、その値を `src` 属性として渡します：

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

JSX の中括弧内により複雑な式を入れることもできます。例えば、[文字列の連結](https://javascript.info/operators#string-concatenation-with-binary) です：

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

上記の例では、`style={{}}` は特別な構文ではなく、`style={ }` JSX 中括弧内の通常の `{}` オブジェクトです。スタイルが JavaScript 変数に依存する場合は、`style` 属性を使用できます。

## 条件付きレンダリング {/*conditional-rendering*/}

React では、条件を書くための特別な構文はありません。代わりに、通常の JavaScript コードを書くときに使用するのと同じ技術を使用します。例えば、[`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) 文を使用して条件付きで JSX を含めることができます：

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

よりコンパクトなコードを好む場合は、[条件付き `?` 演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) を使用できます。`if` とは異なり、JSX 内で動作します：

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

`else` ブランチが不要な場合は、より短い [論理 `&&` 構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation) を使用することもできます：

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

これらのアプローチはすべて、属性を条件付きで指定する場合にも機能します。この JavaScript 構文に慣れていない場合は、常に `if...else` を使用することから始めることができます。

## リストのレンダリング {/*rendering-lists*/}

コンポーネントのリストをレンダリングするには、[`for` ループ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) や [配列の `map()` 関数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) などの JavaScript 機能を利用します。

例えば、製品の配列があるとします：

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

コンポーネント内で、`map()` 関数を使用して製品の配列を `<li>` アイテムの配列に変換します：

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

`<li>` に `key` 属性があることに注意してください。リスト内の各アイテムには、その兄弟の中で一意に識別する文字列または数値を渡す必要があります。通常、キーはデータベース ID などのデータから取得します。React はキーを使用して、後でアイテムを挿入、削除、または並べ替えた場合に何が起こったかを把握します。

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## イベントに応答する {/*responding-to-events*/}

コンポーネント内で *イベントハンドラー* 関数を宣言することで、イベントに応答できます：

```js {2-4,7}
function MyButton() {
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

`onClick={handleClick}` に括弧がないことに注意してください！イベントハンドラー関数を _呼び出さない_ でください：単に *渡す* だけです。ユーザーがボタンをクリックすると、React がイベントハンドラーを呼び出します。

## 画面の更新 {/*updating-the-screen*/}

多くの場合、コンポーネントが何らかの情報を「記憶」して表示することを望むでしょう。例えば、ボタンがクリックされた回数をカウントしたい場合などです。これを行うには、コンポーネントに *状態* を追加します。

まず、React から [`useState`](/reference/react/useState) をインポートします：

```js
import { useState } from 'react';
```

次に、コンポーネント内で *状態変数* を宣言します：

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState` からは、現在の状態 (`count`) と、それを更新する関数 (`setCount`) の 2 つが得られます。これらには任意の名前を付けることができますが、慣例として `[something, setSomething]` と書きます。

ボタンが最初に表示されたとき、`count` は `0` です。これは `useState()` に `0` を渡したためです。状態を変更したいときは、`setCount()` を呼び出して新しい値を渡します。このボタンをクリックすると、カウンターが増加します：

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React は再びコンポーネント関数を呼び出します。この時、`count` は `1` になります。その後、`2` になります。という具合です。

同じコンポーネントを複数回レンダリングすると、それぞれが独自の状態を持ちます。各ボタンを個別にクリックしてください：

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

各ボタンが独自の `count` 状態を「記憶」し、他のボタンに影響を与えないことに注目してください。

## フックの使用 {/*using-hooks*/}

`use` で始まる関数は *フック* と呼ばれます。`useState` は React が提供する組み込みのフックです。他の組み込みフックは [API リファレンス](/reference/react) にあります。既存のフックを組み合わせて独自のフックを書くこともできます。

フックは他の関数よりも制限があります。フックはコンポーネント (または他のフック) の *トップ* でのみ呼び出すことができます。条件やループ内で `useState` を使用したい場合は、新しいコンポーネントを抽出してそこに配置します。

## コンポーネント間でデータを共有する {/*sharing-data-between-components*/}

前の例では、各 `MyButton` が独立した `count` を持ち、各ボタンがクリックされたときにそのボタンの `count` だけが変更されました：

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="3つのコンポーネントのツリーを示す図。1つの親コンポーネントは MyApp とラベル付けされ、2つの子コンポーネントは MyButton とラベル付けされています。両方の MyButton コンポーネントには値がゼロのカウントが含まれています。">

最初は、各 `MyButton` の `count` 状態は `0` です

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="前の図と同じですが、最初の子 MyButton コンポーネントのカウントがクリックを示すように強調表示され、カウント値が1に増加しています。2番目の MyButton コンポーネントにはまだ値がゼロです。">

最初の `MyButton` が `count` を `1` に更新します

</Diagram>

</DiagramGroup>

しかし、しばしばコンポーネントが *データを共有し、常に一緒に更新する* 必要があります。

両方の `MyButton` コンポーネントが同じ `count` を表示し、一緒に更新されるようにするには、状態を個々のボタンから「上方」に移動し、それらすべてを含む最も近いコンポーネントに移動する必要があります。

この例では、それは `MyApp` です：

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="3つのコンポーネントのツリーを示す図。1つの親コンポーネントは MyApp とラベル付けされ、2つの子コンポーネントは MyButton とラベル付けされています。MyApp にはゼロのカウント値が含まれており、それが両方の MyButton コンポーネントに渡され、両方ともゼロの値を示しています。">

最初は、`MyApp` の `count` 状態は `0` であり、両方の子に渡されます

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="前の図と同じですが、親 MyApp コンポーネントのカウントがクリックを示すように強調表示され、値が1に増加しています。両方の子 MyButton コンポーネントへのフローも強調表示されており、各子のカウント値が1に設定されていることを示しています。">

クリックすると、`MyApp` が `count` 状態を `1` に更新し、それを両方の子に渡します

</Diagram>

</DiagramGroup>

今度はどちらのボタンをクリックしても、`MyApp` の `count` が変わり、それが両方の `MyButton` の `count` を変更します。これをコードで表現する方法は次のとおりです。

まず、状態を `MyButton` から `MyApp` に *移動* します：

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}
```

次に、`MyApp` から各 `MyButton` に状態を *渡し*、共有のクリックハンドラーを渡します。`<img>` のような組み込みタグで以前に行ったように、JSX の中括弧を使用して `MyButton` に情報を渡すことができます：

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

このようにして渡す情報は _props_ と呼ばれます。これで `MyApp` コンポーネントは `count` 状態と `handleClick` イベントハンドラーを含み、それらを各ボタンに *props として渡します*。

最後に、`MyButton` を変更して、親コンポーネントから渡された props を *読み取る* ようにします：

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

ボタンをクリックすると、`onClick` ハンドラーが発火します。各ボタンの `onClick` props は `MyApp` 内の `handleClick` 関数に設定されているため、その中のコードが実行されます。そのコードは `setCount(count + 1)` を呼び出し、`count` 状態変数を増加させます。新しい `count` 値は各ボタンに props として渡されるため、すべてのボタンが新しい値を表示します。これを「状態のリフトアップ」と呼びます。状態を上に移動することで、コンポーネント間で共有しました。

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## 次のステップ {/*next-steps*/}

これで、React コードの基本的な書き方を理解しました！

[チュートリアル](/learn/tutorial-tic-tac-toe) をチェックして、実際に使ってみて、React で最初のミニアプリを作成してみましょう。