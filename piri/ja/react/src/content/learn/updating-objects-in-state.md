---
title: 状態のオブジェクトを更新する
---

<Intro>

状態はオブジェクトを含むあらゆる種類のJavaScript値を保持できます。しかし、Reactの状態に保持しているオブジェクトを直接変更してはいけません。代わりに、オブジェクトを更新したい場合は、新しいオブジェクトを作成するか、既存のオブジェクトをコピーしてから、そのコピーを使用するように状態を設定する必要があります。

</Intro>

<YouWillLearn>

- Reactの状態でオブジェクトを正しく更新する方法
- ネストされたオブジェクトを変更せずに更新する方法
- 不変性とは何か、そしてそれを壊さない方法
- Immerを使ってオブジェクトのコピーをより簡単にする方法

</YouWillLearn>

## 変更とは何か？ {/*whats-a-mutation*/}

状態にはあらゆる種類のJavaScript値を保存できます。

```js
const [x, setX] = useState(0);
```

これまで、数値、文字列、ブール値を扱ってきました。これらの種類のJavaScript値は「不変」であり、変更不可能または「読み取り専用」を意味します。値を置き換えるために再レンダリングをトリガーできます：

```js
setX(5);
```

`x`の状態は`0`から`5`に変わりましたが、_数値`0`自体_は変わりません。JavaScriptでは、数値、文字列、ブール値などの組み込みのプリミティブ値を変更することはできません。

次に、状態にオブジェクトを考えてみましょう：

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

技術的には、_オブジェクト自体_の内容を変更することは可能です。**これを変更と呼びます：**

```js
position.x = 5;
```

しかし、Reactの状態にあるオブジェクトは技術的には変更可能ですが、数値、ブール値、文字列のように**不変であるかのように**扱うべきです。変更する代わりに、常にそれらを置き換えるべきです。

## 状態を読み取り専用として扱う {/*treat-state-as-read-only*/}

言い換えれば、**状態に入れるJavaScriptオブジェクトを読み取り専用として扱うべきです。**

この例では、現在のポインタ位置を表すために状態にオブジェクトを保持しています。赤い点は、プレビューエリアに触れたりカーソルを移動させたりすると動くはずですが、点は初期位置に留まります：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

問題はこのコードの部分にあります。

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

このコードは[前回のレンダリング](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)から`position`に割り当てられたオブジェクトを変更します。しかし、状態設定関数を使用せずに、Reactはオブジェクトが変更されたことを知りません。そのため、Reactは何も反応しません。これは、食事を終えた後に注文を変更しようとするようなものです。状態を変更することは場合によっては機能しますが、お勧めしません。レンダリングでアクセスできる状態値を読み取り専用として扱うべきです。

この場合、実際に[再レンダリングをトリガーする](/learn/state-as-a-snapshot#setting-state-triggers-renders)には、**新しいオブジェクトを作成して状態設定関数に渡します：**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition`を使用すると、Reactに次のことを伝えています：

* `position`をこの新しいオブジェクトに置き換える
* そして、このコンポーネントを再レンダリングする

プレビューエリアに触れたりホバーしたりすると、赤い点がポインタに従うようになったことに注目してください：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### ローカルな変更は問題ありません {/*local-mutation-is-fine*/}

このようなコードは、状態内の*既存の*オブジェクトを変更するため問題です：

```js
position.x = e.clientX;
position.y = e.clientY;
```

しかし、このようなコードは**完全に問題ありません**。なぜなら、*新しく作成した*オブジェクトを変更しているからです：

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

実際、これは次のように書くのと完全に同等です：

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

変更は、状態内の*既存の*オブジェクトを変更する場合にのみ問題です。新しく作成したオブジェクトを変更することは問題ありません。なぜなら、*まだ他のコードがそれを参照していないからです。* 変更しても、それに依存するものに影響を与えることはありません。これを「ローカルな変更」と呼びます。レンダリング中にローカルな変更を行うこともできます。非常に便利で完全に問題ありません！

</DeepDive>  

## スプレッド構文を使ったオブジェクトのコピー {/*copying-objects-with-the-spread-syntax*/}

前の例では、`position`オブジェクトは常に現在のカーソル位置から新しく作成されます。しかし、多くの場合、新しいオブジェクトを作成する際に*既存の*データを含めたいことがあります。例えば、フォームの*一つの*フィールドだけを更新し、他のすべてのフィールドの以前の値を保持したい場合です。

これらの入力フィールドは、`onChange`ハンドラが状態を変更するため、機能しません：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

例えば、この行は過去のレンダリングから状態を変更します：

```js
person.firstName = e.target.value;
```

期待する動作を得るための信頼できる方法は、新しいオブジェクトを作成し、それを`setPerson`に渡すことです。しかし、ここでは**既存のデータを新しいオブジェクトにコピー**する必要があります。なぜなら、変更されたのはフィールドの一つだけだからです：

```js
setPerson({
  firstName: e.target.value, // 入力からの新しい名前
  lastName: person.lastName,
  email: person.email
});
```

すべてのプロパティを個別にコピーする必要がないように、`...` [オブジェクトスプレッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)構文を使用できます。

```js
setPerson({
  ...person, // 古いフィールドをコピー
  firstName: e.target.value // しかしこれを上書き
});
```

これでフォームが機能します！

各入力フィールドに対して個別の状態変数を宣言しなかったことに注目してください。大きなフォームの場合、すべてのデータをオブジェクトにまとめておくことは非常に便利です。ただし、正しく更新する限りです！

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`...`スプレッド構文は「浅い」コピーであることに注意してください。これは一段階深いレベルだけをコピーします。これにより高速ですが、ネストされたプロパティを更新する場合は、複数回使用する必要があります。

<DeepDive>

#### 複数のフィールドに対して単一のイベントハンドラを使用する {/*using-a-single-event-handler-for-multiple-fields*/}

オブジェクト定義内で`[`と`]`の括弧を使用して動的な名前のプロパティを指定することもできます。ここでは、3つの異なるハンドラの代わりに単一のイベントハンドラを使用した同じ例です：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

ここで、`e.target.name`は`<input>`DOM要素に与えられた`name`プロパティを指します。

</DeepDive>

## ネストされたオブジェクトの更新 {/*updating-a-nested-object*/}

次のようなネストされたオブジェクト構造を考えてみましょう：

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

`person.artwork.city`を更新したい場合、変更で行う方法は明確です：

```js
person.artwork.city = 'New Delhi';
```

しかし、Reactでは状態を不変として扱います！`city`を変更するためには、まず新しい`artwork`オブジェクトを作成し（以前のデータで事前に入力）、次に新しい`person`オブジェクトを作成して新しい`artwork`を指す必要があります：

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

または、単一の関数呼び出しとして書かれたもの：

```js
setPerson({
  ...person, // 他のフィールドをコピー
  artwork: { // しかしアートワークを置き換える
    ...person.artwork, // 同じものを使う
    city: 'New Delhi' // しかしNew Delhiに！
  }
});
```

これは少し冗長ですが、多くのケースでは問題なく動作します：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input {
margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### オブジェクトは実際にはネストされていない {/*objects-are-not-really-nested*/}

このようなオブジェクトはコード上では「ネスト」されているように見えます：

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

しかし、「ネスト」はオブジェクトの動作を考える上で不正確な表現です。コードが実行されるとき、「ネストされた」オブジェクトというものは存在しません。実際には2つの異なるオブジェクトを見ています：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1`オブジェクトは`obj2`の「中」にあるわけではありません。例えば、`obj3`も`obj1`を「指す」ことができます：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

もし`obj3.artwork.city`を変更すると、それは`obj2.artwork.city`と`obj1.city`の両方に影響を与えます。これは、`obj3.artwork`、`obj2.artwork`、および`obj1`が同じオブジェクトであるためです。オブジェクトを「ネスト」されたものとして考えると見えにくいですが、実際にはプロパティでお互いを「指している」別々のオブジェクトです。

</DeepDive>  

### Immerを使って簡潔な更新ロジックを書く {/*write-concise-update-logic-with-immer*/}

状態が深くネストされている場合、[それを平坦化する](/learn/choosing-the-state-structure#avoid-deeply-nested-state)ことを検討するかもしれません。しかし、状態構造を変更したくない場合、ネストされたスプレッドのショートカットを好むかもしれません。[Immer](https://github.com/immerjs/use-immer)は、便利ですが変更する構文を使用して、コピーを生成する作業を引き受ける人気のライブラリです。Immerを使用すると、書いたコードが「ルールを破って」オブジェクトを変更しているように見えます：

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

しかし、通常の変更とは異なり、過去の状態を上書きしません！

<DeepDive>

#### Immerはどのように機能するのか？ {/*how-does-immer-work*/}

Immerが提供する`draft`は、[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)と呼ばれる特別なタイプのオブジェクトで、何をしているかを「記録」します。これが、自由に変更できる理由です！内部的には、Immerは`draft`のどの部分が変更されたかを把握し、編集内容を含む完全に新しいオブジェクトを生成します。

</DeepDive>

Immerを試すには：

1. `npm install use-immer`を実行してImmerを依存関係として追加します
2. 次に、`import { useState } from 'react'`を`import { useImmer } from 'use-immer'`に置き換えます

以下は、上記の例をImmerに変換したものです：

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

イベントハンドラがどれだけ簡潔になったかに注目してください。`useState`と`useImmer`を1つのコンポーネントで自由に組み合わせて使用できます。Immerは、状態にネストがある場合やオブジェクトのコピーが繰り返しのコードにつながる場合に、更新ハンドラを簡潔に保つための優れた方法です。

<DeepDive>

#### なぜReactで状態を変更することは推奨されないのか？ {/*why-is-mutating-state-not-recommended-in-react*/}

いくつかの理由があります：

* **デバッグ:** `console.log`を使用して状態を変更しない場合、過去のログは最新の状態変更によって上書きされません。そのため、レンダリング間で状態がどのように変化したかを明確に確認できます。
* **最適化:** 一般的なReactの[最適化戦略](/reference/react/memo)は、以前のpropsや状態が次のものと同じである場合に作業をスキップすることに依存しています。状態を決して変更しない場合、変更があったかどうかを確認するのは非常に高速です。もし`prevObj === obj`であれば、その中で何も変更されていないことを確信できます。
* **新機能:** 新しいReactの機能は、状態が[スナップショットのように扱われる](/learn/state-as-a-snapshot)ことに依存しています。過去の状態を変更している場合、新しい機能を使用することができなくなるかもしれません。
* **要件の変更:** Undo/Redoの実装、変更履歴の表示、フォームを以前の値にリセットするなどのアプリケーション機能は、何も変更されない場合に追加しやすくなります。これは、過去の状態のコピーをメモリに保持し、適切なときに再利用できるためです。変更的なアプローチで始めると、このような機能を後で追加するのが難しくなることがあります。
* **シンプルな実装:** Reactは変更に依存しないため、オブジェクトに特別なことをする必要がありません。プロパティをハイジャックしたり、常にProxyにラップしたり、他の「リアクティブ」なソリューションが行うような初期化時の作業を行う必要がありません。これが、Reactが追加のパフォーマンスや正確性の問題なしに、どんなオブジェクトでも状態に入れることができる理由です。

実際には、Reactで状態を変更することはしばしば「うまくいく」ことがありますが、このアプローチを念頭に置いて開発された新しいReactの機能を使用できるようにするために、状態を変更しないことを強くお勧めします。将来の貢献者や、将来の自分自身が感謝するでしょう！

</DeepDive>

<Recap>

* Reactのすべての状態を不変として扱います。
* 状態にオブジェクトを保存する場合、それらを変更してもレンダリングはトリガーされず、以前のレンダリング「スナップショット」の状態が変更されます。
* オブジェクトを変更する代わりに、新しいバージョンを作成し、それを状態に設定して再レンダリングをトリガーします。
* `{...obj, something: 'newValue'}`オブジェクトスプレッド構文を使用してオブジェクトのコピーを作成できます。
* スプレッド構文は浅いコピーです：一段階深いレベルだけをコピーします。
* ネストされたオブジェクトを更新するには、更新する場所からすべてのコピーを作成する必要があります。
* 繰り返しのコピーコードを減らすために、Immerを使用します。

</Recap>

<Challenges>

#### 不正な状態更新を修正する {/*fix-incorrect-state-updates*/}

このフォームにはいくつかのバグがあります。スコアを増やすボタンを数回クリックしてください。スコアが増えないことに気づくでしょう。次に、名前を編集すると、スコアが突然変更に「追いついた」ことに気づくでしょう。最後に、姓を編集すると、スコアが完全に消えてしまうことに気づくでしょう。

あなたのタスクは、これらのバグをすべて修正することです。修正する際に、それぞれのバグが発生する理由を説明してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

ここに両方のバグを修正したバージョンがあります：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`handlePlusClick`の問題は、`player`オブジェクトを変更していたことです。その結果、Reactは再レンダリングの理由を知らず、画面上のスコアを更新しませんでした。これが、名前を編集したときに状態が更新され、再レンダリングがトリガーされ、画面上のスコアも更新された理由です。

`handleLastNameChange`の問題は、既存の`...player`フィールドを新しいオブジェクトにコピーしなかったことです。これが、姓を編集した後にスコアが失われた理由です。

</Solution>

#### 変更を見つけて修正する {/*find-and-fix-the-mutation*/}

静的な背景上にドラッグ可能なボックスがあります。選択入力を使用してボックスの色を変更できます。

しかし、バグがあります。最初にボックスを移動し、その後色を変更すると、背景（動かないはずのもの）がボックスの位置に「ジャンプ」します。しかし、これは起こるべきではありません：`Background`の`position`プロパティは`initialPosition`に設定されています。これは`{ x: 0, y: 0 }`です。なぜ色を変更した後に背景が動くのでしょうか？

バグを見つけて修正してください。

<Hint>

何か予期しないことが変わる場合、変更があります。`App.js`内の変更を見つけて修正してください。

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

問題は`handleMove`内の変更にありました。それは`shape.position`を変更していましたが、それは`initialPosition`が指す同じオブジェクトです。これが、形状と背景の両方が動く理由です。（これは変更なので、無関係な更新（色の変更）が再レンダリングをトリガーするまで画面に反映されません。）

修正は、`handleMove`から変更を削除し、スプレッド構文を使用して形状をコピーすることです。`+=`は変更なので、通常の`+`操作を使用するように書き直す必要があります。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Immerを使ってオブジェクトを更新する {/*update-an-object-with-immer*/}

これは前のチャレンジと同じバグのある例です。今回は、Immerを使用して変更を修正してください。便利のために、`useImmer`はすでにインポートされているので、`shape`状態変数を使用するように変更する必要があります。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

これはImmerで書き直された解決策です。イベントハンドラが変更する形で書かれていることに注目してくださいが、バグは発生しません。これは、内部的にImmerが既存のオブジェクトを決して変更しないためです。

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

</Solution>

</Challenges>