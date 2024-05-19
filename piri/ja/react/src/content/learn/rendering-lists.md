---
title: リストのレンダリング
---

<Intro>

データのコレクションから複数の類似コンポーネントを表示したいことがよくあります。JavaScriptの[配列メソッド](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#)を使用してデータの配列を操作できます。このページでは、Reactと共に[`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)および[`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map)を使用して、データの配列をフィルタリングおよび変換し、コンポーネントの配列に変換します。

</Intro>

<YouWillLearn>

* JavaScriptの`map()`を使用して配列からコンポーネントをレンダリングする方法
* JavaScriptの`filter()`を使用して特定のコンポーネントのみをレンダリングする方法
* Reactのキーを使用するタイミングと理由

</YouWillLearn>

## 配列からデータをレンダリングする {/*rendering-data-from-arrays*/}

コンテンツのリストがあるとします。

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

これらのリスト項目の違いはその内容、つまりデータだけです。インターフェースを構築する際には、異なるデータを使用して同じコンポーネントの複数のインスタンスを表示する必要がよくあります。コメントのリストからプロフィール画像のギャラリーまで、さまざまな状況でデータをJavaScriptオブジェクトや配列に保存し、[`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)や[`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)のようなメソッドを使用してコンポーネントのリストをレンダリングできます。

以下は、配列から項目のリストを生成する短い例です：

1. データを配列に移動します：

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. `people`のメンバーを新しいJSXノードの配列`listItems`にマッピングします：

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. コンポーネントから`listItems`を`<ul>`でラップして返します：

```js
return <ul>{listItems}</ul>;
```

結果は次のようになります：

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

上記のサンドボックスにはコンソールエラーが表示されます：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

このエラーの修正方法は後で学びます。その前に、データに構造を追加しましょう。

## アイテムの配列をフィルタリングする {/*filtering-arrays-of-items*/}

このデータはさらに構造化できます。

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

例えば、職業が`'chemist'`の人だけを表示する方法が欲しいとします。JavaScriptの`filter()`メソッドを使用して、そのような人々だけを返すことができます。このメソッドはアイテムの配列を取り、それらを「テスト」（`true`または`false`を返す関数）に通し、テストに合格したアイテム（`true`を返したアイテム）だけの新しい配列を返します。

`profession`が`'chemist'`であるアイテムだけが欲しいのです。この「テスト」関数は`(person) => person.profession === 'chemist'`のようになります。これを組み合わせる方法は次のとおりです：

1. `people`を`person.profession === 'chemist'`でフィルタリングして、`filter()`を呼び出し、「化学者」だけの新しい配列`chemists`を作成します：

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. 次に`chemists`をマッピングします：

```js {1,13}
const listItems = chemists.map(person =>
  <li>
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
```

3. 最後に、コンポーネントから`listItems`を返します：

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
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
  return <ul>{listItems}</ul>;
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

アロー関数は`=>`の直後の式を暗黙的に返すため、`return`文は必要ありません：

```js
const listItems = chemists.map(person =>
  <li>...</li> // 暗黙のreturn！
);
```

ただし、**`=>`の後に`{`中括弧が続く場合は、`return`を明示的に書く必要があります！**

```js
const listItems = chemists.map(person => { // 中括弧
  return <li>...</li>;
});
```

`=> {`を含むアロー関数は["ブロックボディ"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)を持つと言われます。これにより、1行以上のコードを書くことができますが、`return`文を自分で書く必要があります。忘れると、何も返されません！

</Pitfall>

## `key`でリストアイテムの順序を保つ {/*keeping-list-items-in-order-with-key*/}

上記のすべてのサンドボックスにはコンソールにエラーが表示されます：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

各配列アイテムに`key`を与える必要があります。これは、その配列内の他のアイテムと一意に識別するための文字列または数値です：

```js
<li key={person.id}>...</li>
```

<Note>

JSX要素が`map()`呼び出しの直下にある場合は、常にキーが必要です！

</Note>

キーは、各コンポーネントがどの配列アイテムに対応するかをReactに伝え、後でそれらを一致させるために使用されます。これは、配列アイテムが移動（例：ソートによる）、挿入、または削除される場合に重要です。適切に選ばれた`key`は、Reactが何が起こったのかを推測し、DOMツリーに正しい更新を行うのに役立ちます。

キーをその場で生成するのではなく、データに含めるべきです：

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // JSXでキーとして使用
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // JSXでキーとして使用
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // JSXでキーとして使用
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // JSXでキーとして使用
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // JSXでキーとして使用
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### 各リストアイテムに複数のDOMノードを表示する {/*displaying-several-dom-nodes-for-each-list-item*/}

各アイテムが1つではなく複数のDOMノードをレンダリングする必要がある場合はどうしますか？

短い[`<>...</>`フラグメント](/reference/react/Fragment)構文ではキーを渡すことができないため、単一の`<div>`にグループ化するか、やや長い[より明示的な`<Fragment>`構文](/reference/react/Fragment#rendering-a-list-of-fragments)を使用する必要があります：

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

フラグメントはDOMから消えるため、これにより`<h1>`, `<p>`, `<h1>`, `<p>`のようなフラットなリストが生成されます。

</DeepDive>

### `key`をどこから取得するか {/*where-to-get-your-key*/}

データのソースによってキーのソースは異なります：

* **データベースからのデータ:** データがデータベースから来る場合、データベースのキー/IDを使用できます。これらは本質的に一意です。
* **ローカルで生成されたデータ:** データがローカルで生成され、永続化される場合（例：メモアプリのメモ）、アイテムを作成する際にインクリメントカウンター、[`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)または[`uuid`](https://www.npmjs.com/package/uuid)のようなパッケージを使用します。

### キーのルール {/*rules-of-keys*/}

* **キーは兄弟間で一意でなければなりません。** ただし、_異なる_配列のJSXノードに対して同じキーを使用することは問題ありません。
* **キーは変更してはいけません。** そうしないと、その目的が失われます！レンダリング中にキーを生成しないでください。

### なぜReactはキーを必要とするのか？ {/*why-does-react-need-keys*/}

デスクトップ上のファイルに名前がなかったと想像してみてください。代わりに、順序で参照します。最初のファイル、2番目のファイル、など。慣れることはできますが、ファイルを削除すると混乱します。2番目のファイルが最初のファイルになり、3番目のファイルが2番目のファイルになり、など。

フォルダ内のファイル名と配列内のJSXキーは同様の目的を果たします。それらは兄弟間でアイテムを一意に識別することを可能にします。適切に選ばれたキーは、配列内の位置よりも多くの情報を提供します。位置が並べ替えによって変更されても、`key`はアイテムの生涯を通じてReactがそれを識別するのに役立ちます。

<Pitfall>

アイテムのインデックスをキーとして使用したくなるかもしれません。実際、キーを指定しない場合、Reactはそれを使用します。しかし、アイテムが挿入、削除、または配列が並べ替えられると、レンダリング順序は時間とともに変わります。インデックスをキーとして使用すると、微妙で混乱するバグが発生することがよくあります。

同様に、`key={Math.random()}`のようにキーをその場で生成しないでください。これにより、レンダリング間でキーが一致しなくなり、すべてのコンポーネントとDOMが毎回再作成されます。これは遅いだけでなく、リストアイテム内のユーザー入力が失われる可能性があります。代わりに、データに
基づいた安定したIDを使用してください。

コンポーネントは`key`をプロパティとして受け取りません。これはReact自身によってのみヒントとして使用されます。コンポーネントがIDを必要とする場合は、別のプロパティとして渡す必要があります：`<Profile key={id} userId={id} />`。

</Pitfall>

<Recap>

このページでは次のことを学びました：

* データをコンポーネントから配列やオブジェクトのようなデータ構造に移動する方法。
* JavaScriptの`map()`を使用して類似のコンポーネントのセットを生成する方法。
* JavaScriptの`filter()`を使用してフィルタリングされたアイテムの配列を作成する方法。
* 配列内の各コンポーネントに`key`を設定する理由と方法。これにより、Reactは位置やデータが変更されても各コンポーネントを追跡できます。

</Recap>

<Challenges>

#### リストを2つに分割する {/*splitting-a-list-in-two*/}

この例では、すべての人々のリストを表示しています。

これを変更して、**化学者**と**その他の人々**の2つのリストを順番に表示します。以前と同様に、`person.profession === 'chemist'`でその人が化学者かどうかを判断できます。

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

`filter()`を2回使用して2つの別々の配列を作成し、それぞれを`map`で処理できます：

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

この解決策では、`map`呼び出しが親の`<ul>`要素に直接配置されていますが、読みやすさのために変数を導入することもできます。

レンダリングされたリスト間にはまだ重複があります。さらに進んで、繰り返し部分を`<ListSection>`コンポーネントに抽出できます：

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

非常に注意深い読者は、2つの`filter`呼び出しで各人の職業を2回チェックしていることに気付くかもしれません。プロパティのチェックは非常に高速なので、この例では問題ありません。ロジックがそれよりも高価であれば、`filter`呼び出しをループに置き換えて、各人を1回だけチェックすることができます。

実際、`people`が変更されない場合、このコードをコンポーネントの外に移動できます。Reactの観点からは、最終的にJSXノードの配列を提供することが重要です。配列を生成する方法は関係ありません：

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### 1つのコンポーネント内のネストされたリスト {/*nested-lists-in-one-component*/}

この配列からレシピのリストを作成してください！配列内の各レシピについて、その名前を`<h2>`として表示し、その材料を`<ul>`にリストします。

<Hint>

これには2つの異なる`map`呼び出しをネストする必要があります。

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

次のように進めることができます：

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

各`recipes`にはすでに`id`フィールドが含まれているため、外側のループはそれをキーとして使用します。材料をループするためのIDはありません。ただし、同じレシピ内で同じ材料が2回リストされることはないと仮定するのは合理的なので、その名前をキーとして使用できます。代わりにデータ構造を変更してIDを追加するか、インデックスをキーとして使用することもできます（ただし、材料を安全に並べ替えることはできません）。

</Solution>

#### リストアイテムコンポーネントの抽出 {/*extracting-a-list-item-component*/}

この`RecipeList`コンポーネントには2つのネストされた`map`呼び出しがあります。これを簡素化するために、`id`、`name`、および`ingredients`プロパティを受け取る`Recipe`コンポーネントを抽出します。外側の`key`をどこに配置するか、そしてその理由は？

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

JSXを外側の`map`から新しい`Recipe`コンポーネントにコピーして、そのJSXを返すことができます。その後、`recipe.name`を`name`に、`recipe.id`を`id`に変更し、それらを`Recipe`にプロパティとして渡します：

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

ここでは、`<Recipe {...recipe} key={recipe.id} />`は、`recipe`オブジェクトのすべてのプロパティを`Recipe`コンポーネントにプロパティとして渡すという構文ショートカットです。各プロパティを明示的に書くこともできます：`<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`。

**注意すべきは、`key`が`Recipe`自体に指定されている点です。** これは、周囲の配列のコンテキスト内で直接必要だからです。以前は`<div>`の配列があったので、それぞれにキーが必要でしたが、今は`Recipe`の配列があります。言い換えれば、コンポーネントを抽出するときは、コピーして貼り付けたJSXの外側にキーを残すことを忘れないでください。

</Solution>

#### 区切り文字付きのリスト {/*list-with-a-separator*/}

この例では、橘曙覧の有名な俳句を各行を`<p>`タグでラップしてレンダリングしています。あなたの仕事は、各段落の間に`<hr />`区切り文字を挿入することです。最終的な構造は次のようになります：

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

俳句には3行しか含まれていませんが、あなたの解決策は任意の行数で機能する必要があります。`<hr />`要素は`<p>`要素の間にのみ表示され、最初や最後には表示されません！

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

（これは、俳句の行が並べ替えられることがないため、インデックスをキーとして使用することが許容されるまれなケースです。）

<Hint>

`map`を手動ループに変換するか、フラグメントを使用する必要があります。

</Hint>

<Solution>

手動ループを書いて、`<hr />`と`<p>...</p>`を出力配列に挿入することができます：

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // 出力配列を埋める
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // 最初の<hr />を削除
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

元の行インデックスをキーとして使用することはもはや機能しません。なぜなら、各区切り文字と段落が同じ配列にあるからです。しかし、接尾辞を使用してそれぞれに一意のキーを与えることができます。例：`key={i + '-text'}`。

または、`<hr />`と`<p>...</p>`を含むフラグメントのコレクションをレンダリングすることもできます。ただし、`<>...</>`の省略構文はキーを渡すことをサポートしていないため、`<Fragment>`を明示的に書く必要があります：

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

フラグメント（通常は`<> </>`と書かれる）は、余分な`<div>`を追加せずにJSXノードをグループ化することができます！

</Solution>

</Challenges>