---
title: UIの説明
---

<Intro>

Reactはユーザーインターフェース（UI）をレンダリングするためのJavaScriptライブラリです。UIはボタン、テキスト、画像などの小さな単位から構築されます。Reactを使用すると、これらを再利用可能でネスト可能な*コンポーネント*に組み合わせることができます。ウェブサイトから電話アプリまで、画面上のすべてのものはコンポーネントに分解できます。この章では、Reactコンポーネントを作成、カスタマイズ、および条件付きで表示する方法を学びます。

</Intro>

<YouWillLearn isChapter={true}>

* [最初のReactコンポーネントを書く方法](/learn/your-first-component)
* [複数のコンポーネントファイルを作成するタイミングと方法](/learn/importing-and-exporting-components)
* [JSXを使用してJavaScriptにマークアップを追加する方法](/learn/writing-markup-with-jsx)
* [JSXで中括弧を使用してコンポーネントからJavaScript機能にアクセスする方法](/learn/javascript-in-jsx-with-curly-braces)
* [propsを使用してコンポーネントを設定する方法](/learn/passing-props-to-a-component)
* [コンポーネントを条件付きでレンダリングする方法](/learn/conditional-rendering)
* [複数のコンポーネントを一度にレンダリングする方法](/learn/rendering-lists)
* [コンポーネントを純粋に保つことで混乱するバグを回避する方法](/learn/keeping-components-pure)
* [UIをツリーとして理解することがなぜ有用か](/learn/understanding-your-ui-as-a-tree)

</YouWillLearn>

## 最初のコンポーネント {/*your-first-component*/}

Reactアプリケーションは*コンポーネント*と呼ばれるUIの独立した部分から構築されます。Reactコンポーネントは、マークアップを散りばめることができるJavaScript関数です。コンポーネントはボタンのように小さいものから、ページ全体のように大きいものまであります。以下は、3つの`Profile`コンポーネントをレンダリングする`Gallery`コンポーネントの例です：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

**[最初のコンポーネント](/learn/your-first-component)**を読んで、Reactコンポーネントの宣言と使用方法を学びましょう。

</LearnMore>

## コンポーネントのインポートとエクスポート {/*importing-and-exporting-components*/}

1つのファイルに多くのコンポーネントを宣言できますが、大きなファイルはナビゲートが難しくなることがあります。これを解決するために、コンポーネントを独自のファイルに*エクスポート*し、別のファイルからそのコンポーネントを*インポート*することができます：

<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

**[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)**を読んで、コンポーネントを独自のファイルに分割する方法を学びましょう。

</LearnMore>

## JSXでマークアップを書く {/*writing-markup-with-jsx*/}

各Reactコンポーネントは、Reactがブラウザにレンダリングするマークアップを含むJavaScript関数です。Reactコンポーネントは、JSXと呼ばれる構文拡張を使用してそのマークアップを表現します。JSXはHTMLに非常に似ていますが、少し厳格で動的な情報を表示できます。

既存のHTMLマークアップをReactコンポーネントに貼り付けると、必ずしも動作するわけではありません：

<Sandpack>

```js
export default function TodoList() {
  return (
    // これはうまくいきません！
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>新しい信号機を発明する
      <li>映画のシーンをリハーサルする
      <li>スペクトル技術を改善する
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

このような既存のHTMLがある場合は、[コンバーター](https://transform.tools/html-to-jsx)を使用して修正できます：

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>新しい信号機を発明する</li>
        <li>映画のシーンをリハーサルする</li>
        <li>スペクトル技術を改善する</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

**[JSXでマークアップを書く](/learn/writing-markup-with-jsx)**を読んで、有効なJSXの書き方を学びましょう。

</LearnMore>

## JSXで中括弧を使用してJavaScriptにアクセスする {/*javascript-in-jsx-with-curly-braces*/}

JSXを使用すると、JavaScriptファイル内にHTMLのようなマークアップを書くことができ、レンダリングロジックとコンテンツを同じ場所に保持できます。時々、そのマークアップ内に少しのJavaScriptロジックを追加したり、動的なプロパティを参照したりすることがあります。このような場合、JSX内で中括弧を使用してJavaScriptへの「窓」を開くことができます：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}のTodos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>ビデオフォンを改善する</li>
        <li>航空学の講義を準備する</li>
        <li>アルコール燃料エンジンに取り組む</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

**[JSXで中括弧を使用してJavaScriptにアクセスする](/learn/javascript-in-jsx-with-curly-braces)**を読んで、JSXからJavaScriptデータにアクセスする方法を学びましょう。

</LearnMore>

## コンポーネントにpropsを渡す {/*passing-props-to-a-component*/}

Reactコンポーネントは*props*を使用して互いに通信します。すべての親コンポーネントは、子コンポーネントにpropsを渡すことで情報を伝えることができます。PropsはHTML属性を思い出させるかもしれませんが、オブジェクト、配列、関数、さらにはJSXなど、任意のJavaScript値を渡すことができます！

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

**[コンポーネントにpropsを渡す](/learn/passing-props-to-a-component)**を読んで、propsを渡して読み取る方法を学びましょう。

</LearnMore>

## 条件付きレンダリング {/*conditional-rendering*/}

コンポーネントは、異なる条件に応じて異なるものを表示する必要があることがよくあります。Reactでは、`if`文、`&&`、および`? :`演算子などのJavaScript構文を使用してJSXを条件付きでレンダリングできます。

この例では、JavaScriptの`&&`演算子を使用してチェックマークを条件付きでレンダリングしています：

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
      <h1>Sally Rideのパッキングリスト</h1>
      <ul>
        <Item
          isPacked={true}
          name="宇宙服"
        />
        <Item
          isPacked={true}
          name="金の葉のヘルメット"
        />
        <Item
          isPacked={false}
          name="Tamの写真"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

**[条件付きレンダリング](/learn/conditional-rendering)**を読んで、コンテンツを条件付きでレンダリングするさまざまな方法を学びましょう。

</LearnMore>

## リストのレンダリング {/*rendering-lists*/}

データのコレクションから複数の類似したコンポーネントを表示したいことがよくあります。JavaScriptの`filter()`および`map()`をReactと一緒に使用して、データの配列をフィルタリングおよび変換し、コンポーネントの配列に変換できます。

各配列アイテムには`key`を指定する必要があります。通常、データベースのIDを`key`として使用します。キーは、リストが変更されてもReactが各アイテムの位置を追跡できるようにします。

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

**[リストのレンダリング](/learn/rendering-lists)**を読んで、コンポーネントのリストをレンダリングする方法と、キーを選択する方法を学びましょう。

</LearnMore>

## コンポーネントを純粋に保つ {/*keeping-components-pure*/}

一部のJavaScript関数は*純粋*です。純粋な関数は：

* **自分の仕事に専念する。** 呼び出される前に存在していたオブジェクトや変数を変更しません。
* **同じ入力、同じ出力。** 同じ入力を与えられた場合、純粋な関数は常に同じ結果を返すべきです。

コンポーネントを純粋な関数として厳密に記述することで、コードベースが成長するにつれて混乱するバグや予測不可能な動作を回避できます。以下は不純なコンポーネントの例です：

<Sandpack>

```js
let guest = 0;

function Cup() {
  // 悪い例：既存の変数を変更しています！
  guest = guest + 1;
  return <h2>ゲスト#{guest}のためのティーカップ</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

このコンポーネントを純粋にするには、既存の変数を変更する代わりにpropsを渡します：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>ゲスト#{guest}のためのティーカップ</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

**[コンポーネントを純粋に保つ](/learn/keeping-components-pure)**を読んで、純粋で予測可能な関数としてコンポーネントを記述する方法を学びましょう。

</LearnMore>

## UIをツリーとして理解する {/*your-ui-as-a-tree*/}

Reactはコンポーネントとモジュール間の関係をモデル化するためにツリーを使用します。

Reactのレンダーツリーは、コンポーネント間の親子関係を表すものです。

<Diagram name="generic_render_tree" height={250} width={500} alt="5つのノードを持つツリーグラフで、各ノードはコンポーネントを表しています。ルートノードはツリーグラフの最上部にあり、「Root Component」とラベル付けされています。2つの矢印が「Component A」と「Component C」に向かって下に伸びています。各矢印には「renders」とラベル付けされています。「Component A」には「Component B」に向かう1つの「renders」矢印があります。「Component C」には「Component D」に向かう1つの「renders」矢印があります。">

Reactレンダーツリーの例。

</Diagram>

ツリーの上部、ルートコンポーネントの近くにあるコンポーネントは、トップレベルコンポーネントと見なされます。子コンポーネントを持たないコンポーネントはリーフコンポーネントです。このコンポーネントの分類は、データフローとレンダリングパフォーマンスを理解するのに役立ちます。

JavaScriptモジュール間の関係をモデル化することも、アプリを理解するための有用な方法です。これをモジュール依存ツリーと呼びます。

<Diagram name="generic_dependency_tree" height={250} width={500} alt="5つのノードを持つツリーグラフで、各ノードはJavaScriptモジュールを表しています。最上部のノードは「RootModule.js」とラベル付けされています。3つの矢印が「ModuleA.js」、「ModuleB.js」、および「ModuleC.js」に向かって伸びています。各矢印には「imports」とラベル付けされています。「ModuleC.js」ノードには「ModuleD.js」に向かう1つの「imports」矢印があります。">

モジュール依存ツリーの例。

</Diagram>

依存ツリーは、クライアントがダウンロードしてレンダリングするための関連するJavaScriptコードをバンドルするためにビルドツールによってよく使用されます。大きなバンドルサイズはReactアプリのユーザーエクスペリエンスを低下させます。モジュール依存ツリーを理解することは、このような問題をデバッグするのに役立ちます。

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

**[UIをツリーとして理解する](/learn/understanding-your-ui-as-a-tree)**を読んで、Reactアプリのレンダーおよびモジュール依存ツリーを作成する方法と、それらがユーザーエクスペリエンスとパフォーマンスを向上させるための有用なメンタルモデルである理由を学びましょう。

</LearnMore>

## 次は何ですか？ {/*whats-next*/}

[最初のコンポーネント](/learn/your-first-component)に進んで、この章をページごとに読み始めましょう！

または、これらのトピックにすでに精通している場合は、[インタラクティビティの追加](/learn/adding-interactivity)について読んでみてください。