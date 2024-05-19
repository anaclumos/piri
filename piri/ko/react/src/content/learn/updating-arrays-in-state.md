---
title: 상태에서 배열 업데이트하기
---

<Intro>

JavaScript에서 배열은 변경 가능하지만, 상태에 저장할 때는 변경 불가능한 것으로 취급해야 합니다. 객체와 마찬가지로, 상태에 저장된 배열을 업데이트하려면 새로운 배열을 생성하거나 기존 배열을 복사한 후, 상태를 새로운 배열로 설정해야 합니다.

</Intro>

<YouWillLearn>

- React 상태에서 배열의 항목을 추가, 제거 또는 변경하는 방법
- 배열 내부의 객체를 업데이트하는 방법
- Immer를 사용하여 배열 복사를 덜 반복적으로 만드는 방법

</YouWillLearn>

## 변경 없이 배열 업데이트하기 {/*updating-arrays-without-mutation*/}

JavaScript에서 배열은 또 다른 종류의 객체입니다. [객체와 마찬가지로](/learn/updating-objects-in-state), **React 상태에서 배열을 읽기 전용으로 취급해야 합니다.** 이는 `arr[0] = 'bird'`와 같이 배열 내부의 항목을 재할당하지 말아야 하며, `push()` 및 `pop()`과 같은 배열을 변경하는 메서드를 사용하지 말아야 함을 의미합니다.

대신, 배열을 업데이트할 때마다 상태 설정 함수에 *새로운* 배열을 전달해야 합니다. 이를 위해, 상태에 있는 원래 배열에서 `filter()` 및 `map()`과 같은 비변경 메서드를 호출하여 새로운 배열을 생성할 수 있습니다. 그런 다음 상태를 결과로 나온 새로운 배열로 설정할 수 있습니다.

다음은 일반적인 배열 작업의 참조 표입니다. React 상태 내에서 배열을 다룰 때는 왼쪽 열의 메서드를 피하고, 대신 오른쪽 열의 메서드를 선호해야 합니다:

|           | 피해야 할 메서드 (배열을 변경함)           | 선호할 메서드 (새로운 배열을 반환함)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| 추가    | `push`, `unshift`                   | `concat`, `[...arr]` 스프레드 문법 ([예제](#adding-to-an-array)) |
| 제거  | `pop`, `shift`, `splice`            | `filter`, `slice` ([예제](#removing-from-an-array))              |
| 교체 | `splice`, `arr[i] = ...` 할당 | `map` ([예제](#replacing-items-in-an-array))                     |
| 정렬   | `reverse`, `sort`                   | 배열을 먼저 복사 ([예제](#making-other-changes-to-an-array)) |

또는, [Immer를 사용](#write-concise-update-logic-with-immer)하여 두 열의 메서드를 모두 사용할 수 있습니다.

<Pitfall>

불행히도, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)와 [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)는 이름이 비슷하지만 매우 다릅니다:

* `slice`는 배열 또는 그 일부를 복사할 수 있습니다.
* `splice`는 배열을 **변경**합니다 (항목을 삽입하거나 삭제하기 위해).

React에서는 상태의 객체나 배열을 변경하지 않으려 하기 때문에 `slice`(p 없음!)를 훨씬 더 자주 사용하게 될 것입니다. [객체 업데이트하기](/learn/updating-objects-in-state)에서는 변경이 무엇인지와 상태에 대해 권장되지 않는 이유를 설명합니다.

</Pitfall>

### 배열에 항목 추가하기 {/*adding-to-an-array*/}

`push()`는 배열을 변경하므로 사용하지 말아야 합니다:

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

대신, 기존 항목과 끝에 새로운 항목을 포함하는 *새로운* 배열을 만드세요. 이를 수행하는 여러 가지 방법이 있지만, 가장 쉬운 방법은 `...` [배열 스프레드](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) 문법을 사용하는 것입니다:

```js
setArtists( // 상태를 교체
  [ // 새로운 배열로
    ...artists, // 모든 기존 항목을 포함하고
    { id: nextId++, name: name } // 끝에 새로운 항목 하나 추가
  ]
);
```

이제 올바르게 작동합니다:

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

배열 스프레드 문법을 사용하면 항목을 원래 `...artists` 앞에 배치하여 항목을 *앞에* 추가할 수도 있습니다:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // 기존 항목을 끝에 배치
]);
```

이렇게 하면 스프레드는 배열의 끝에 항목을 추가하는 `push()`와 배열의 시작에 항목을 추가하는 `unshift()`의 역할을 모두 수행할 수 있습니다. 위의 샌드박스에서 시도해 보세요!

### 배열에서 항목 제거하기 {/*removing-from-an-array*/}

배열에서 항목을 제거하는 가장 쉬운 방법은 *필터링*하는 것입니다. 즉, 해당 항목을 포함하지 않는 새로운 배열을 생성하는 것입니다. 이를 위해 `filter` 메서드를 사용할 수 있습니다. 예를 들어:

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

"Delete" 버튼을 몇 번 클릭하고, 클릭 핸들러를 확인하세요.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

여기서 `artists.filter(a => a.id !== artist.id)`는 "ID가 `artist.id`와 다른 `artists`로 구성된 배열을 생성"을 의미합니다. 즉, 각 아티스트의 "Delete" 버튼은 해당 아티스트를 배열에서 필터링하고, 결과 배열로 다시 렌더링을 요청합니다. `filter`는 원래 배열을 수정하지 않습니다.

### 배열 변환하기 {/*transforming-an-array*/}

배열의 일부 또는 모든 항목을 변경하려면 `map()`을 사용하여 **새로운** 배열을 생성할 수 있습니다. `map`에 전달할 함수는 항목의 데이터 또는 인덱스(또는 둘 다)를 기반으로 각 항목에 대해 무엇을 할지 결정할 수 있습니다.

이 예제에서는 배열이 두 개의 원과 하나의 사각형의 좌표를 보유합니다. 버튼을 누르면 원만 50픽셀 아래로 이동합니다. 이는 `map()`을 사용하여 데이터의 새로운 배열을 생성함으로써 수행됩니다:

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
        // 변경 없음
        return shape;
      } else {
        // 50픽셀 아래에 새로운 원 반환
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // 새로운 배열로 다시 렌더링
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

### 배열의 항목 교체하기 {/*replacing-items-in-an-array*/}

배열의 하나 이상의 항목을 교체하고 싶을 때가 특히 많습니다. `arr[0] = 'bird'`와 같은 할당은 원래 배열을 변경하므로, 대신 `map`을 사용해야 합니다.

항목을 교체하려면 `map`을 사용하여 새로운 배열을 만드세요. `map` 호출 내에서 항목 인덱스를 두 번째 인수로 받게 됩니다. 이를 사용하여 원래 항목(첫 번째 인수)을 반환할지 아니면 다른 것을 반환할지 결정하세요:

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
        // 클릭된 카운터 증가
        return c + 1;
      } else {
        // 나머지는 변경 없음
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

### 배열에 항목 삽입하기 {/*inserting-into-an-array*/}

때로는 항목을 시작이나 끝이 아닌 특정 위치에 삽입하고 싶을 때가 있습니다. 이를 위해 `...` 배열 스프레드 문법과 `slice()` 메서드를 함께 사용할 수 있습니다. `slice()` 메서드는 배열의 "슬라이스"를 자를 수 있게 해줍니다. 항목을 삽입하려면, 삽입 지점 *이전*의 슬라이스를 펼치고, 새로운 항목을 추가한 다음, 원래 배열의 나머지를 펼쳐서 배열을 생성합니다.

이 예제에서 Insert 버튼은 항상 인덱스 `1`에 삽입합니다:

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
    const insertAt = 1; // 어떤 인덱스든 될 수 있음
    const nextArtists = [
      // 삽입 지점 이전의 항목들:
      ...artists.slice(0, insertAt),
      // 새로운 항목:
      { id: nextId++, name: name },
      // 삽입 지점 이후의 항목들:
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

### 배열에 다른 변경 사항 적용하기 {/*making-other-changes-to-an-array*/}

스프레드 문법과 `map()` 및 `filter()`와 같은 비변경 메서드만으로는 할 수 없는 작업이 있습니다. 예를 들어, 배열을 뒤집거나 정렬하고 싶을 수 있습니다. JavaScript의 `reverse()` 및 `sort()` 메서드는 원래 배열을 변경하므로 직접 사용할 수 없습니다.

**그러나 먼저 배열을 복사한 다음 변경할 수 있습니다.**

예를 들어:

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

여기서 `[...list]` 스프레드 문법을 사용하여 먼저 원래 배열의 복사본을 만듭니다. 이제 복사본이 있으므로 `nextList.reverse()` 또는 `nextList.sort()`와 같은 변경 메서드를 사용할 수 있으며, 심지어 `nextList[0] = "something"`과 같은 개별 항목을 할당할 수도 있습니다.

그러나 **배열을 복사하더라도 기존 항목을 직접 변경할 수는 없습니다.** 이는 복사가 얕기 때문입니다. 새로운 배열은 원래 배열과 동일한 항목을 포함합니다. 따라서 복사된 배열 내부의 객체를 수정하면 기존 상태를 변경하는 것입니다. 예를 들어, 다음과 같은 코드는 문제가 됩니다.

```js
const nextList = [...list];
nextList[0].seen = true; // 문제: list[0]을 변경함
setList(nextList);
```

비록 `nextList`와 `list`는 두 개의 다른 배열이지만, **`nextList[0]`와 `list[0]`는 동일한 객체를 가리킵니다.** 따라서 `nextList[0].seen`을 변경하면 `list[0].seen`도 변경됩니다. 이는 상태 변경으로, 피해야 합니다! 이 문제는 [중첩된 JavaScript 객체 업데이트](/learn/updating-objects-in-state#updating-a-nested-object)와 유사한 방식으로 해결할 수 있습니다. 즉, 변경하려는 개별 항목을 복사하여 수정하는 것입니다. 방법은 다음과 같습니다.

## 배열 내부의 객체 업데이트하기 {/*updating-objects-inside-arrays*/}

객체는 실제로 배열 "내부"에 위치하지 않습니다. 코드에서는 "내부"에 있는 것처럼 보일 수 있지만, 배열의 각 객체는 배열이 "가리키는" 별도의 값입니다. 이것이 `list[0]`과 같은 중첩된 필드를 변경할 때 주의해야 하는 이유입니다. 다른 사람의 아트워크 목록이 동일한 배열 요소를 가리킬 수 있습니다!

**중첩된 상태를 업데이트할 때는 업데이트하려는 지점부터 최상위 레벨까지 복사본을 생성해야 합니다.** 어떻게 작동하는지 살펴보겠습니다.

이 예제에서는 두 개의 별도 아트워크 목록이 동일한 초기 상태를 가지고 있습니다. 이들은 격리되어 있어야 하지만, 변경으로 인해 상태가 우연히 공유되어 한 목록에서 체크박스를 선택하면 다른 목록에도 영향을 미칩니다:

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
  const [yourList
, setYourList] = useState(
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

문제는 다음과 같은 코드에 있습니다:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // 문제: 기존 항목을 변경함
setMyList(myNextList);
```

비록 `myNextList` 배열 자체는 새 것이지만, *항목 자체*는 원래 `myList` 배열과 동일합니다. 따라서 `artwork.seen`을 변경하면 *원래* 아트워크 항목이 변경됩니다. 그 아트워크 항목은 `yourList`에도 포함되어 있어 버그가 발생합니다. 이러한 버그는 생각하기 어려울 수 있지만, 상태 변경을 피하면 사라집니다.

**`map`을 사용하여 기존 항목을 변경된 버전으로 대체할 수 있습니다.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // 변경된 *새로운* 객체 생성
    return { ...artwork, seen: nextSeen };
  } else {
    // 변경 없음
    return artwork;
  }
}));
```

여기서 `...`는 객체 스프레드 문법으로 [객체의 복사본을 생성](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)하는 데 사용됩니다.

이 접근 방식으로는 기존 상태 항목이 변경되지 않으므로 버그가 수정됩니다:

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
        // 변경된 *새로운* 객체 생성
        return { ...artwork, seen: nextSeen };
      } else {
        // 변경 없음
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // 변경된 *새로운* 객체 생성
        return { ...artwork, seen: nextSeen };
      } else {
        // 변경 없음
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

일반적으로, **방금 생성한 객체만 변경해야 합니다.** *새로운* 아트워크를 삽입하는 경우에는 변경할 수 있지만, 상태에 이미 있는 항목을 다룰 때는 복사본을 만들어야 합니다.

### Immer로 간결한 업데이트 로직 작성하기 {/*write-concise-update-logic-with-immer*/}

변경 없이 중첩된 배열을 업데이트하는 것은 다소 반복적일 수 있습니다. [객체와 마찬가지로](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- 일반적으로 상태를 두 개 이상의 레벨 깊이로 업데이트할 필요는 없습니다. 상태 객체가 매우 깊다면, [다르게 구조화](/learn/choosing-the-state-structure#avoid-deeply-nested-state)하여 평평하게 만드는 것이 좋습니다.
- 상태 구조를 변경하고 싶지 않다면, [Immer](https://github.com/immerjs/use-immer)를 사용하여 편리하지만 변경하는 문법을 사용하고 복사본을 생성하는 작업을 처리할 수 있습니다.

다음은 Immer로 다시 작성된 Art Bucket List 예제입니다:

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

Immer를 사용하면 **`artwork.seen = nextSeen`과 같은 변경이 이제 괜찮습니다:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

이는 원래 상태를 변경하는 것이 아니라 Immer가 제공하는 특수한 `draft` 객체를 변경하는 것이기 때문입니다. 마찬가지로 `draft`의 내용에 `push()` 및 `pop()`과 같은 변경 메서드를 적용할 수 있습니다.

Immer는 항상 `draft`에 대해 수행한 변경 사항에 따라 다음 상태를 처음부터 구성합니다. 이를 통해 이벤트 핸들러를 매우 간결하게 유지하면서 상태를 변경하지 않습니다.

<Recap>

- 배열을 상태에 넣을 수 있지만, 변경할 수는 없습니다.
- 배열을 변경하는 대신, *새로운* 버전을 생성하고 상태를 업데이트하세요.
- `[...arr, newItem]` 배열 스프레드 문법을 사용하여 새로운 항목이 있는 배열을 생성할 수 있습니다.
- `filter()` 및 `map()`을 사용하여 필터링되거나 변환된 항목이 있는 새로운 배열을 생성할 수 있습니다.
- Immer를 사용하여 코드를 간결하게 유지할 수 있습니다.

</Recap>

<Challenges>

#### 쇼핑 카트에서 항목 업데이트하기 {/*update-an-item-in-the-shopping-cart*/}

`handleIncreaseClick` 로직을 채워서 "+"를 누르면 해당 숫자가 증가하도록 하세요:

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

`map` 함수를 사용하여 새로운 배열을 생성하고, `...` 객체 스프레드 문법을 사용하여 변경된 객체의 복사본을 새로운 배열에 사용할 수 있습니다:

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

#### 쇼핑 카트에서 항목 제거하기 {/*remove-an-item-from-the-shopping-cart*/}

이 쇼핑 카트에는 작동하는 "+" 버튼이 있지만, "–" 버튼은 아무런 동작을 하지 않습니다. 이벤트 핸들러를 추가하여 "–" 버튼을 누르면 해당 제품의 `count`가 감소하도록 하세요. `count`가 1일 때 "–"를 누르면 제품이 자동으로 카트에서 제거되어야 합니다. 0이 표시되지 않도록 하세요.

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

먼저 `map`을 사용하여 새로운 배열을 생성한 다음, `filter`를 사용하여 `count`가 `0`으로 설정된 제품을 제거할 수 있습니다:

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

#### 비변경 메서드를 사용하여 변경 사항 수정하기 {/*fix-the-mutations-using-non-mutative-methods*/}

이 예제에서 `App.js`의 모든 이벤트 핸들러는 변경을 사용합니다. 그 결과, 할 일 편집 및 삭제가 작동하지 않습니다. `handleAddTodo`, `handleChangeTodo`, 및 `handleDeleteTodo`를 비변경 메서드를 사용하여 다시 작성하세요:

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

`handleAddTodo`에서는 배열 스프레드 문법을 사용할 수 있습니다. `handleChangeTodo`에서는 `map`을 사용하여 새로운 배열을 생성할 수 있습니다. `handleDeleteTodo`에서는 `filter`를 사용하여 새로운 배열을 생성할 수 있습니다. 이제 목록이 올바르게 작동합니다:

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

#### Immer를 사용하여 변경 사항 수정하기 {/*fix-the-mutations-using-immer*/}

이 예제는 이전 챌린지와 동일합니다. 이번에는 Immer를 사용하여 변경 사항을 수정하세요. 편의를 위해 `useImmer`가 이미 가져와져 있으므로 `todos` 상태 변수를 사용하도록 변경해야 합니다.

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

Immer를 사용하면 `draft`가 제공하는 부분만 변경하는 한, 변경 방식으로 코드를 작성할 수 있습니다. 여기서는 모든 변경이 `draft`에서 수행되므로 코드가 작동합니다:

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

Immer를 사용하면 변경 방식과 비변경 방식을 혼합하여 사용할 수도 있습니다.

예를 들어, 이 버전에서는 `handleAddTodo`가 Immer `draft`를 변경하여 구현되었고, `handleChangeTodo` 및 `handleDeleteTodo`는 비변경 `map` 및 `filter` 메서드를 사용합니다:

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

Immer를 사용하면 각 경우에 가장 자연스러운 스타일을 선택할 수 있습니다.

</Solution>

</Challenges>