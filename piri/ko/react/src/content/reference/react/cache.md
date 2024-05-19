---
title: cache
canary: true
---

<Canary>
* `cache`는 [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)에서만 사용됩니다. React Server Components를 지원하는 [프레임워크](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)를 참조하세요.

* `cache`는 React의 [Canary](/community/versioning-policy#canary-channel) 및 [experimental](/community/versioning-policy#experimental-channel) 채널에서만 사용할 수 있습니다. `cache`를 프로덕션에서 사용하기 전에 제한 사항을 반드시 이해하십시오. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).
</Canary>

<Intro>

`cache`는 데이터 가져오기 또는 계산의 결과를 캐시할 수 있게 해줍니다.

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `cache(fn)` {/*cache*/}

캐싱된 함수 버전을 만들기 위해 컴포넌트 외부에서 `cache`를 호출합니다.

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

`getMetrics`가 처음으로 `data`와 함께 호출되면, `getMetrics`는 `calculateMetrics(data)`를 호출하고 결과를 캐시에 저장합니다. 동일한 `data`로 `getMetrics`가 다시 호출되면, `calculateMetrics(data)`를 다시 호출하는 대신 캐시된 결과를 반환합니다.

[아래에서 더 많은 예제를 보세요.](#usage)

#### 매개변수 {/*parameters*/}

- `fn`: 결과를 캐시하려는 함수입니다. `fn`은 어떤 인수도 받을 수 있으며 어떤 값도 반환할 수 있습니다.

#### 반환값 {/*returns*/}

`cache`는 동일한 타입 서명을 가진 `fn`의 캐시된 버전을 반환합니다. 이 과정에서 `fn`을 호출하지 않습니다.

주어진 인수로 `cachedFn`을 호출할 때, 먼저 캐시에 캐시된 결과가 있는지 확인합니다. 캐시된 결과가 있으면 그 결과를 반환합니다. 그렇지 않으면 인수로 `fn`을 호출하고 결과를 캐시에 저장한 후 결과를 반환합니다. 캐시 미스가 발생할 때만 `fn`이 호출됩니다.

<Note>

입력값을 기반으로 반환값을 캐싱하는 최적화는 [_메모이제이션_](https://en.wikipedia.org/wiki/Memoization)으로 알려져 있습니다. 우리는 `cache`에서 반환된 함수를 메모이제이션된 함수라고 부릅니다.

</Note>

#### 주의사항 {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React는 각 서버 요청마다 모든 메모이제이션된 함수의 캐시를 무효화합니다.
- `cache`를 호출할 때마다 새로운 함수가 생성됩니다. 이는 동일한 함수로 `cache`를 여러 번 호출하면 동일한 캐시를 공유하지 않는 다른 메모이제이션된 함수가 반환된다는 것을 의미합니다.
- `cachedFn`은 오류도 캐시합니다. 특정 인수에 대해 `fn`이 오류를 발생시키면, 그 오류가 캐시되고 동일한 인수로 `cachedFn`이 호출될 때 동일한 오류가 다시 발생합니다.
- `cache`는 [Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)에서만 사용됩니다.

---

## 사용법 {/*usage*/}

### 비용이 많이 드는 계산 캐시 {/*cache-expensive-computation*/}

중복 작업을 건너뛰기 위해 `cache`를 사용하세요.

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

`Profile`과 `TeamReport`에서 동일한 `user` 객체가 렌더링되면, 두 컴포넌트는 작업을 공유하고 해당 `user`에 대해 `calculateUserMetrics`를 한 번만 호출할 수 있습니다.

`Profile`이 먼저 렌더링된다고 가정해봅시다. <CodeStep step={1}>`getUserMetrics`</CodeStep>를 호출하고 캐시된 결과가 있는지 확인합니다. `getUserMetrics`가 해당 `user`로 처음 호출되었기 때문에 캐시 미스가 발생합니다. 그런 다음 `getUserMetrics`는 해당 `user`로 `calculateUserMetrics`를 호출하고 결과를 캐시에 씁니다.

`TeamReport`가 `users` 목록을 렌더링하고 동일한 `user` 객체에 도달하면, <CodeStep step={2}>`getUserMetrics`</CodeStep>를 호출하고 캐시에서 결과를 읽습니다.

<Pitfall>

##### 다른 메모이제이션된 함수를 호출하면 다른 캐시에서 읽습니다. {/*pitfall-different-memoized-functions*/}

동일한 캐시에 접근하려면 컴포넌트가 동일한 메모이제이션된 함수를 호출해야 합니다.

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 잘못된 예: 컴포넌트에서 `cache`를 호출하면 각 렌더링마다 새로운 `getWeekReport`가 생성됩니다.
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 잘못된 예: `getWeekReport`는 `Precipitation` 컴포넌트에서만 접근할 수 있습니다.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

위 예제에서 <CodeStep step={2}>`Precipitation`</CodeStep>과 <CodeStep step={1}>`Temperature`</CodeStep>는 각각 `cache`를 호출하여 자체 캐시 조회를 가진 새로운 메모이제이션된 함수를 생성합니다. 두 컴포넌트가 동일한 `cityData`에 대해 렌더링되면, `calculateWeekReport`를 호출하는 중복 작업을 수행하게 됩니다.

또한, `Temperature`는 컴포넌트가 렌더링될 때마다 <CodeStep step={1}>새로운 메모이제이션된 함수</CodeStep>를 생성하여 캐시 공유를 허용하지 않습니다.

캐시 히트를 최대화하고 작업을 줄이기 위해 두 컴포넌트는 동일한 메모이제이션된 함수를 호출하여 동일한 캐시에 접근해야 합니다. 대신, 메모이제이션된 함수를 여러 컴포넌트에서 [`import`-할 수 있는](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 전용 모듈에 정의합니다.

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
여기서 두 컴포넌트는 `./getWeekReport.js`에서 내보낸 <CodeStep step={3}>동일한 메모이제이션된 함수</CodeStep>를 호출하여 동일한 캐시를 읽고 씁니다.
</Pitfall>

### 데이터 스냅샷 공유 {/*take-and-share-snapshot-of-data*/}

컴포넌트 간에 데이터 스냅샷을 공유하려면 `fetch`와 같은 데이터 가져오기 함수로 `cache`를 호출하세요. 여러 컴포넌트가 동일한 데이터를 가져오면, 하나의 요청만 수행되고 반환된 데이터는 캐시되어 컴포넌트 간에 공유됩니다. 모든 컴포넌트는 서버 렌더링 동안 동일한 데이터 스냅샷을 참조합니다.

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

`AnimatedWeatherCard`와 `MinimalWeatherCard`가 동일한 <CodeStep step={1}>city</CodeStep>에 대해 렌더링되면, <CodeStep step={2}>메모이제이션된 함수</CodeStep>에서 동일한 데이터 스냅샷을 받게 됩니다.

`AnimatedWeatherCard`와 `MinimalWeatherCard`가 <CodeStep step={1}>다른 city</CodeStep> 인수를 <CodeStep step={2}>`getTemperature`</CodeStep>에 제공하면, `fetchTemperature`가 두 번 호출되고 각 호출 사이트는 다른 데이터를 받게 됩니다.

<CodeStep step={1}>city</CodeStep>는 캐시 키 역할을 합니다.

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>비동기 렌더링</CodeStep>은 Server Components에서만 지원됩니다.

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'

</Note>

### 데이터 미리 로드 {/*preload-data*/}

오래 걸리는 데이터 가져오기를 캐시하여 컴포넌트를 렌더링하기 전에 비동기 작업을 시작할 수 있습니다.

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
  // ✅ 좋은 예: 사용자 데이터를 가져오기 시작합니다.
  getUser(id);
  // ... 일부 계산 작업
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

`Page`를 렌더링할 때, 컴포넌트는 <CodeStep step={1}>`getUser`</CodeStep>를 호출하지만 반환된 데이터를 사용하지 않습니다. 이 초기 <CodeStep step={1}>`getUser`</CodeStep> 호출은 `Page`가 다른 계산 작업을 수행하고 자식을 렌더링하는 동안 비동기 데이터베이스 쿼리를 시작합니다.

`Profile`을 렌더링할 때, 다시 <CodeStep step={2}>`getUser`</CodeStep>를 호출합니다. 초기 <CodeStep step={1}>`getUser`</CodeStep> 호출이 이미 반환되어 사용자 데이터를 캐시한 경우, `Profile`이 <CodeStep step={2}>이 데이터를 요청하고 기다릴 때</CodeStep>, 추가 원격 프로시저 호출 없이 캐시에서 데이터를 읽을 수 있습니다. 초기 데이터 요청이 완료되지 않은 경우, 이 패턴에서 데이터를 미리 로드하면 데이터 가져오기 지연이 줄어듭니다.

<DeepDive>

#### 비동기 작업 캐싱 {/*caching-asynchronous-work*/}

[비동기 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)를 평가할 때, 해당 작업에 대한 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)를 받게 됩니다. 이 Promise는 해당 작업의 상태(_pending_, _fulfilled_, _failed_)와 최종 결과를 포함합니다.

이 예제에서 비동기 함수 <CodeStep step={1}>`fetchData`</CodeStep>는 `fetch`를 기다리는 Promise를 반환합니다.

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... 일부 계산 작업  
  await getData();
  // ...
}
```

처음 <CodeStep step={2}>`getData`</CodeStep>를 호출할 때, <CodeStep step={1}>`fetchData`</CodeStep>에서 반환된 Promise가 캐시됩니다. 이후 조회는 동일한 Promise를 반환합니다.

첫 번째 <CodeStep step={2}>`getData`</CodeStep> 호출은 `await`하지 않지만, <CodeStep step={3}>두 번째</CodeStep> 호출은 `await`합니다. [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)는 Promise의 최종 결과를 기다리고 반환하는 JavaScript 연산자입니다. 첫 번째 <CodeStep step={2}>`getData`</CodeStep> 호출은 단순히 `fetch`를 시작하여 두 번째 <CodeStep step={3}>`getData`</CodeStep> 조회를 위해 Promise를 캐시합니다.

두 번째 호출 시 Promise가 여전히 _pending_ 상태라면, `await`는 결과를 기다립니다. 최적화는 `fetch`를 기다리는 동안 React가 계산 작업을 계속할 수 있어 두 번째 호출의 대기 시간을 줄이는 것입니다.

Promise가 이미 완료되었거나 오류 또는 _fulfilled_ 결과로 설정된 경우, `await`는 즉시 해당 값을 반환합니다. 두 경우 모두 성능 이점이 있습니다.
</DeepDive>

<Pitfall>

##### 컴포넌트 외부에서 메모이제이션된 함수를 호출하면 캐시를 사용하지 않습니다. {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 잘못된 예: 컴포넌트 외부에서 메모이제이션된 함수를 호출하면 메모이제이션되지 않습니다.
getUser('demo-id');

async function DemoProfile() {
  // ✅ 좋은 예: `getUser`는 메모이제이션됩니다.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React는 컴포넌트에서 메모이제이션된 함수에만 캐시 접근을 제공합니다. <CodeStep step={1}>`getUser`</CodeStep>를 컴포넌트 외부에서 호출하면, 함수는 여전히 평가되지만 캐시를 읽거나 업데이트하지 않습니다.

이는 캐시 접근이 컴포넌트에서만 접근할 수 있는 [컨텍스트](/learn/passing-data-deeply-with-context)를 통해 제공되기 때문입니다.

</Pitfall>

<DeepDive>

#### 언제 `cache`, [`memo`](/reference/react/memo) 또는 [`useMemo`](/reference/react/useMemo)를 사용해야 하나요? {/*cache-memo-usememo*/}

언급된 모든 API는 메모이제이션을 제공하지만, 메모이제이션하려는 대상, 캐시에 접근할 수 있는 주체, 캐시가 무효화되는 시점에 차이가 있습니다.

#### `useMemo` {/*deep-dive-use-memo*/}

일반적으로, 클라이언트 컴포넌트에서 렌더링 간에 비용이 많이 드는 계산을 캐싱하려면 [`useMemo`](/reference/react/useMemo)를 사용해야 합니다. 예를 들어, 컴포넌트 내에서 데이터 변환을 메모이제이션하려는 경우입니다.

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
이 예제에서 `App`은 동일한 기록으로 두 개의 `WeatherReport`를 렌더링합니다. 두 컴포넌트가 동일한 작업을 수행하더라도, 작업을 공유할 수 없습니다. `useMemo`의 캐시는 컴포넌트에만 로컬입니다.

그러나, `useMemo`는 `App`이 다시 렌더링되고 `record` 객체가 변경되지 않는 경우, 각 컴포넌트 인스턴스가 작업을 건너뛰고 `avgTemp`의 메모이제이션된 값을 사용할 수 있도록 보장합니다. `useMemo`는 주어진 종속성으로 마지막 계산만 캐시합니다.

#### `cache` {/*deep-dive-cache*/}

일반적으로, Server Components에서 컴포넌트 간에 공유할 수 있는 작업을 메모이제이션하려면 `cache`를 사용해야 합니다.

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
이전 예제를 `cache`를 사용하도록 다시 작성하면, 이 경우 <CodeStep step={3}>두 번째 `WeatherReport` 인스턴스</CodeStep>는 중복 작업을 건너뛰고 <CodeStep step={1}>첫 번째 `WeatherReport`</CodeStep>와 동일한 캐시에서 읽을 수 있습니다. 이전 예제와의 또 다른 차이점은 `cache`가 <CodeStep step={2}>데이터 가져오기를 메모이제이션하는 데</CodeStep>도 권장된다는 점입니다. 반면, `useMemo`는 계산에만 사용해야 합니다.

현재, `cache`는 Server Components에서만 사용해야 하며 캐시는 서버 요청 간에 무효화됩니다.

#### `memo` {/*deep-dive-memo*/}

[`memo`](reference/react/memo)를 사용하여 props가 변경되지 않은 경우 컴포넌트가 다시 렌더링되지 않도록 해야 합니다.

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

이 예제에서, 두 `MemoWeatherReport` 컴포넌트는 처음 렌더링될 때 `calculateAvg`를 호출합니다. 그러나, `App`이 다시 렌더링되고 `record`에 변경 사항이 없으면, props가 변경되지 않았기 때문에 `MemoWeatherReport`는 다시 렌더링되지 않습니다.

`useMemo`와 비교하여, `memo`는 props를 기반으로 컴포넌트 렌더링을 메모이제이션합니다. 특정 계산을 메모이제이션하는 `useMemo`와 유사하게, 메모이제이션된 컴포넌트는 마지막 props 값으로 마지막 렌더링만 캐시합니다. props가 변경되면 캐시가 무효화되고 컴포넌트가 다시 렌더링됩니다.

</DeepDive>

---

## 문제 해결 {/*troubleshooting*/}

### 동일한 인수로 호출했는데도 메모이제이션된 함수가 여전히 실행됩니다. {/*memoized-function-still-runs*/}

이전에 언급된 주의사항을 참조하세요.
* [다른 메모이제이션된 함수를 호출하면 다른 캐시에서 읽습니다.](#pitfall-different-memoized-functions)
* [컴포넌트 외부에서 메모이제이션된 함수를 호출하면 캐시를 사용하지 않습니다.](#pitfall-memoized-call-outside-component)

위의 사항이 적용되지 않는 경우, React가 캐시에 있는지 확인하는 방법에 문제가 있을 수 있습니다.

인수가 [원시값](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)이 아닌 경우(예: 객체, 함수, 배열), 동일한 객체 참조를 전달하고 있는지 확인하세요.

메모이제이션된 함수를 호출할 때, React는 입력 인수를 조회하여 결과가 이미 캐시에 있는지 확인합니다. React는 캐시 히트 여부를 결정하기 위해 인수의 얕은 동등성을 사용합니다.

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 잘못된 예: props는 매 렌더링마다 변경되는 객체입니다.
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

이 경우 두 `MapMarker`는 동일한 작업을 수행하고 `{x: 10, y: 10, z:10}` 값으로 `calculateNorm`을 호출하는 것처럼 보입니다. 객체가 동일한 값을 포함하고 있지만, 각 컴포넌트가 자체 `props` 객체를 생성하기 때문에 동일한 객체 참조가 아닙니다.

React는 입력값에 대해 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)를 호출하여 캐시 히트 여부를 확인합니다.

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ 좋은 예: 메모이제이션된 함수에 원시값을 전달합니다.
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

이 문제를 해결하는 한 가지 방법은 벡터 차원을 `calculateNorm`에 전달하는 것입니다. 이는 차원 자체가 원시값이기 때문에 작동합니다.

또 다른 해결책은 벡터 객체 자체를 컴포넌트에 prop으로 전달하는 것입니다. 두 컴포넌트 인스턴스에 동일한 객체를 전달해야 합니다.

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ 좋은 예: 동일한 `vector` 객체를 전달합니다.
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

