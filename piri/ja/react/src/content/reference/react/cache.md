---
title: cache
canary: true
---

<Canary>
* `cache`は[React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)でのみ使用してください。[React Server Componentsをサポートするフレームワーク](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)を参照してください。

* `cache`はReactの[Canary](/community/versioning-policy#canary-channel)および[experimental](/community/versioning-policy#experimental-channel)チャンネルでのみ利用可能です。`cache`を本番環境で使用する前に、その制限を理解していることを確認してください。[Reactのリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。
</Canary>

<Intro>

`cache`はデータフェッチや計算の結果をキャッシュすることができます。

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `cache(fn)` {/*cache*/}

`cache`をコンポーネントの外で呼び出して、キャッシュ機能を持つ関数のバージョンを作成します。

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

`getMetrics`が最初に`data`で呼び出されたとき、`getMetrics`は`calculateMetrics(data)`を呼び出し、その結果をキャッシュに保存します。`getMetrics`が同じ`data`で再度呼び出された場合、`calculateMetrics(data)`を再度呼び出す代わりにキャッシュされた結果を返します。

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

- `fn`: 結果をキャッシュしたい関数。`fn`は任意の引数を取り、任意の値を返すことができます。

#### 戻り値 {/*returns*/}

`cache`は、同じ型シグネチャを持つ`fn`のキャッシュバージョンを返します。このプロセスで`fn`を呼び出すことはありません。

指定された引数で`cachedFn`を呼び出すと、まずキャッシュにキャッシュされた結果が存在するかどうかを確認します。キャッシュされた結果が存在する場合、その結果を返します。存在しない場合、引数で`fn`を呼び出し、その結果をキャッシュに保存し、結果を返します。`fn`が呼び出されるのはキャッシュミスが発生したときだけです。

<Note>

入力に基づいて戻り値をキャッシュする最適化は[_メモ化_](https://en.wikipedia.org/wiki/Memoization)として知られています。`cache`から返される関数をメモ化関数と呼びます。

</Note>

#### 注意点 {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- Reactは各サーバーリクエストごとにすべてのメモ化関数のキャッシュを無効にします。
- `cache`の各呼び出しは新しい関数を作成します。これは、同じ関数で`cache`を複数回呼び出すと、同じキャッシュを共有しない異なるメモ化関数が返されることを意味します。
- `cachedFn`はエラーもキャッシュします。特定の引数で`fn`がエラーをスローすると、それがキャッシュされ、同じ引数で`cachedFn`が呼び出されたときに同じエラーが再スローされます。
- `cache`は[Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)でのみ使用してください。

---

## 使用法 {/*usage*/}

### 高価な計算をキャッシュする {/*cache-expensive-computation*/}

`cache`を使用して重複作業をスキップします。

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

同じ`user`オブジェクトが`Profile`と`TeamReport`の両方でレンダリングされる場合、2つのコンポーネントは作業を共有し、その`user`のために`calculateUserMetrics`を一度だけ呼び出すことができます。

まず`Profile`がレンダリングされると、<CodeStep step={1}>`getUserMetrics`</CodeStep>を呼び出し、キャッシュされた結果があるかどうかを確認します。`getUserMetrics`がその`user`で初めて呼び出されるため、キャッシュミスが発生します。`getUserMetrics`はその後、`user`で`calculateUserMetrics`を呼び出し、その結果をキャッシュに書き込みます。

`TeamReport`が`users`のリストをレンダリングし、同じ`user`オブジェクトに到達すると、<CodeStep step={2}>`getUserMetrics`</CodeStep>を呼び出し、キャッシュから結果を読み取ります。

<Pitfall>

##### 異なるメモ化関数を呼び出すと、異なるキャッシュから読み取ります。 {/*pitfall-different-memoized-functions*/}

同じキャッシュにアクセスするには、コンポーネントは同じメモ化関数を呼び出す必要があります。

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 間違い: コンポーネント内で`cache`を呼び出すと、各レンダリングで新しい`getWeekReport`が作成されます
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 間違い: `getWeekReport`は`Precipitation`コンポーネントでのみアクセス可能です。
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

上記の例では、<CodeStep step={2}>`Precipitation`</CodeStep>と<CodeStep step={1}>`Temperature`</CodeStep>はそれぞれ`cache`を呼び出して、独自のキャッシュルックアップを持つ新しいメモ化関数を作成します。両方のコンポーネントが同じ`cityData`でレンダリングされる場合、`calculateWeekReport`を呼び出すために重複作業を行います。

さらに、`Temperature`は各レンダリングごとに<CodeStep step={1}>新しいメモ化関数</CodeStep>を作成するため、キャッシュの共有ができません。

キャッシュヒットを最大化し作業を減らすために、2つのコンポーネントは同じメモ化関数を呼び出して同じキャッシュにアクセスする必要があります。代わりに、メモ化関数を専用のモジュールに定義し、コンポーネント間で[`import`-ed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)できるようにします。

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
ここでは、両方のコンポーネントが`./getWeekReport.js`からエクスポートされた<CodeStep step={3}>同じメモ化関数</CodeStep>を呼び出して、同じキャッシュを読み書きします。
</Pitfall>

### データのスナップショットを共有する {/*take-and-share-snapshot-of-data*/}

コンポーネント間でデータのスナップショットを共有するには、`fetch`のようなデータフェッチ関数で`cache`を呼び出します。複数のコンポーネントが同じデータフェッチを行う場合、1つのリクエストのみが行われ、返されたデータがキャッシュされ、コンポーネント間で共有されます。すべてのコンポーネントはサーバーレンダリング全体で同じデータのスナップショットを参照します。

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

`AnimatedWeatherCard`と`MinimalWeatherCard`が同じ<CodeStep step={1}>city</CodeStep>でレンダリングされる場合、<CodeStep step={2}>メモ化関数</CodeStep>から同じデータのスナップショットを受け取ります。

`AnimatedWeatherCard`と`MinimalWeatherCard`が異なる<CodeStep step={1}>city</CodeStep>引数を<CodeStep step={2}>`getTemperature`</CodeStep>に渡す場合、`fetchTemperature`は2回呼び出され、それぞれの呼び出しサイトは異なるデータを受け取ります。

<CodeStep step={1}>city</CodeStep>はキャッシュキーとして機能します。

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>非同期レンダリング</CodeStep>はServer Componentsでのみサポートされています。

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'

</Note>

### データをプリロードする {/*preload-data*/}

長時間実行されるデータフェッチをキャッシュすることで、コンポーネントをレンダリングする前に非同期作業を開始できます。

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
}

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ 良い: ユーザーデータのフェッチを開始します
  getUser(id);
  // ... 一部の計算作業
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

`Page`をレンダリングすると、コンポーネントは<CodeStep step={1}>`getUser`</CodeStep>を呼び出しますが、返されたデータは使用しません。この早期の<CodeStep step={1}>`getUser`</CodeStep>呼び出しは、`Page`が他の計算作業や子のレンダリングを行っている間に非同期データベースクエリを開始します。

`Profile`をレンダリングすると、再度<CodeStep step={2}>`getUser`</CodeStep>を呼び出します。最初の<CodeStep step={1}>`getUser`</CodeStep>呼び出しがすでに完了し、ユーザーデータがキャッシュされている場合、`Profile`が<CodeStep step={2}>このデータを要求して待機する</CodeStep>とき、キャッシュから読み取るだけで、別のリモートプロシージャコールを必要としません。最初の<CodeStep step={1}>データリクエスト</CodeStep>が完了していない場合、このパターンでデータをプリロードすることでデータフェッチの遅延を減らします。

<DeepDive>

#### 非同期作業のキャッシュ {/*caching-asynchronous-work*/}

[非同期関数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)を評価すると、その作業の[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を受け取ります。Promiseはその作業の状態（_pending_、_fulfilled_、_failed_）と最終的な結果を保持します。

この例では、非同期関数<CodeStep step={1}>`fetchData`</CodeStep>は`fetch`を待機しているPromiseを返します。

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... 一部の計算作業  
  await getData();
  // ...
}
```

最初に<CodeStep step={2}>`getData`</CodeStep>を呼び出すと、<CodeStep step={1}>`fetchData`</CodeStep>から返されたPromiseがキャッシュされます。以降のルックアップは同じPromiseを返します。

最初の<CodeStep step={2}>`getData`</CodeStep>呼び出しは`await`しませんが、<CodeStep step={3}>2回目の呼び出し</CodeStep>は`await`します。[`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)はPromiseの最終的な結果を待機して返すJavaScriptの演算子です。最初の<CodeStep step={2}>`getData`</CodeStep>呼び出しは単に`fetch`を開始して、2回目の<CodeStep step={3}>`getData`</CodeStep>がルックアップするためのPromiseをキャッシュします。

2回目の呼び出し時にPromiseがまだ_pending_の場合、`await`は結果を待機します。この最適化により、`fetch`を待つ間にReactは計算作業を続行でき、2回目の呼び出しの待機時間を短縮します。

Promiseがすでに解決されている場合、エラーまたは_fulfilled_の結果に関係なく、`await`はその値を即座に返します。どちらの結果でも、パフォーマンスの向上があります。
</DeepDive>

<Pitfall>

##### コンポーネントの外でメモ化関数を呼び出すとキャッシュが使用されません。 {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 間違い: コンポーネントの外でメモ化関数を呼び出すとメモ化されません。
getUser('demo-id');

async function DemoProfile() {
  // ✅ 良い: `getUser`はメモ化されます。
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

Reactはコンポーネント内でのみメモ化関数にキャッシュアクセスを提供します。<CodeStep step={1}>`getUser`</CodeStep>`をコンポーネントの外で呼び出すと、関数は評価されますが、キャッシュを読み取ったり更新したりしません。

これは、キャッシュアクセスが[コンテキスト](/learn/passing-data-deeply-with-context)を通じて提供され、コンポーネントからのみアクセス可能であるためです。

</Pitfall>

<DeepDive>

#### `cache`、[`memo`](/reference/react/memo)、または[`useMemo`](/reference/react/useMemo)をいつ使用すべきか？ {/*cache-memo-usememo*/}

すべてのAPIはメモ化を提供しますが、メモ化する対象、キャッシュにアクセスできる者、キャッシュが無効化されるタイミングが異なります。

#### `useMemo` {/*deep-dive-use-memo*/}

一般的に、クライアントコンポーネント内でのレンダリング間で高価な計算をキャッシュするために[`useMemo`](/reference/react/useMemo)を使用するべきです。例えば、コンポーネント内でデータの変換をメモ化する場合です。

```jsx {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record)), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
この例では、`App`は同じレコードで2つの`WeatherReport`をレンダリングします。両方のコンポーネントが同じ作業を行っているにもかかわらず、作業を共有することはできません。`useMemo`のキャッシュはコンポーネント内でのみローカルです。

しかし、`useMemo`は`App`が再レンダリングされ、`record`オブジェクトが変更されない場合、各コンポーネントインスタンスが作業をスキップし、`avgTemp`のメモ化された値を使用することを保証します。`useMemo`は、指定された依存関係で最後の計算のみをキャッシュします。

#### `cache` {/*deep-dive-cache*/}

一般的に、サーバーコンポーネント内で共有できる作業をメモ化するために`cache`を使用するべきです。

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
前の例を`cache`を使用するように書き直すと、この場合、<CodeStep step={3}>2つ目の`WeatherReport`インスタンス</CodeStep>は重複作業をスキップし、<CodeStep step={1}>最初の`WeatherReport`</CodeStep>と同じキャッシュを読み取ることができます。前の例とのもう一つの違いは、`cache`は<CodeStep step={2}>データフェッチのメモ化</CodeStep>にも推奨されるのに対し、`useMemo`は計算にのみ使用されるべきです。

現時点では、`cache`はサーバーコンポーネントでのみ使用され、キャッシュはサーバーリクエストごとに無効化されます。

#### `memo` {/*deep-dive-memo*/}

[`memo`](reference/react/memo)を使用して、プロップが変更されていない場合にコンポーネントの再レンダリングを防ぐべきです。

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record); 
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

この例では、両方の`MemoWeatherReport`コンポーネントは最初にレンダリングされるときに`calculateAvg`を呼び出します。しかし、`App`が再レンダリングされ、`record`に変更がない場合、プロップが変更されていないため、`MemoWeatherReport`は再レンダリングされません。

`useMemo`と比較すると、`memo`はプロップに基づいてコンポーネントのレンダリングをメモ化します。`useMemo`と同様に、メモ化されたコンポーネントは最後のプロップ値で最後のレンダリングのみをキャッシュします。プロップが変更されると、キャッシュが無効化され、コンポーネントが再レンダリングされます。

</DeepDive>

---

## トラブルシューティング {/*troubleshooting*/}

### メモ化関数が同じ引数で呼び出されても実行され続ける {/*memoized-function-still-runs*/}

前述の注意点を参照してください
* [異なるメモ化関数を呼び出すと、異なるキャッシュから読み取ります。](#pitfall-different-memoized-functions)
* [コンポーネントの外でメモ化関数を呼び出すとキャッシュが使用されません。](#pitfall-memoized-call-outside-component)

上記のいずれも該当しない場合、Reactがキャッシュに何かが存在するかどうかを確認する方法に問題がある可能性があります。

引数が[プリミティブ](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)（例：オブジェクト、関数、配列）でない場合、同じオブジェクト参照を渡していることを確認してください。

メモ化関数を呼び出すとき、Reactは入力引数を調べて結果がすでにキャッシュされているかどうかを確認します。Reactはキャッシュヒットがあるかどうかを判断するために引数の浅い等価性を使用します。

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 間違い: propsは各レンダリングで変更されるオブジェクトです。
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

この場合、2つの`MapMarker`は同じ作業を行い、`{x: 10, y: 10, z:10}`の値で`calculateNorm`を呼び出しているように見えます。オブジェクトは同じ値を含んでいますが、各コンポーネントが独自の`props`オブジェクトを作成するため、同じオブジェクト参照ではありません。

Reactは入力を検証するために[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)を呼び出します。

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ 良い: プリミティブをメモ化関数に渡します
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

これに対処する一つの方法は、ベクトルの次元を`calculateNorm`に渡すことです。これは次元自体がプリミティブであるためです。

別の解決策は、ベクトルオブジェクト自体をコンポーネントのプロップとして渡すことです。両方のコンポーネントインスタンスに同じオブジェクトを渡す必要があります。

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ 良い: 同じ`vector`オブジェクトを渡します
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```

