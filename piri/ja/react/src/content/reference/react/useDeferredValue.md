---
title: useDeferredValue
---

<Intro>

`useDeferredValue`は、UIの一部の更新を遅延させることができるReact Hookです。

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useDeferredValue(value, initialValue?)` {/*usedeferredvalue*/}

`useDeferredValue`をコンポーネントのトップレベルで呼び出して、その値の遅延バージョンを取得します。

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `value`: 遅延させたい値。任意の型を持つことができます。
* <CanaryBadge title="この機能はCanaryチャンネルでのみ利用可能です" /> **オプション** `initialValue`: コンポーネントの初期レンダリング時に使用する値。このオプションを省略した場合、`useDeferredValue`は初期レンダリング時に遅延しません。なぜなら、代わりにレンダリングできる以前の`value`のバージョンがないからです。

#### 戻り値 {/*returns*/}

- `currentValue`: 初期レンダリング時には、返される遅延値は提供された値と同じです。更新時には、Reactはまず古い値で再レンダリングを試み（したがって古い値を返します）、その後新しい値でバックグラウンドで再レンダリングを試みます（したがって更新された値を返します）。

<Canary>

最新のReact Canaryバージョンでは、`useDeferredValue`は初期レンダリング時に`initialValue`を返し、バックグラウンドで`value`を返す再レンダリングをスケジュールします。

</Canary>

#### 注意点 {/*caveats*/}

- 更新がトランジション内にある場合、`useDeferredValue`は常に新しい`value`を返し、遅延レンダリングを生成しません。なぜなら、更新はすでに遅延されているからです。

- `useDeferredValue`に渡す値は、プリミティブ値（文字列や数値など）か、レンダリングの外部で作成されたオブジェクトであるべきです。レンダリング中に新しいオブジェクトを作成し、それをすぐに`useDeferredValue`に渡すと、毎回異なる値となり、不要なバックグラウンド再レンダリングを引き起こします。

- `useDeferredValue`が異なる値を受け取ると（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)と比較して）、現在のレンダリングに加えて（以前の値を使用する場合）、新しい値でバックグラウンドで再レンダリングをスケジュールします。バックグラウンド再レンダリングは中断可能です。`value`に別の更新があると、Reactはバックグラウンド再レンダリングを最初からやり直します。例えば、ユーザーが入力をチャートが遅延値を受け取って再レンダリングするよりも速く入力している場合、チャートはユーザーが入力を停止した後にのみ再レンダリングされます。

- `useDeferredValue`は[`<Suspense>`](/reference/react/Suspense)と統合されています。新しい値によって引き起こされたバックグラウンド更新がUIをサスペンドすると、ユーザーはフォールバックを見ません。データがロードされるまで、古い遅延値が表示されます。

- `useDeferredValue`自体は追加のネットワークリクエストを防ぎません。

- `useDeferredValue`自体による固定遅延はありません。Reactが元の再レンダリングを終了するとすぐに、Reactは新しい遅延値でバックグラウンド再レンダリングを直ちに開始します。イベント（入力など）によって引き起こされた更新はバックグラウンド再レンダリングを中断し、それに優先されます。

- `useDeferredValue`によって引き起こされたバックグラウンド再レンダリングは、画面にコミットされるまでエフェクトを発火しません。バックグラウンド再レンダリングがサスペンドされると、そのエフェクトはデータがロードされ、UIが更新された後に実行されます。

---

## 使用法 {/*usage*/}

### 新しいコンテンツが読み込まれる間に古いコンテンツを表示する {/*showing-stale-content-while-fresh-content-is-loading*/}

`useDeferredValue`をコンポーネントのトップレベルで呼び出して、UIの一部の更新を遅延させます。

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

初期レンダリング時には、<CodeStep step={2}>遅延値</CodeStep>は提供された<CodeStep step={1}>値</CodeStep>と同じです。

更新時には、<CodeStep step={2}>遅延値</CodeStep>は最新の<CodeStep step={1}>値</CodeStep>に「遅れ」を取ります。特に、Reactはまず遅延値を更新せずに再レンダリングし、その後バックグラウンドで新しく受け取った値で再レンダリングを試みます。

**この機能が役立つ場面を例を通して見てみましょう。**

<Note>

この例では、Suspense対応のデータソースを使用していることを前提としています：

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/)や[Next.js](https://nextjs.org/docs/getting-started/react-essentials)のようなSuspense対応フレームワークを使用したデータフェッチ
- [`lazy`](/reference/react/lazy)を使用したコンポーネントコードの遅延読み込み
- [`use`](/reference/react/use)を使用したPromiseの値の読み取り

[Suspenseとその制限について詳しく学ぶ。](/reference/react/Suspense)

</Note>

この例では、`SearchResults`コンポーネントが検索結果をフェッチしている間に[サスペンド](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)します。`"a"`と入力し、結果を待ち、それから`"ab"`に編集してみてください。`"a"`の結果が読み込みフォールバックに置き換えられます。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !==-1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

一般的な代替UIパターンは、結果リストの更新を遅延させ、新しい結果が準備できるまで以前の結果を表示し続けることです。`useDeferredValue`を呼び出して、遅延バージョンのクエリを渡します：

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query`はすぐに更新されるため、入力は新しい値を表示します。しかし、`deferredQuery`はデータが読み込まれるまで以前の値を保持するため、`SearchResults`はしばらくの間古い結果を表示します。

以下の例で`"a"`を入力し、結果が読み込まれるのを待ち、それから入力を`"ab"`に編集します。Suspenseフォールバックの代わりに、新しい結果が読み込まれるまで古い結果リストが表示されることに注目してください：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim
().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### 値の遅延はどのように機能するのか？ {/*how-does-deferring-a-value-work-under-the-hood*/}

これは2つのステップで行われると考えることができます：

1. **まず、Reactは新しい`query`（`"ab"`）で再レンダリングしますが、古い`deferredQuery`（まだ`"a"`）を使用します。** `deferredQuery`の値は*遅延*されており、`query`の値に「遅れ」を取ります。

2. **バックグラウンドで、Reactは`query`と`deferredQuery`の両方を`"ab"`に更新して再レンダリングを試みます。** この再レンダリングが完了すると、Reactはそれを画面に表示します。しかし、それがサスペンドされると（`"ab"`の結果がまだ読み込まれていない場合）、Reactはこのレンダリング試行を放棄し、データが読み込まれた後に再度この再レンダリングを試みます。ユーザーはデータが準備できるまで古い遅延値を見続けます。

遅延された「バックグラウンド」レンダリングは中断可能です。例えば、入力に再度入力すると、Reactはそれを放棄し、新しい値で再レンダリングを開始します。Reactは常に最新の提供された値を使用します。

ここで遅延されているのは結果の表示（準備ができるまで）であり、ネットワークリクエスト自体ではありません。ユーザーが入力を続けても、各キー入力の応答はキャッシュされるため、Backspaceを押すと即座に反映され、再度フェッチされることはありません。

</DeepDive>

---

### コンテンツが古いことを示す {/*indicating-that-the-content-is-stale*/}

上記の例では、最新のクエリの結果リストがまだ読み込まれていることを示すものがありません。新しい結果が読み込まれるのに時間がかかる場合、これはユーザーにとって混乱を招く可能性があります。最新のクエリに一致しない結果リストが表示されていることをユーザーにより明確にするために、古い結果リストが表示されているときに視覚的な表示を追加できます：

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

この変更により、入力を開始するとすぐに、古い結果リストが新しい結果リストが読み込まれるまで少し薄暗くなります。以下の例のように、CSSトランジションを追加して薄暗くなるのを遅らせることもできます：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js src/SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !==-1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### UIの一部の再レンダリングを遅延させる {/*deferring-re-rendering-for-a-part-of-the-ui*/}

`useDeferredValue`はパフォーマンスの最適化としても使用できます。これは、UIの一部が再レンダリングに時間がかかり、それを最適化する簡単な方法がなく、UIの他の部分をブロックしないようにしたい場合に役立ちます。

テキストフィールドと、各キー入力で再レンダリングされるコンポーネント（チャートや長いリストなど）があると想像してください：

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

まず、`SlowList`を最適化して、プロップが同じ場合に再レンダリングをスキップするようにします。これを行うには、[`memo`でラップします：](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

ただし、これは`SlowList`のプロップが*同じ*場合にのみ役立ちます。現在直面している問題は、それらが*異なる*場合に遅くなり、実際に異なる視覚的出力を表示する必要がある場合です。

具体的には、主なパフォーマンスの問題は、入力に入力するたびに`SlowList`が新しいプロップを受け取り、その全体のツリーを再レンダリングすることが入力をぎこちなく感じさせることです。この場合、`useDeferredValue`を使用すると、入力の更新（高速である必要がある）を結果リストの更新（遅くてもよい）よりも優先させることができます：

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

これにより、`SlowList`の再レンダリングが速くなるわけではありません。しかし、リストの再レンダリングを優先度を下げるようにReactに指示し、キー入力をブロックしないようにします。リストは入力に「遅れ」を取り、その後「追いつき」ます。以前と同様に、Reactはリストをできるだけ早く更新しようとしますが、ユーザーが入力するのを妨げません。

<Recipes titleText="useDeferredValueと最適化されていない再レンダリングの違い" titleId="examples">

#### リストの遅延再レンダリング {/*deferred-re-rendering-of-the-list*/}

この例では、`SlowList`コンポーネントの各アイテムが**人工的に遅く**されているため、`useDeferredValue`が入力をどのように応答性を保つかを見ることができます。入力に入力してみてください。入力がスナップし、リストが「遅れ」を取ることに注目してください。

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### リストの最適化されていない再レンダリング {/*unoptimized-re-rendering-of-the-list*/}

この例では、`SlowList`コンポーネントの各アイテムが**人工的に遅く**されていますが、`useDeferredValue`はありません。

入力に入力すると非常にぎこちなく感じることに注目してください。これは、`useDeferredValue`がないと、各キー入力がリスト全体を即座に再レンダリングするため、中断できない方法で行われるためです。

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js src/SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

この最適化には、`SlowList`を[`memo`](/reference/react/memo)でラップする必要があります。これは、`text`が変更されるたびに、Reactが親コンポーネントを迅速に再レンダリングできるようにするためです。その再レンダリング中に、`deferredText`はまだ以前の値を持っているため、`SlowList`は再レンダリングをスキップできます（そのプロップは変更されていません）。[`memo`](/reference/react/memo)がないと、再レンダリングする必要があり、最適化の意味がなくなります。

</Pitfall>

<DeepDive>

#### 値の遅延はデバウンスやスロットリングとどう違うのか？ {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

このシナリオで以前に使用したことがあるかもしれない2つの一般的な最適化技術があります：

- *デバウンス*は、ユーザーが入力を停止するのを待って（例えば1秒間）、リストを更新することを意味します。
- *スロットリング*は、リストを一定の間隔で更新することを意味します（例えば、1秒に1回まで）。

これらの技術は一部のケースで役立ちますが、`useDeferredValue`はReact自体と深く統合されており、ユーザーのデバイスに適応するため、レンダリングの最適化により適しています。

デバウンスやスロットリングとは異なり、固定遅延を選択する必要はありません。ユーザーのデバイスが高速（例えば強力なラップトップ）であれば、遅延された再レンダリングはほぼ即座に行われ、目立たないでしょう。ユーザーのデバイスが遅い場合、リストは入力に比例して「遅れ」を取り、その後「追いつき」ます。

また、デバウンスやスロットリングとは異なり、`useDeferredValue`による遅延再レンダリングはデフォルトで中断可能です。これは、Reactが大きなリストを再レンダリングしている最中にユーザーが別のキー入力を行った場合、Reactはその再レンダリングを中断し、キー入力を処理し、その後再びバックグラウンドでレンダリングを開始することを意味します。対照的に、デバウンスやスロットリングは*ブロッキング*であり、レンダリングがキー入力をブロックする瞬間を単に延期するだけなので、依然としてぎこちない体験を生み出します。

最適化しようとしている作業がレンダリング中に発生しない場合、デバウンスやスロットリングは依然として有用です。例えば、これらの技術を使用してネットワークリクエストの数を減らすことができます。これらの技術を組み合わせて使用することも可能です。

</DeepDive>