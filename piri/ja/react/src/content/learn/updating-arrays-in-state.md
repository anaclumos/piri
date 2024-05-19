---
title: 状態の配列を更新する方法
---

<Intro>

JavaScriptの配列はミュータブルですが、状態に保存する際にはイミュータブルとして扱うべきです。オブジェクトと同様に、状態に保存された配列を更新したい場合は、新しい配列を作成する（または既存の配列をコピーする）必要があり、その後、新しい配列を使用するように状態を設定します。

</Intro>

<YouWillLearn>

- Reactの状態で配列の項目を追加、削除、または変更する方法
- 配列内のオブジェクトを更新する方法
- Immerを使用して配列のコピーをより簡潔にする方法

</YouWillLearn>

## ミューテーションなしで配列を更新する {/*updating-arrays-without-mutation*/}

JavaScriptでは、配列は単なるオブジェクトの一種です。[オブジェクトと同様に](/learn/updating-objects-in-state)、**Reactの状態にある配列は読み取り専用として扱うべきです。** これは、`arr[0] = 'bird'`のように配列内の項目を再割り当てしたり、`push()`や`pop()`のような配列をミューテートするメソッドを使用したりしないことを意味します。

代わりに、配列を更新するたびに、新しい配列を状態設定関数に渡す必要があります。そのためには、状態内の元の配列から非ミューテートメソッド（`filter()`や`map()`など）を呼び出して新しい配列を作成できます。その後、結果として得られる新しい配列に状態を設定します。

以下は一般的な配列操作のリファレンステーブルです。Reactの状態内で配列を扱う場合、左側の列のメソッドを避け、右側の列のメソッドを使用することをお勧めします：

|           | 避けるべき（配列をミューテートする） | 推奨（新しい配列を返す）                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| 追加      | `push`, `unshift`                   | `concat`, `[...arr]` スプレッド構文 ([例](#adding-to-an-array)) |
| 削除      | `pop`, `shift`, `splice`            | `filter`, `slice` ([例](#removing-from-an-array))              |
| 置換      | `splice`, `arr[i] = ...` 代入       | `map` ([例](#replacing-items-in-an-array))                     |
| ソート    | `reverse`, `sort`                   | まず配列をコピーする ([例](#making-other-changes-to-an-array)) |

または、[Immerを使用](#write-concise-update-logic-with-immer)して、両方の列のメソッドを使用することもできます。

<Pitfall>

残念ながら、[`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)と[`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)は名前が似ていますが、非常に異なります：

* `slice`は配列全体またはその一部をコピーできます。
* `splice`は配列を**ミューテート**します（項目を挿入または削除するため）。

Reactでは、`slice`（`p`なし！）を使用することがはるかに多くなります。なぜなら、状態内のオブジェクトや配列をミューテートしたくないからです。[オブジェクトの更新](/learn/updating-objects-in-state)は、ミューテーションが何であり、なぜ状態に対して推奨されないのかを説明しています。

</Pitfall>

### 配列に追加する {/*adding-to-an-array*/}

`push()`は配列をミューテートするため、使用しないでください：

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

代わりに、既存の項目*と*新しい項目を末尾に含む*新しい*配列を作成します。これを行う方法はいくつかありますが、最も簡単なのは`...` [配列スプレッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals)構文を使用することです：

```js
setArtists( // 状態を置き換える
  [ // 新しい配列で
    ...artists, // すべての古い項目を含む
    { id: nextId++, name: name } // 末尾に新しい項目を1つ追加
  ]
);
```

これで正しく動作します：

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

配列スプレッド構文を使用すると、元の`...artists`の*前に*項目を配置することで、項目を先頭に追加することもできます：

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // 古い項目を末尾に配置
]);
```

このようにして、スプレッドは配列の末尾に追加する`push()`と、配列の先頭に追加する`unshift()`の両方の役割を果たすことができます。上記のサンドボックスで試してみてください！

### 配列から削除する {/*removing-from-an-array*/}

配列から項目を削除する最も簡単な方法は、それを*フィルタリングする*ことです。つまり、その項目を含まない新しい配列を生成します。これを行うには、例えば`filter`メソッドを使用します：

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

「Delete」ボタンを数回クリックし、そのクリックハンドラーを見てください。

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

ここで、`artists.filter(a => a.id !== artist.id)`は「`artist.id`と異なるIDを持つ`artists`で構成される配列を作成する」ことを意味します。つまり、各アーティストの「Delete」ボタンはそのアーティストを配列からフィルタリングし、その結果の配列で再レンダリングを要求します。`filter`は元の配列を変更しないことに注意してください。

### 配列を変換する {/*transforming-an-array*/}

配列の一部またはすべての項目を変更したい場合は、`map()`を使用して**新しい**配列を作成できます。`map`に渡す関数は、そのデータやインデックス（またはその両方）に基づいて各項目に対して何をするかを決定できます。

この例では、配列には2つの円と1つの四角形の座標が含まれています。ボタンを押すと、円だけが50ピクセル下に移動します。これは、`map()`を使用して新しいデータ配列を生成することで実現します：

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // 変更なし
        return shape;
      } else {
        // 50px下に新しい円を返す
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // 新しい配列で再レンダリング
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### 配列内の項目を置き換える {/*replacing-items-in-an-array*/}

配列内の1つまたは複数の項目を置き換えたい場合は特に一般的です。`arr[0] = 'bird'`のような代入は元の配列をミューテートするため、これにも`map`を使用します。

項目を置き換えるには、`map`を使用して新しい配列を作成します。`map`呼び出し内で、項目のインデックスを第2引数として受け取ります。これを使用して、元の項目（第1引数）を返すか、別のものを返すかを決定します：

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // クリックされたカウンターをインクリメント
        return c + 1;
      } else {
        // 残りは変更なし
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### 配列に挿入する {/*inserting-into-an-array*/}

時々、先頭でも末尾でもない特定の位置に項目を挿入したい場合があります。これを行うには、`...`配列スプレッド構文と`slice()`メソッドを組み合わせて使用します。`slice()`メソッドは配列の「スライス」を切り取ることができます。項目を挿入するには、挿入ポイント*前の*スライス、次に新しい項目、そして元の配列の残りを広げる配列を作成します。

この例では、Insertボタンは常にインデックス`1`に挿入します：

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // 任意のインデックスに挿入可能
    const nextArtists = [
      // 挿入ポイント前の項目：
      ...artists.slice(0, insertAt),
      // 新しい項目：
      { id: nextId++, name: name },
      // 挿入ポイント後の項目：
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### 配列に他の変更を加える {/*making-other-changes-to-an-array*/}

スプレッド構文や`map()`や`filter()`のような非ミューテートメソッドだけではできないこともあります。例えば、配列を逆にしたり、ソートしたりすることがあるかもしれません。JavaScriptの`reverse()`や`sort()`メソッドは元の配列をミューテートするため、直接使用することはできません。

**しかし、最初に配列をコピーしてから変更を加えることができます。**

例えば：

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

ここでは、最初に元の配列のコピーを作成するために`[...list]`スプレッド構文を使用しています。コピーを作成したので、`nextList.reverse()`や`nextList.sort()`のようなミューテートメソッドを使用したり、`nextList[0] = "something"`のように個々の項目を割り当てたりすることができます。

しかし、**配列をコピーしても、直接その中の既存の項目をミューテートすることはできません。** これはコピーが浅いからです。新しい配列には元の配列と同じ項目が含まれます。そのため、コピーされた配列内のオブジェクトを変更すると、既存の状態をミューテートすることになります。例えば、次のようなコードは問題です。

```js
const nextList = [...list];
nextList[0].seen = true; // 問題：list[0]をミューテート
setList(nextList);
```

`nextList`と`list`は異なる配列ですが、**`nextList[0]`と`list[0]`は同じオブジェクトを指しています。** したがって、`nextList[0].seen`を変更すると、`list[0].seen`も変更されます。これは状態のミューテーションであり、避けるべきです！この問題は、[ネストされたJavaScriptオブジェクトを更新する](/learn/updating-objects-in-state#updating-a-nested-object)のと同
じ方法で、変更したい個々の項目をコピーすることで解決できます。以下にその方法を示します。

## 配列内のオブジェクトを更新する {/*updating-objects-inside-arrays*/}

オブジェクトは配列の「内部」に実際に存在するわけではありません。コード上では「内部」に見えるかもしれませんが、配列内の各オブジェクトは別々の値であり、配列はそれを「指し示している」だけです。これが、`list[0]`のようなネストされたフィールドを変更する際に注意が必要な理由です。別の人のアートワークリストが同じ配列要素を指しているかもしれません！

**ネストされた状態を更新する際には、更新したいポイントからトップレベルまでコピーを作成する必要があります。** これがどのように機能するかを見てみましょう。

この例では、2つの別々のアートワークリストが同じ初期状態を持っています。これらは独立しているはずですが、ミューテーションのために状態が誤って共有されており、1つのリストでチェックボックスをオンにすると、もう1つのリストにも影響を与えます：

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

問題は次のようなコードにあります：

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // 問題：既存の項目をミューテート
setMyList(myNextList);
```

`myNextList`配列自体は新しいものですが、*項目自体*は元の`myList`配列と同じです。したがって、`artwork.seen`を変更すると、*元の*アートワーク項目が変更されます。そのアートワーク項目は`yourList`にも含まれているため、バグが発生します。このようなバグは考えるのが難しいかもしれませんが、状態のミューテーションを避ければ消えます。

**`map`を使用して、ミューテーションなしで古い項目を更新されたバージョンに置き換えることができます。**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // 変更を加えた*新しい*オブジェクトを作成
    return { ...artwork, seen: nextSeen };
  } else {
    // 変更なし
    return artwork;
  }
}));
```

ここで、`...`はオブジェクトスプレッド構文を使用して[オブジェクトのコピーを作成します。](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

このアプローチでは、既存の状態項目は一切ミューテートされず、バグが修正されます：

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // 変更を加えた*新しい*オブジェクトを作成
        return { ...artwork, seen: nextSeen };
      } else {
        // 変更なし
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // 変更を加えた*新しい*オブジェクトを作成
        return { ...artwork, seen: nextSeen };
      } else {
        // 変更なし
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

一般的に、**作成したばかりのオブジェクトのみをミューテートするべきです。** 新しいアートワークを挿入する場合はミューテートできますが、状態に既に存在するものを扱う場合はコピーを作成する必要があります。

### Immerを使用して簡潔な更新ロジックを書く {/*write-concise-update-logic-with-immer*/}

ミューテーションなしでネストされた配列を更新するのは少し繰り返しが多くなります。[オブジェクトと同様に](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- 一般的に、状態を2レベル以上深く更新する必要はありません。状態オブジェクトが非常に深い場合は、それらをフラットにするように[再構築することを検討してください](/learn/choosing-the-state-structure#avoid-deeply-nested-state)。
- 状態構造を変更したくない場合は、[Immer](https://github.com/immerjs/use-immer)を使用することをお勧めします。これにより、便利なミューテーション構文を使用しながら、コピーを作成する作業を自動的に行ってくれます。

以下は、Immerを使用して書き直したArt Bucket Listの例です：

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
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
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Immerを使用すると、**`artwork.seen = nextSeen`のようなミューテーションが許容されます：**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

これは、元の状態をミューテートしているのではなく、Immerが提供する特別な`draft`オブジェクトをミューテートしているためです。同様に、`draft`の内容に対して`push()`や`pop()`のようなミューテーションメソッドを適用することもできます。

裏では、Immerは常に`draft`に対して行った変更に基づいて次の状態をゼロから構築します。これにより、イベントハンドラーが非常に簡潔になり、状態をミューテートすることはありません。

<Recap>

- 配列を状態に入れることはできますが、変更することはできません。
- 配列をミューテートする代わりに、その新しいバージョンを作成し、それに状態を設定します。
- `[...arr, newItem]`配列スプレッド構文を使用して、新しい項目を含む配列を作成できます。
- `filter()`や`map()`を使用して、フィルタリングまたは変換された項目を含む新しい配列を作成できます。
- Immerを使用してコードを簡潔に保つことができます。

</Recap>

<Challenges>

#### ショッピングカート内の項目を更新する {/*update-an-item-in-the-shopping-cart*/}

`handleIncreaseClick`ロジックを埋めて、"+"を押すと対応する数が増えるようにしてください：

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

`map`関数を使用して新しい配列を作成し、`...`オブジェクトスプレッド構文を使用して新しい配列の変更されたオブジェクトのコピーを作成できます：

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### ショッピングカートから項目を削除する {/*remove-an-item-from-the-shopping-cart*/}

このショッピングカートには動作する「+」ボタンがありますが、「–」ボタンは何もしません。対応する商品の`count`を減らすイベントハンドラーを追加する必要があります。`count`が1のときに「–」を押すと、その商品は自動的にカートから削除されるべきです。0が表示されないようにしてください。

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

まず`map`を使用して新しい配列を生成し、その後`filter`を使用して`count`が`0`に設定された商品を削除できます：

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
         
count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### ミューテーションを非ミューテーションメソッドで修正する {/*fix-the-mutations-using-non-mutative-methods*/}

この例では、`App.js`内のすべてのイベントハンドラーがミューテーションを使用しています。その結果、ToDoの編集や削除が機能しません。`handleAddTodo`、`handleChangeTodo`、および`handleDeleteTodo`を非ミューテーションメソッドを使用して書き直してください：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

`handleAddTodo`では配列スプレッド構文を使用できます。`handleChangeTodo`では`map`を使用して新しい配列を作成できます。`handleDeleteTodo`では`filter`を使用して新しい配列を作成できます。これでリストが正しく動作します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>

#### Immerを使用してミューテーションを修正する {/*fix-the-mutations-using-immer*/}

これは前のチャレンジと同じ例です。今回は、Immerを使用してミューテーションを修正してください。便利のために、`useImmer`はすでにインポートされているので、`todos`状態変数を使用するように変更する必要があります。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immerを使用すると、`draft`に対してのみミューテーションを行う限り、ミューテーション方式でコードを書くことができます。ここでは、すべてのミューテーションが`draft`に対して行われているため、コードが機能します：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immerを使用すると、ミューテーション方式と非ミューテーション方式を組み合わせることもできます。

例えば、このバージョンでは`handleAddTodo`はImmerの`draft`をミューテートすることで実装されており、`handleChangeTodo`と`handleDeleteTodo`は非ミューテーションの`map`と`filter`メソッドを使用しています：

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immerを使用すると、各ケースに最も自然に感じるスタイルを選択できます。

</Solution>

</Challenges>