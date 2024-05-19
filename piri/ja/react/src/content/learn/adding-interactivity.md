---
title: インタラクティビティの追加
---

<Intro>

画面上のいくつかの要素はユーザー入力に応じて更新されます。例えば、画像ギャラリーをクリックするとアクティブな画像が切り替わります。Reactでは、時間とともに変化するデータを*state*と呼びます。stateはどのコンポーネントにも追加でき、必要に応じて更新できます。この章では、インタラクションを処理し、stateを更新し、時間とともに異なる出力を表示するコンポーネントの書き方を学びます。

</Intro>

<YouWillLearn isChapter={true}>

* [ユーザーが開始したイベントの処理方法](/learn/responding-to-events)
* [stateを使ってコンポーネントが情報を「記憶」する方法](/learn/state-a-components-memory)
* [ReactがUIを2つのフェーズで更新する方法](/learn/render-and-commit)
* [stateが変更直後に更新されない理由](/learn/state-as-a-snapshot)
* [複数のstate更新をキューに入れる方法](/learn/queueing-a-series-of-state-updates)
* [state内のオブジェクトを更新する方法](/learn/updating-objects-in-state)
* [state内の配列を更新する方法](/learn/updating-arrays-in-state)

</YouWillLearn>

## Responding to events {/*responding-to-events*/}

Reactでは、JSXに*イベントハンドラー*を追加できます。イベントハンドラーは、クリック、ホバー、フォーム入力のフォーカスなどのユーザーインタラクションに応じてトリガーされる独自の関数です。

`<button>`のような組み込みコンポーネントは、`onClick`のような組み込みのブラウザイベントのみをサポートします。しかし、独自のコンポーネントを作成し、イベントハンドラープロップに任意のアプリケーション固有の名前を付けることもできます。

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

<LearnMore path="/learn/responding-to-events">

**[Responding to Events](/learn/responding-to-events)**を読んで、イベントハンドラーの追加方法を学びましょう。

</LearnMore>

## State: a component's memory {/*state-a-components-memory*/}

コンポーネントは、インタラクションの結果として画面上の内容を変更する必要があることがよくあります。フォームに入力すると入力フィールドが更新され、画像カルーセルの「次へ」をクリックすると表示される画像が変わり、「購入」をクリックすると商品がショッピングカートに入ります。コンポーネントは、現在の入力値、現在の画像、ショッピングカートなどを「記憶」する必要があります。Reactでは、このようなコンポーネント固有のメモリを*state*と呼びます。

[`useState`](/reference/react/useState)フックを使用してコンポーネントにstateを追加できます。*フック*は、コンポーネントがReactの機能（stateはその機能の1つ）を使用できるようにする特別な関数です。`useState`フックはstate変数を宣言することができます。初期stateを受け取り、現在のstateとそれを更新するためのstateセッター関数のペアを返します。

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

ここでは、画像ギャラリーがクリック時にstateを使用して更新する方法を示します：

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

**[State: A Component's Memory](/learn/state-a-components-memory)**を読んで、値を記憶し、インタラクション時に更新する方法を学びましょう。

</LearnMore>

## Render and commit {/*render-and-commit*/}

コンポーネントが画面に表示される前に、Reactによってレンダリングされる必要があります。このプロセスのステップを理解することで、コードの実行方法を考え、その動作を説明するのに役立ちます。

コンポーネントがキッチンで材料から美味しい料理を作る料理人だと想像してください。このシナリオでは、Reactは顧客からのリクエストを受け取り、それを注文として持ってくるウェイターです。このUIのリクエストと提供のプロセスには3つのステップがあります：

1. レンダリングの**トリガー**（ダイナーの注文をキッチンに届ける）
2. コンポーネントの**レンダリング**（キッチンで注文を準備する）
3. DOMへの**コミット**（テーブルに注文を置く）

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

**[Render and Commit](/learn/render-and-commit)**を読んで、UI更新のライフサイクルを学びましょう。

</LearnMore>

## State as a snapshot {/*state-as-a-snapshot*/}

通常のJavaScript変数とは異なり、Reactのstateはスナップショットのように動作します。stateを設定しても既存のstate変数は変更されず、代わりに再レンダリングがトリガーされます。これは最初は驚くかもしれません！

```js
console.log(count);  // 0
setCount(count + 1); // 1で再レンダリングをリクエスト
console.log(count);  // まだ0！
```

この動作は微妙なバグを回避するのに役立ちます。ここに小さなチャットアプリがあります。「送信」を押してから受信者をボブに変更した場合、5秒後に`alert`に表示される名前は誰でしょうか？

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


<LearnMore path="/learn/state-as-a-snapshot">

**[State as a Snapshot](/learn/state-as-a-snapshot)**を読んで、stateがイベントハンドラー内で「固定」されて変化しないように見える理由を学びましょう。

</LearnMore>

## Queueing a series of state updates {/*queueing-a-series-of-state-updates*/}

このコンポーネントにはバグがあります：「+3」をクリックしてもスコアが一度しか増えません。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[State as a Snapshot](/learn/state-as-a-snapshot)は、これがなぜ起こるのかを説明しています。stateを設定すると新しい再レンダリングがリクエストされますが、既に実行中のコードでは変更されません。そのため、`score`は`setScore(score + 1)`を呼び出した直後も`0`のままです。

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

stateを設定する際に*アップデータ関数*を渡すことでこれを修正できます。`setScore(score + 1)`を`setScore(s => s + 1)`に置き換えると、「+3」ボタンが修正されることに注目してください。これにより、複数のstate更新をキューに入れることができます。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

**[Queueing a Series of State Updates](/learn/queueing-a-series-of-state-updates)**を読んで、state更新のシーケンスをキューに入れる方法を学びましょう。

</LearnMore>

## Updating objects in state {/*updating-objects-in-state*/}

stateにはオブジェクトを含む任意のJavaScript値を保持できます。しかし、Reactのstateに保持しているオブジェクトや配列を直接変更してはいけません。代わりに、オブジェクトや配列を更新したい場合は、新しいものを作成するか、既存のものをコピーしてから、そのコピーを使用するようにstateを更新する必要があります。

通常、変更したいオブジェクトや配列をコピーするために`...`スプレッド構文を使用します。例えば、ネストされたオブジェクトを更新する場合は次のようになります：

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
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

コードでオブジェクトをコピーするのが面倒な場合は、[Immer](https://github.com/immerjs/use-immer)のようなライブラリを使用して繰り返しのコードを減らすことができます：

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

<LearnMore path="/learn/updating-objects-in-state">

**[Updating Objects in State](/learn/updating-objects-in-state)**を読んで、オブジェクトを正しく更新する方法を学びましょう。

</LearnMore>

## Updating arrays in state {/*updating-arrays-in-state*/}

配列は、stateに格納できるもう一つの可変JavaScriptオブジェクトのタイプであり、読み取り専用として扱うべきです。オブジェクトと同様に、stateに格納された配列を更新したい場合は、新しいものを作成するか、既存のものをコピーしてから、新しい配列を使用するようにstateを設定する必要があります：

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

コードで配列をコピーするのが面倒な場合は、[Immer](https://github.com/immerjs/use-immer)のようなライブラリを使用して繰り返しのコードを減らすことができます：

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
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

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

**[Updating Arrays in State](/learn/updating-arrays-in-state)**を読んで、配列を正しく更新する方法を学びましょう。

</LearnMore>

## What's next? {/*whats-next*/}

[Responding to Events](/learn/responding-to-events)に進んで、この章をページごとに読み始めましょう！

または、これらのトピックにすでに精通している場合は、[Managing State](/learn/managing-state)について読んでみてください。