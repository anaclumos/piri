---
title: State: 컴포넌트의 메모리
---

<Intro>

컴포넌트는 상호작용의 결과로 화면에 표시되는 내용을 변경해야 할 때가 많습니다. 양식에 입력하면 입력 필드가 업데이트되어야 하고, 이미지 캐러셀에서 "다음"을 클릭하면 표시되는 이미지가 변경되어야 하며, "구매"를 클릭하면 제품이 쇼핑 카트에 담겨야 합니다. 컴포넌트는 현재 입력 값, 현재 이미지, 쇼핑 카트와 같은 것을 "기억"해야 합니다. React에서는 이러한 컴포넌트별 메모리를 *state*라고 합니다.

</Intro>

<YouWillLearn>

* [`useState`](/reference/react/useState) Hook을 사용하여 state 변수를 추가하는 방법
* `useState` Hook이 반환하는 값의 쌍
* 여러 개의 state 변수를 추가하는 방법
* state가 로컬이라고 불리는 이유

</YouWillLearn>

## 일반 변수가 충분하지 않을 때 {/*when-a-regular-variable-isnt-enough*/}

다음은 조각상 이미지를 렌더링하는 컴포넌트입니다. "다음" 버튼을 클릭하면 `index`를 `1`, `2` 등으로 변경하여 다음 조각상을 표시해야 합니다. 그러나 이것은 **작동하지 않습니다** (직접 시도해보세요!):

<Sandpack>

```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: '콜빈은 주로 전-히스패닉 상징을 암시하는 추상적인 주제로 알려져 있지만, 이 거대한 조각상은 신경외과에 대한 경의를 표하는 그녀의 가장 잘 알려진 공공 예술 작품 중 하나입니다.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '두 손이 인간의 뇌를 섬세하게 잡고 있는 청동 조각상.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '이 거대한 (75 피트 또는 23m) 은색 꽃은 부에노스아이레스에 위치해 있습니다. 이 꽃은 저녁이나 강한 바람이 불 때 꽃잎을 닫고 아침에 다시 열리도록 설계되었습니다.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '반사되는 거울 같은 꽃잎과 강한 수술을 가진 거대한 금속 꽃 조각상.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '윌슨은 평등, 사회 정의, 인류의 본질적이고 영적인 특성에 대한 관심으로 알려져 있었습니다. 이 거대한 (7피트 또는 2.13m) 청동 조각상은 그가 "보편적인 인류애로 가득 찬 상징적인 흑인 존재"라고 묘사한 것을 나타냅니다.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '항상 존재하고 엄숙한 인간의 머리를 묘사한 조각상. 평온과 고요함을 발산합니다.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '이스터 섬에 위치한 1,000개의 모아이, 또는 현존하는 거대한 조각상은 초기 라파누이 사람들이 만든 것으로, 일부는 신격화된 조상들을 나타낸다고 믿습니다.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '엄숙한 얼굴을 가진 비율이 큰 머리를 가진 세 개의 거대한 석상.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: '나나는 여성성과 모성을 상징하는 승리의 생명체입니다. 처음에 Saint Phalle은 나나를 위해 천과 발견된 물체를 사용했으며, 나중에는 더 생생한 효과를 얻기 위해 폴리에스터를 도입했습니다.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '기쁨을 발산하는 다채로운 의상을 입은 유쾌한 춤추는 여성 형상의 큰 모자이크 조각상.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '이 추상적인 청동 조각상은 요크셔 조각 공원에 위치한 The Family of Man 시리즈의 일부입니다. Hepworth는 세상의 문자 그대로의 표현을 만들지 않고 사람과 풍경에서 영감을 받은 추상적인 형태를 개발했습니다.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '인간 형상을 연상시키는 세 개의 요소가 쌓여 있는 키 큰 조각상.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "네 세대에 걸친 목각 장인의 후손인 Fakeye의 작품은 전통적인 요루바 테마와 현대적인 요루바 테마를 혼합했습니다.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '패턴으로 장식된 말에 집중된 얼굴을 가진 전사의 정교한 목조 조각상.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow는 젊음과 아름다움의 덧없음과 취약성의 은유로서 단편적인 신체 조각으로 유명합니다. 이 조각상은 각각 약 5피트(1.5m) 높이의 매우 현실적인 큰 배 두 개를 쌓아 놓은 것을 묘사합니다.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '고전 조각의 배와는 상당히 다른 주름의 연속을 연상시키는 조각상.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '테라코타 군대는 중국의 첫 번째 황제인 진시황의 군대를 묘사한 테라코타 조각상 모음입니다. 군대는 8,000명 이상의 병사, 130대의 전차와 520마리의 말, 150마리의 기병 말로 구성되어 있었습니다.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '각각 독특한 표정과 갑옷을 가진 12개의 테라코타 전사 조각상.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson은 뉴욕시의 잔해에서 물건을 수집하여 나중에 거대한 구조물로 조립하는 것으로 유명했습니다. 이 작품에서는 침대 기둥, 저글링 핀, 좌석 조각과 같은 다양한 부분을 사용하여 큐비즘의 기하학적 공간과 형태의 추상화의 영향을 반영하는 상자에 못을 박고 접착했습니다.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '개별 요소가 처음에는 구별되지 않는 검은색 무광택 조각상.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar는 전통과 현대, 자연과 산업을 결합합니다. 그녀의 예술은 인간과 자연의 관계에 중점을 둡니다. 그녀의 작품은 추상적이면서도 구체적이고, 중력에 도전하며, "예상치 못한 재료의 훌륭한 합성"으로 묘사되었습니다.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '콘크리트 벽에 장착되어 바닥으로 내려오는 창백한 철사 같은 조각상. 가벼워 보입니다.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '타이페이 동물원은 놀이 중인 잠긴 하마를 특징으로 하는 하마 광장을 의뢰했습니다.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '수영하는 것처럼 보이는 청동 하마 조각상이 보도에서 솟아오르고 있습니다.'
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

`handleClick` 이벤트 핸들러는 로컬 변수인 `index`를 업데이트하고 있습니다. 그러나 두 가지 이유로 인해 해당 변경 사항이 표시되지 않습니다:

1. **로컬 변수는 렌더링 간에 지속되지 않습니다.** React가 이 컴포넌트를 두 번째로 렌더링할 때, 로컬 변수의 변경 사항을 고려하지 않고 처음부터 다시 렌더링합니다.
2. **로컬 변수의 변경 사항은 렌더링을 트리거하지 않습니다.** React는 새 데이터를 사용하여 컴포넌트를 다시 렌더링해야 한다는 것을 인식하지 못합니다.

새 데이터로 컴포넌트를 업데이트하려면 두 가지가 필요합니다:

1. 렌더링 간에 데이터를 **유지**합니다.
2. React가 새 데이터를 사용하여 컴포넌트를 렌더링하도록 **트리거**합니다 (재렌더링).

[`useState`](/reference/react/useState) Hook은 이 두 가지를 제공합니다:

1. 렌더링 간에 데이터를 유지하는 **state 변수**.
2. 변수를 업데이트하고 React가 컴포넌트를 다시 렌더링하도록 트리거하는 **state 설정 함수**.

## state 변수 추가하기 {/*adding-a-state-variable*/}

state 변수를 추가하려면 파일 상단에 `useState`를 React에서 가져옵니다:

```js
import { useState } from 'react';
```

그런 다음 이 줄을 다음으로 교체합니다:

```js
let index = 0;
```

```js
const [index, setIndex] = useState(0);
```

`index`는 state 변수이고 `setIndex`는 설정 함수입니다.

> 여기서 `[`와 `]` 구문은 [배열 구조 분해](https://javascript.info/destructuring-assignment)라고 하며 배열에서 값을 읽을 수 있게 해줍니다. `useState`가 반환하는 배열에는 항상 정확히 두 개의 항목이 있습니다.

이것이 `handleClick`에서 함께 작동하는 방식입니다:

```js
function handleClick() {
  setIndex(index + 1);
}
```

이제 "다음" 버튼을 클릭하면 현재 조각상이 전환됩니다:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i> 
        by {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: '콜빈은 주로 전-히스패닉 상징을 암시하는 추상적인 주제로 알려져 있지만, 이 거대한 조각상은 신경외과에 대한 경의를 표하는 그녀의 가장 잘 알려진 공공 예술 작품 중 하나입니다.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '두 손이 인간의 뇌를 섬세하게 잡고 있는 청동 조각상.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '이 거대한 (75 피트 또는 23m) 은색 꽃은 부에노스아이레스에 위치해 있습니다. 이 꽃은 저녁이나 강한 바람이 불 때 꽃잎을 닫고 아침에 다시 열리도록 설계되었습니다.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '반사되는 거울 같은 꽃잎과 강한 수술을 가진 거대한 금속 꽃 조각상.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '윌슨은 평등, 사회 정의, 인류의 본질적이고 영적인 특성에 대한 관심으로 알려져 있었습니다. 이 거대한 (7피트 또는 2.13m) 청동 조각상은 그가 "보편적인 인류애로 가득 찬 상징적인 흑인 존재"라고 묘사한 것을 나타냅니다.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '항상 존재하고 엄숙한 인간의 머리를 묘사한 조각상. 평온과 고요함을 발산합니다.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '이스터 섬에 위치한 1,000개의 모아이, 또는 현존하는 거대한 조각상은 초기 라파누이 사람들이 만든 것으로, 일부는 신격화된 조상들을 나타낸다고 믿습니다.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '엄숙한 얼굴을 가진 비율이 큰 머리를 가진 세 개의 거대한 석상.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: '나나는 여성성과 모성을 상징하는 승리의 생명체입니다. 처음에 Saint Phalle은 나나를 위해 천과 발견된 물체를 사용했으며, 나중에는 더 생생한 효과를 얻기 위해 폴리에스터를 도입했습니다.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '기쁨을 발산하는 다채로운 의상을 입은 유쾌한 춤추는 여성 형상의 큰 모자이크 조각상.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '이 추상적인 청동 조각상은 요크셔 조각 공원에 위치한 The Family of Man 시리즈의 일부입니다. Hepworth는 세상의 문자 그대로의 표현을 만들지 않고 사람과 풍경에서 영감을 받은 추상적인 형태를 개발했습니다.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '인간 형상을 연상시키는 세 개의 요소가 쌓여 있는 키 큰 조각상.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "네 세대에 걸친 목각 장인의 후손인 Fakeye의 작품은 전통적인 요루바 테마와 현대적인 요루바 테마를 혼합했습니다.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '패턴으로 장식된 말에 집중된 얼굴을 가진 전사의 정교한 목조 조각상.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow는 젊음과 아름다움의 덧없음과 취약성의 은유로서 단편적인 신체 조각으로 유명합니다. 이 조각상은 각각 약 5피트(1.5m) 높이의 매우 현실적인 큰 배 두 개를 쌓아 놓은 것을 묘사합니다.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '고전 조각의 배와는 상당히 다른 주름의 연속을 연상시키는 조각상.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '테라코타 군대는 중국의 첫 번째 황제인 진시황의 군대를 묘사한 테라코타 조각상 모음입니다. 군대는 8,000명 이상의 병사, 130대의 전차와 520마리의 말, 150마리의 기병 말로 구성되어 있었습니다.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '각각 독특한 표정과 갑옷을 가진 12개의 테라코타 전사 조각상.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson은 뉴욕시의 잔해에서 물건을 수집하여 나중에 거대한 구조물로 조립하는 것으로 유명
했습니다. 이 작품에서는 침대 기둥, 저글링 핀, 좌석 조각과 같은 다양한 부분을 사용하여 큐비즘의 기하학적 공간과 형태의 추상화의 영향을 반영하는 상자에 못을 박고 접착했습니다.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '개별 요소가 처음에는 구별되지 않는 검은색 무광택 조각상.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar는 전통과 현대, 자연과 산업을 결합합니다. 그녀의 예술은 인간과 자연의 관계에 중점을 둡니다. 그녀의 작품은 추상적이면서도 구체적이고, 중력에 도전하며, "예상치 못한 재료의 훌륭한 합성"으로 묘사되었습니다.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '콘크리트 벽에 장착되어 바닥으로 내려오는 창백한 철사 같은 조각상. 가벼워 보입니다.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '타이페이 동물원은 놀이 중인 잠긴 하마를 특징으로 하는 하마 광장을 의뢰했습니다.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '수영하는 것처럼 보이는 청동 하마 조각상이 보도에서 솟아오르고 있습니다.'
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

### 첫 번째 Hook 만나기 {/*meet-your-first-hook*/}

React에서 `useState`와 같은 함수는 "`use`"로 시작하는 모든 함수와 마찬가지로 Hook이라고 합니다.

*Hooks*는 React가 [렌더링](/learn/render-and-commit#step-1-trigger-a-render)하는 동안에만 사용할 수 있는 특별한 함수입니다 (다음 페이지에서 더 자세히 다룰 예정입니다). 이 함수들은 React의 다양한 기능에 "연결"할 수 있게 해줍니다.

state는 이러한 기능 중 하나일 뿐이며, 나중에 다른 Hook들도 만나게 될 것입니다.

<Pitfall>

**Hooks—`use`로 시작하는 함수—는 컴포넌트의 최상위 레벨이나 [사용자 정의 Hook](/learn/reusing-logic-with-custom-hooks)에서만 호출할 수 있습니다.** 조건문, 루프, 또는 다른 중첩된 함수 내에서 Hook을 호출할 수 없습니다. Hook은 함수이지만, 컴포넌트의 필요에 대한 무조건적인 선언으로 생각하는 것이 도움이 됩니다. 파일 상단에서 모듈을 "import"하는 것처럼 컴포넌트 상단에서 React 기능을 "사용"합니다.

</Pitfall>

### `useState`의 해부 {/*anatomy-of-usestate*/}

[`useState`](/reference/react/useState)를 호출하면 React에게 이 컴포넌트가 무언가를 기억하고 싶다고 말하는 것입니다:

```js
const [index, setIndex] = useState(0);
```

이 경우, React가 `index`를 기억하도록 하고 싶습니다.

<Note>

관례적으로 이 쌍을 `const [something, setSomething]`처럼 이름을 짓습니다. 원하는 대로 이름을 지을 수 있지만, 관례는 프로젝트 간의 이해를 쉽게 만듭니다.

</Note>

`useState`의 유일한 인수는 state 변수의 **초기 값**입니다. 이 예제에서는 `index`의 초기 값이 `useState(0)`으로 설정됩니다.

컴포넌트가 렌더링될 때마다 `useState`는 두 개의 값을 포함하는 배열을 반환합니다:

1. 저장된 값을 가진 **state 변수** (`index`).
2. state 변수를 업데이트하고 React가 컴포넌트를 다시 렌더링하도록 트리거하는 **state 설정 함수** (`setIndex`).

다음은 실제로 어떻게 작동하는지 보여줍니다:

```js
const [index, setIndex] = useState(0);
```

1. **컴포넌트가 처음 렌더링됩니다.** `index`의 초기 값으로 `0`을 `useState`에 전달했기 때문에 `[0, setIndex]`를 반환합니다. React는 `0`이 최신 state 값임을 기억합니다.
2. **state를 업데이트합니다.** 사용자가 버튼을 클릭하면 `setIndex(index + 1)`을 호출합니다. `index`는 `0`이므로 `setIndex(1)`이 됩니다. 이는 React에게 `index`가 이제 `1`임을 기억하고 다른 렌더링을 트리거하도록 지시합니다.
3. **컴포넌트의 두 번째 렌더링.** React는 여전히 `useState(0)`을 보지만, React는 `index`를 `1`로 설정한 것을 기억하기 때문에 `[1, setIndex]`를 반환합니다.
4. 계속해서 반복됩니다!

## 여러 state 변수를 컴포넌트에 추가하기 {/*giving-a-component-multiple-state-variables*/}

하나의 컴포넌트에 원하는 만큼의 state 변수를 가질 수 있습니다. 이 컴포넌트는 숫자 `index`와 "자세히 보기"를 클릭할 때 토글되는 boolean `showMore`라는 두 개의 state 변수를 가지고 있습니다:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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
  description: '콜빈은 주로 전-히스패닉 상징을 암시하는 추상적인 주제로 알려져 있지만, 이 거대한 조각상은 신경외과에 대한 경의를 표하는 그녀의 가장 잘 알려진 공공 예술 작품 중 하나입니다.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '두 손이 인간의 뇌를 섬세하게 잡고 있는 청동 조각상.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '이 거대한 (75 피트 또는 23m) 은색 꽃은 부에노스아이레스에 위치해 있습니다. 이 꽃은 저녁이나 강한 바람이 불 때 꽃잎을 닫고 아침에 다시 열리도록 설계되었습니다.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '반사되는 거울 같은 꽃잎과 강한 수술을 가진 거대한 금속 꽃 조각상.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '윌슨은 평등, 사회 정의, 인류의 본질적이고 영적인 특성에 대한 관심으로 알려져 있었습니다. 이 거대한 (7피트 또는 2.13m) 청동 조각상은 그가 "보편적인 인류애로 가득 찬 상징적인 흑인 존재"라고 묘사한 것을 나타냅니다.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '항상 존재하고 엄숙한 인간의 머리를 묘사한 조각상. 평온과 고요함을 발산합니다.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '이스터 섬에 위치한 1,000개의 모아이, 또는 현존하는 거대한 조각상은 초기 라파누이 사람들이 만든 것으로, 일부는 신격화된 조상들을 나타낸다고 믿습니다.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '엄숙한 얼굴을 가진 비율이 큰 머리를 가진 세 개의 거대한 석상.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: '나나는 여성성과 모성을 상징하는 승리의 생명체입니다. 처음에 Saint Phalle은 나나를 위해 천과 발견된 물체를 사용했으며, 나중에는 더 생생한 효과를 얻기 위해 폴리에스터를 도입했습니다.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '기쁨을 발산하는 다채로운 의상을 입은 유쾌한 춤추는 여성 형상의 큰 모자이크 조각상.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '이 추상적인 청동 조각상은 요크셔 조각 공원에 위치한 The Family of Man 시리즈의 일부입니다. Hepworth는 세상의 문자 그대로의 표현을 만들지 않고 사람과 풍경에서 영감을 받은 추상적인 형태를 개발했습니다.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '인간 형상을 연상시키는 세 개의 요소가 쌓여 있는 키 큰 조각상.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "네 세대에 걸친 목각 장인의 후손인 Fakeye의 작품은 전통적인 요루바 테마와 현대적인 요루바 테마를 혼합했습니다.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '패턴으로 장식된 말에 집중된 얼굴을 가진 전사의 정교한 목조 조각상.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow는 젊음과 아름다움의 덧없음과 취약성의 은유로서 단편적인 신체 조각으로 유명합니다. 이 조각상은 각각 약 5피트(1.5m) 높이의 매우 현실적인 큰 배 두 개를 쌓아 놓은 것을 묘사합니다.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '고전 조각의 배와는 상당히 다른 주름의 연속을 연상시키는 조각상.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '테라코타 군대는 중국의 첫 번째 황제인 진시황의 군대를 묘사한 테라코타 조각상 모음입니다. 군대는 8,000명 이상의 병사, 130대의 전차와 520마리의 말, 150마리의 기병 말로 구성되어 있었습니다.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '각각 독특한 표정과 갑옷을 가진 12개의 테라코타 전사 조각상.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson은 뉴욕시의 잔해에서 물건을 수집하여 나중에 거대한 구조물로 조립하는 것으로 유명했습니다. 이 작품에서는 침대 기둥, 저글링 핀, 좌석 조각과 같은 다양한 부분을 사용하여 큐비즘의 기하학적 공간과 형태의 추상화의 영향을 반영하는 상자에 못을 박고 접착했습니다.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '개별 요소가 처음에는 구별되지 않는 검은색 무광택 조각상.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar는 전통과 현대, 자연과 산업을 결합합니다. 그녀의 예술은 인간과 자연의 관계에 중점을 둡니다. 그녀의 작품은 추상적이면서도 구체적이고, 중력에 도전하며, "예상치 못한 재료의 훌륭한 합성"으로 묘사되었습니다.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '콘크리트 벽에 장착되어 바닥으로 내려오는 창백한 철사 같은 조각상. 가벼워 보입니다.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '타이페이 동물원은 놀이 중인 잠긴 하마를 특징으로 하는 하마 광장을 의뢰했습니다.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '수영하는 것처럼 보이는 청동 하마 조각상이 보도에서 솟아오르고 있습니다.'
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

서로 관련이 없는 state 변수는 여러 개의 state 변수를 사용하는 것이 좋습니다. 예를 들어, 이 예제에서는 `index`와 `showMore`가 서로 관련이 없습니다. 그러나 두 개의 state 변수를 자주 함께 변경하는 경우, 하나로 결합하는 것이 더 쉬울 수 있습니다. 예를 들어, 여러 필드가 있는 양식이 있는 경우, 각 필드마다 state 변수를 가지는 것보다 객체를 포함하는 단일 state 변수를 가지는 것이 더 편리합니다. 더 많은 팁은 [상태 구조 선택](/learn/choosing-the-state-structure)을 참조하세요.

<DeepDive>

#### React는 어떤 state를 반환해야 하는지 어떻게 알까요? {/*how-does-react-know-which-state-to-return*/}

`useState` 호출이 *어떤* state 변수를 참조하는지에 대한 정보를 받지 않는다는 것을 눈치챘을 것입니다. `useState`에 전달되는 "식별자"가 없는데, 어떻게 어떤 state 변수를 반환해야 하는지 알 수 있을까요? 함수의 구문 분석과 같은 마법에 의존하나요? 답은 아니오입니다.

대신, 간결한 구문을 가능하게 하기 위해, Hook은 **동일한 컴포넌트의 매 렌더링에서 안정적인 호출 순서**에 의존합니다. 이 규칙을 따르면 ("최상위 레벨에서만 Hook을 호출"), Hook은 항상 동일한 순서로 호출됩니다. 또한, [린터 플러그인](https://www.npmjs.com/package/eslint-plugin-react-hooks)은 대부분의 실수를 잡아냅니다.

내부적으로, React는 각 컴포넌트에 대한 state 쌍의 배열을 유지합니다. 또한, 렌더링 전에 현재 쌍 인덱스를 `0`으로 설정합니다. `useState`를 호출할 때마다 React는 다음 state 쌍을 제공하고 인덱스를 증가시킵니다. 이 메커니즘에 대해 더 알고 싶다면 [React Hooks: Not Magic, Just Arrays.](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)을 읽어보세요.

이 예제는 **React를 사용하지 않지만** `useState`가 내부적으로 어떻게 작동하는지에 대한 아이디어를 제공합니다:

<Sandpack>

```js src/index.js active
let componentHooks = [];
let currentHookIndex = 0;

// React 내부에서 useState가 작동하는 방식 (단순화됨).
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // 첫 번째 렌더링이 아니므로,
    // state 쌍이 이미 존재합니다.
    // 반환하고 다음 Hook 호출을 준비합니다.
    currentHookIndex++;
    return pair;
  }

  // 첫 번째 렌더링이므로,
  // state 쌍을 생성하고 저장합니다.
  pair = [initialState, setState];

  function setState(nextState) {
    // 사용자가 state 변경을 요청할 때,
    // 새로운 값을 쌍에 넣습니다.
    pair[0] = nextState;
    updateDOM();
  }

  // 미래의 렌더링을 위해 쌍을 저장하고
  // 다음 Hook 호출을 준비합니다.
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // 각 useState() 호출은 다음 쌍을 가져옵니다.
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // 이 예제는 React를 사용하지 않으므로
  // JSX 대신 출력
객체를 반환합니다.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Hide' : 'Show'} details`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // 렌더링 전에 현재 Hook 인덱스를 재설정합니다.
  currentHookIndex = 0;
  let output = Gallery();

  // 출력과 일치하도록 DOM을 업데이트합니다.
  // 이 부분은 React가 대신 처리합니다.
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: '콜빈은 주로 전-히스패닉 상징을 암시하는 추상적인 주제로 알려져 있지만, 이 거대한 조각상은 신경외과에 대한 경의를 표하는 그녀의 가장 잘 알려진 공공 예술 작품 중 하나입니다.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '두 손이 인간의 뇌를 섬세하게 잡고 있는 청동 조각상.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '이 거대한 (75 피트 또는 23m) 은색 꽃은 부에노스아이레스에 위치해 있습니다. 이 꽃은 저녁이나 강한 바람이 불 때 꽃잎을 닫고 아침에 다시 열리도록 설계되었습니다.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '반사되는 거울 같은 꽃잎과 강한 수술을 가진 거대한 금속 꽃 조각상.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '윌슨은 평등, 사회 정의, 인류의 본질적이고 영적인 특성에 대한 관심으로 알려져 있었습니다. 이 거대한 (7피트 또는 2.13m) 청동 조각상은 그가 "보편적인 인류애로 가득 찬 상징적인 흑인 존재"라고 묘사한 것을 나타냅니다.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '항상 존재하고 엄숙한 인간의 머리를 묘사한 조각상. 평온과 고요함을 발산합니다.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '이스터 섬에 위치한 1,000개의 모아이, 또는 현존하는 거대한 조각상은 초기 라파누이 사람들이 만든 것으로, 일부는 신격화된 조상들을 나타낸다고 믿습니다.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '엄숙한 얼굴을 가진 비율이 큰 머리를 가진 세 개의 거대한 석상.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: '나나는 여성성과 모성을 상징하는 승리의 생명체입니다. 처음에 Saint Phalle은 나나를 위해 천과 발견된 물체를 사용했으며, 나중에는 더 생생한 효과를 얻기 위해 폴리에스터를 도입했습니다.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '기쁨을 발산하는 다채로운 의상을 입은 유쾌한 춤추는 여성 형상의 큰 모자이크 조각상.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '이 추상적인 청동 조각상은 요크셔 조각 공원에 위치한 The Family of Man 시리즈의 일부입니다. Hepworth는 세상의 문자 그대로의 표현을 만들지 않고 사람과 풍경에서 영감을 받은 추상적인 형태를 개발했습니다.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '인간 형상을 연상시키는 세 개의 요소가 쌓여 있는 키 큰 조각상.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "네 세대에 걸친 목각 장인의 후손인 Fakeye의 작품은 전통적인 요루바 테마와 현대적인 요루바 테마를 혼합했습니다.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '패턴으로 장식된 말에 집중된 얼굴을 가진 전사의 정교한 목조 조각상.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow는 젊음과 아름다움의 덧없음과 취약성의 은유로서 단편적인 신체 조각으로 유명합니다. 이 조각상은 각각 약 5피트(1.5m) 높이의 매우 현실적인 큰 배 두 개를 쌓아 놓은 것을 묘사합니다.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '고전 조각의 배와는 상당히 다른 주름의 연속을 연상시키는 조각상.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '테라코타 군대는 중국의 첫 번째 황제인 진시황의 군대를 묘사한 테라코타 조각상 모음입니다. 군대는 8,000명 이상의 병사, 130대의 전차와 520마리의 말, 150마리의 기병 말로 구성되어 있었습니다.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '각각 독특한 표정과 갑옷을 가진 12개의 테라코타 전사 조각상.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson은 뉴욕시의 잔해에서 물건을 수집하여 나중에 거대한 구조물로 조립하는 것으로 유명했습니다. 이 작품에서는 침대 기둥, 저글링 핀, 좌석 조각과 같은 다양한 부분을 사용하여 큐비즘의 기하학적 공간과 형태의 추상화의 영향을 반영하는 상자에 못을 박고 접착했습니다.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '개별 요소가 처음에는 구별되지 않는 검은색 무광택 조각상.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar는 전통과 현대, 자연과 산업을 결합합니다. 그녀의 예술은 인간과 자연의 관계에 중점을 둡니다. 그녀의 작품은 추상적이면서도 구체적이고, 중력에 도전하며, "예상치 못한 재료의 훌륭한 합성"으로 묘사되었습니다.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '콘크리트 벽에 장착되어 바닥으로 내려오는 창백한 철사 같은 조각상. 가벼워 보입니다.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '타이페이 동물원은 놀이 중인 잠긴 하마를 특징으로 하는 하마 광장을 의뢰했습니다.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '수영하는 것처럼 보이는 청동 하마 조각상이 보도에서 솟아오르고 있습니다.'
}];

// 초기 상태와 일치하도록 UI를 업데이트합니다.
updateDOM();
```

```html public/index.html
<button id="nextButton">
  Next
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

React를 사용하기 위해 이해할 필요는 없지만, 이 메커니즘은 유용한 정신 모델이 될 수 있습니다.

</DeepDive>

## state는 격리되고 비공개입니다 {/*state-is-isolated-and-private*/}

state는 화면의 컴포넌트 인스턴스에 로컬입니다. 즉, **동일한 컴포넌트를 두 번 렌더링하면 각 복사본은 완전히 격리된 state를 가집니다!** 하나를 변경해도 다른 하나에 영향을 미치지 않습니다.

이 예제에서는 이전의 `Gallery` 컴포넌트를 논리 변경 없이 두 번 렌더링합니다. 각 갤러리 내부의 버튼을 클릭해 보세요. state가 독립적임을 확인할 수 있습니다:

<Sandpack>

```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}

```

```js src/Gallery.js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
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
    </section>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: '콜빈은 주로 전-히스패닉 상징을 암시하는 추상적인 주제로 알려져 있지만, 이 거대한 조각상은 신경외과에 대한 경의를 표하는 그녀의 가장 잘 알려진 공공 예술 작품 중 하나입니다.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '두 손이 인간의 뇌를 섬세하게 잡고 있는 청동 조각상.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '이 거대한 (75 피트 또는 23m) 은색 꽃은 부에노스아이레스에 위치해 있습니다. 이 꽃은 저녁이나 강한 바람이 불 때 꽃잎을 닫고 아침에 다시 열리도록 설계되었습니다.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '반사되는 거울 같은 꽃잎과 강한 수술을 가진 거대한 금속 꽃 조각상.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '윌슨은 평등, 사회 정의, 인류의 본질적이고 영적인 특성에 대한 관심으로 알려져 있었습니다. 이 거대한 (7피트 또는 2.13m) 청동 조각상은 그가 "보편적인 인류애로 가득 찬 상징적인 흑인 존재"라고 묘사한 것을 나타냅니다.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '항상 존재하고 엄숙한 인간의 머리를 묘사한 조각상. 평온과 고요함을 발산합니다.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '이스터 섬에 위치한 1,000개의 모아이, 또는 현존하는 거대한 조각상은 초기 라파누이 사람들이 만든 것으로, 일부는 신격화된 조상들을 나타낸다고 믿습니다.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '엄숙한 얼굴을 가진 비율이 큰 머리를 가진 세 개의 거대한 석상.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: '나나는 여성성과 모성을 상징하는 승리의 생명체입니다. 처음에 Saint Phalle은 나나를 위해 천과 발견된 물체를 사용했으며, 나중에는 더 생생한 효과를 얻기 위해 폴리에스터를 도입했습니다.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '기쁨을 발산하는 다채로운 의상을 입은 유쾌한 춤추는 여성 형상의 큰 모자이크 조각상.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '이 추상적인 청동 조각상은 요크셔 조각 공원에 위치한 The Family of Man 시리즈의 일부입니다. Hepworth는 세상의 문자 그대로의 표현을 만들지 않고 사람과 풍경에서 영감을 받은 추상적인 형태를 개발했습니다.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '인간 형상을 연상시키는 세 개의 요소가 쌓여 있는 키 큰 조각상.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "네 세대에 걸친 목각 장인의 후손인 Fakeye의 작품은 전통적인 요루바 테마와 현대적인 요루바 테마를 혼합했습니다.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '패턴으로 장식된 말에 집중된 얼굴을 가진 전사의 정교한 목조 조각상.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow는 젊음과 아름다움의 덧없음과 취약성의 은유로서 단편적인 신체 조각으로 유명합니다. 이 조각상은 각각 약 5피트(1.5m) 높이의 매우 현실적인 큰 배 두 개를 쌓아 놓은 것을 묘사합니다.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '고전 조각의 배와는 상당히 다른 주름의 연속을 연상시키는 조각상.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '테라코타 군대는 중국의 첫 번째 황제인 진시황의 군대를 묘사한 테라코타 조각상 모음입니다. 군대는 8,000명 이상의 병사, 130대의 전차와 520마리의 말, 150마리의 기병 말로 구성되어 있었습니다.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '각각 독특한 표정과 갑옷을 가진 12개의 테라코타 전사 조각상.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson은 뉴욕시의 잔해에서 물건을 수집하여 나중에 거대한 구조물로 조립하는 것으로 유명했습니다. 이 작품에서는 침대 기둥, 저글링 핀, 좌석 조각과 같은 다양한 부분을 사용하여 큐비즘의 기하학적 공간과 형태의 추상화의 영향을 반영하는 상자에 못을 박고 접착했습니다.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '개별 요소가 처음에는 구별되지 않는 검은색 무광택 조각상.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar는 전통과 현대, 자연과 산업을 결합합니다. 그녀의 예술은 인간과 자연의 관계에 중점을 둡니다. 그녀의 작품은 추상적이면서도 구체적이고, 중력에 도전하며, "예상치 못한 재료의 훌륭한 합성"으로 묘사되었습니다.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '콘크리트 벽에 장착되어 바닥으로 내려오는 창백한 철사 같은 조각상. 가벼워 보입니다.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '타이페이 동물원은 놀이 중인 잠긴 하마를 특징으로 하는 하마 광장을 의뢰했습니다.',
  url: 'https://i
.imgur.com/6o5Vuyu.jpg',
  alt: '수영하는 것처럼 보이는 청동 하마 조각상이 보도에서 솟아오르고 있습니다.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
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

이것이 state를 모듈 상단에 선언한 일반 변수와 다른 점입니다. state는 특정 코드 위치에 묶여 있지 않고, 화면의 특정 위치에 "로컬"로 존재합니다. 두 개의 `<Gallery />` 컴포넌트를 렌더링했기 때문에 각 컴포넌트의 state는 별도로 저장됩니다.

또한 `Page` 컴포넌트는 `Gallery`의 state에 대해 아무것도 "알지" 못하거나, state가 있는지조차 모릅니다. props와 달리, **state는 선언한 컴포넌트에 완전히 비공개입니다.** 부모 컴포넌트는 이를 변경할 수 없습니다. 이를 통해 다른 컴포넌트에 영향을 주지 않고 컴포넌트에 state를 추가하거나 제거할 수 있습니다.

두 갤러리의 state를 동기화하려면 어떻게 해야 할까요? React에서 이를 올바르게 수행하는 방법은 자식 컴포넌트에서 state를 *제거*하고 가장 가까운 공유 부모에 추가하는 것입니다. 다음 몇 페이지에서는 단일 컴포넌트의 state를 구성하는 데 중점을 두겠지만, [컴포넌트 간 state 공유](/learn/sharing-state-between-components)에서 이 주제로 다시 돌아올 것입니다.

<Recap>

* 컴포넌트가 렌더링 간에 일부 정보를 "기억"해야 할 때 state 변수를 사용합니다.
* state 변수는 `useState` Hook을 호출하여 선언됩니다.
* Hook은 `use`로 시작하는 특별한 함수입니다. 이 함수들은 state와 같은 React 기능에 "연결"할 수 있게 해줍니다.
* Hook은 import와 비슷하게 무조건적으로 호출되어야 합니다. Hook 호출, 포함 `useState`는 컴포넌트나 다른 Hook의 최상위 레벨에서만 유효합니다.
* `useState` Hook은 현재 state와 이를 업데이트하는 함수를 쌍으로 반환합니다.
* 여러 개의 state 변수를 가질 수 있습니다. 내부적으로 React는 순서에 따라 이를 매칭합니다.
* state는 컴포넌트에 비공개입니다. 두 곳에서 렌더링하면 각 복사본은 자체 state를 가집니다.

</Recap>

<Challenges>

#### 갤러리 완성하기 {/*complete-the-gallery*/}

마지막 조각상에서 "다음"을 누르면 코드가 충돌합니다. 충돌을 방지하기 위해 로직을 수정하세요. 이벤트 핸들러에 추가 로직을 추가하거나, 동작이 불가능할 때 버튼을 비활성화할 수 있습니다.

충돌을 수정한 후, 이전 조각상을 표시하는 "이전" 버튼을 추가하세요. 첫 번째 조각상에서 충돌하지 않아야 합니다.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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
  description: '콜빈은 주로 전-히스패닉 상징을 암시하는 추상적인 주제로 알려져 있지만, 이 거대한 조각상은 신경외과에 대한 경의를 표하는 그녀의 가장 잘 알려진 공공 예술 작품 중 하나입니다.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '두 손이 인간의 뇌를 섬세하게 잡고 있는 청동 조각상.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '이 거대한 (75 피트 또는 23m) 은색 꽃은 부에노스아이레스에 위치해 있습니다. 이 꽃은 저녁이나 강한 바람이 불 때 꽃잎을 닫고 아침에 다시 열리도록 설계되었습니다.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '반사되는 거울 같은 꽃잎과 강한 수술을 가진 거대한 금속 꽃 조각상.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '윌슨은 평등, 사회 정의, 인류의 본질적이고 영적인 특성에 대한 관심으로 알려져 있었습니다. 이 거대한 (7피트 또는 2.13m) 청동 조각상은 그가 "보편적인 인류애로 가득 찬 상징적인 흑인 존재"라고 묘사한 것을 나타냅니다.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '항상 존재하고 엄숙한 인간의 머리를 묘사한 조각상. 평온과 고요함을 발산합니다.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '이스터 섬에 위치한 1,000개의 모아이, 또는 현존하는 거대한 조각상은 초기 라파누이 사람들이 만든 것으로, 일부는 신격화된 조상들을 나타낸다고 믿습니다.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '엄숙한 얼굴을 가진 비율이 큰 머리를 가진 세 개의 거대한 석상.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: '나나는 여성성과 모성을 상징하는 승리의 생명체입니다. 처음에 Saint Phalle은 나나를 위해 천과 발견된 물체를 사용했으며, 나중에는 더 생생한 효과를 얻기 위해 폴리에스터를 도입했습니다.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '기쁨을 발산하는 다채로운 의상을 입은 유쾌한 춤추는 여성 형상의 큰 모자이크 조각상.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '이 추상적인 청동 조각상은 요크셔 조각 공원에 위치한 The Family of Man 시리즈의 일부입니다. Hepworth는 세상의 문자 그대로의 표현을 만들지 않고 사람과 풍경에서 영감을 받은 추상적인 형태를 개발했습니다.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '인간 형상을 연상시키는 세 개의 요소가 쌓여 있는 키 큰 조각상.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "네 세대에 걸친 목각 장인의 후손인 Fakeye의 작품은 전통적인 요루바 테마와 현대적인 요루바 테마를 혼합했습니다.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '패턴으로 장식된 말에 집중된 얼굴을 가진 전사의 정교한 목조 조각상.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow는 젊음과 아름다움의 덧없음과 취약성의 은유로서 단편적인 신체 조각으로 유명합니다. 이 조각상은 각각 약 5피트(1.5m) 높이의 매우 현실적인 큰 배 두 개를 쌓아 놓은 것을 묘사합니다.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '고전 조각의 배와는 상당히 다른 주름의 연속을 연상시키는 조각상.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '테라코타 군대는 중국의 첫 번째 황제인 진시황의 군대를 묘사한 테라코타 조각상 모음입니다. 군대는 8,000명 이상의 병사, 130대의 전차와 520마리의 말, 150마리의 기병 말로 구성되어 있었습니다.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '각각 독특한 표정과 갑옷을 가진 12개의 테라코타 전사 조각상.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson은 뉴욕시의 잔해에서 물건을 수집하여 나중에 거대한 구조물로 조립하는 것으로 유명했습니다. 이 작품에서는 침대 기둥, 저글링 핀, 좌석 조각과 같은 다양한 부분을 사용하여 큐비즘의 기하학적 공간과 형태의 추상화의 영향을 반영하는 상자에 못을 박고 접착했습니다.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '개별 요소가 처음에는 구별되지 않는 검은색 무광택 조각상.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar는 전통과 현대, 자연과 산업을 결합합니다. 그녀의 예술은 인간과 자연의 관계에 중점을 둡니다. 그녀의 작품은 추상적이면서도 구체적이고, 중력에 도전하며, "예상치 못한 재료의 훌륭한 합성"으로 묘사되었습니다.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '콘크리트 벽에 장착되어 바닥으로 내려오는 창백한 철사 같은 조각상. 가벼워 보입니다.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '타이페이 동물원은 놀이 중인 잠긴 하마를 특징으로 하는 하마 광장을 의뢰했습니다.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '수영하는 것처럼 보이는 청동 하마 조각상이 보도에서 솟아오르고 있습니다.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution>

이벤트 핸들러 내부에 보호 조건을 추가하고 필요할 때 버튼을 비활성화합니다:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Previous
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
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

```js src/data.js hidden
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: '콜빈은 주로 전-히스패닉 상징을 암시하는 추상적인 주제로 알려져 있지만, 이 거대한 조각상은 신경외과에 대한 경의를 표하는 그녀의 가장 잘 알려진 공공 예술 작품 중 하나입니다.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: '두 손이 인간의 뇌를 섬세하게 잡고 있는 청동 조각상.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: '이 거대한 (75 피트 또는 23m) 은색 꽃은 부에노스아이레스에 위치해 있습니다. 이 꽃은 저녁이나 강한 바람이 불 때 꽃잎을 닫고 아침에 다시 열리도록 설계되었습니다.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: '반사되는 거울 같은 꽃잎과 강한 수술을 가진 거대한 금속 꽃 조각상.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: '윌슨은 평등, 사회 정의, 인류의 본질적이고 영적인 특성에 대한 관심으로 알려져 있었습니다. 이 거대한 (7피트 또는 2.13m) 청동 조각상은 그가 "보편적인 인류애로 가득 찬 상징적인 흑인 존재"라고 묘사한 것을 나타냅니다.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: '항상 존재하고 엄숙한 인간의 머리를 묘사한 조각상. 평온과 고요함을 발산합니다.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: '이스터 섬에 위치한 1,000개의 모아이, 또는 현존하는 거대한 조각상은 초기 라파누이 사람들이 만든 것으로, 일부는 신격화된 조상들을 나타낸다고 믿습니다.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: '엄숙한 얼굴을 가진 비율이 큰 머리를 가진 세 개의 거대한 석상.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: '나나는 여성성과 모성을 상징하는 승리의 생명체입니다. 처음에 Saint Phalle은 나나를 위해 천과 발견된 물체를 사용했으며, 나중에는 더 생생한 효과를 얻기 위해 폴리에스터를 도입했습니다.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: '기쁨을 발산하는 다채로운 의상을 입은 유쾌한 춤추는 여성 형상의 큰 모자이크 조각상.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: '이 추상적인 청동 조각상은 요크셔 조각 공원에 위치한 The Family of Man 시리즈의 일부입니다. Hepworth는 세상의 문자 그대로의 표현을 만들지 않고 사람과 풍경에서 영감을 받은 추상적인 형태를 개발했습니다.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: '인간 형상을 연상시키는 세 개의 요소가 쌓여 있는 키 큰 조각상.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "네 세대에 걸친 목각 장인의 후손인 Fakeye의 작품은 전통적인 요루바 테마와 현대적인 요루바 테마를 혼합했습니다.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: '패턴으로 장식된 말에 집중된 얼굴을 가진 전사의 정교한 목조 조각상.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow는 젊음과 아름다움의 덧없음과 취약성의 은유로서 단편적인 신체 조각으로 유명합니다. 이 조각상은 각각 약 5피트(1.5m) 높이의 매우 현실적인 큰 배 두 개를 쌓아 놓은 것을 묘사합니다.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: '고전 조각의 배와는 상당히 다른 주름의 연속을 연상시키는 조각상.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: '테라코타 군대는 중국의 첫 번째 황제인 진시황의 군대를 묘사한 테라코타 조각상 모음입니다. 군대는 8,000명 이상의 병사, 130대의 전차와 520마리의 말, 150마리의 기병 말로 구성되어 있었습니다.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '각각 독특한 표정과 갑옷을 가진 12개의 테라코타 전사 조각상.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson은 뉴욕시의 잔해에서 물건을 수집하여 나중에 거대한 구조물로 조립하는 것으로 유명했습니다. 이 작품에서는 침대 기둥, 저글링 핀, 좌석 조각과 같은 다양한 부분을 사용하여 큐비즘의 기하학적 공간과 형태의 추상화의 영향을 반영하는 상자에 못을 박고 접착했습니다.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: '개별 요소가 처음에는 구별되지 않는 검은색 무광택 조각상.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar는 전통과 현대, 자연과 산업을 결합합니다. 그녀의 예술은 인간과 자연의 관계에 중점을 둡니다. 그녀의 작품은 추상적이면서도 구체적이고, 중력에 도전하며, "예상치 못한 재료의 훌륭한 합성"으로 묘사되었습니다.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: '콘크리트 벽에 장착되어 바닥으로 내려오는 창백한 철사 같은 조각상. 가벼워 보입니다.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: '타이페이 동물원은 놀이 중인 잠긴 하마를 특징으로 하는 하마 광장을 의뢰했습니다.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: '수영하는 것처럼 보이는 청동 하마 조각상이 보도에서 솟아오르고 있습니다.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
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

`hasPrev`와 `hasNext`가 반환된 JSX와 이벤트 핸들러 내부에서 *모두* 사용되는 방식을 주목하세요! 이 유용한 패턴은 이벤트 핸들러 함수가 렌더링 중에 선언된 모든 변수를 ["클로저"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)로 포함하기 때문에 작동합니다.

</Solution>

#### 고정된 폼 입력 수정 {/*fix-stuck-form-inputs*/}

입력 필드에 입력할 때 아무것도 나타나지 않습니다. 입력 값이 빈 문자열로 "고정"된 것 같습니다. 첫 번째 `<input>`의 `value`는 항상 `firstName` 변수와 일치하도록 설정되어 있으며, 두 번째 `<input>`의 `value`는 항상 `lastName` 변수와 일치하도록 설정되어 있습니다. 이는 올바릅니다. 두 입력 필드에는 `onChange` 이벤트 핸들러가 있으며, 이는 최신 사용자 입력(`e.target.value`)을 기반으로 변수를 업데이트하려고 합니다. 그러나 변수는 렌더링 간에 값을 "기억"하지 않는 것 같습니다. 이를 state 변수를 사용하여 수정하세요.

<Sandpack>

```js
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

<Solution>

먼저, React에서 `useState`를 가져옵니다. 그런 다음 `firstName`과 `lastName`을 `useState`를 호출하여 선언된 state 변수로 교체합니다. 마지막으로, 모든 `firstName = ...` 할당을 `setFirstName(...)`으로 교체하고, `lastName`도 동일하게 처리합니다. 리셋 버튼이 작동하도록 `handleReset`도 업데이트하는 것을 잊지 마세요.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### 충돌 수정 {/*fix-a-crash*/}

다음은 사용자가 피드백을 남길 수 있도록 하는 작은 폼입니다. 피드백이 제출되면 감사 메시지를 표시해야 합니다. 그러나 "예상보다 적은 Hook이 렌더링되었습니다"라는 오류 메시지와 함께 충돌합니다. 실수를 찾아 수정할 수 있습니까?

<Hint>

Hook을 _어디에서_ 호출할 수 있는지에 대한 제한이 있습니까? 이 컴포넌트가 어떤 규칙을 위반하고 있습니까? 린터 검사를 비활성화하는 주석이 있는지 확인하세요. 여기에서 버그가 자주 발생합니다!

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```

</Sandpack>

<Solution>

Hook은 컴포넌트 함수의 최상위 레벨에서만 호출할 수 있습니다. 여기서 첫 번째 `isSent` 정의는 이 규칙을 따르지만, `message` 정의는 조건문에 중첩되어 있습니다.

이를 조건문 밖으로 이동하여 문제를 해결하세요:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```

</Sandpack>

Hook은 무조건적으로 호출되어야 하며 항상 동일한 순서로 호출되어야 합니다!

불필요한 `else` 분기를 제거하여 중첩을 줄일 수도 있습니다. 그러나 모든 Hook 호출이 첫 번째 `return` *이전에* 발생해야 한다는 점은 여전히 중요합니다.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Sending: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```

</Sandpack>

두 번째 `useState` 호출을 `if` 조건문 뒤로 이동하면 다시 문제가 발생하는 것을 확인할 수 있습니다.

린터가 [React에 맞게 구성](/learn/editor-setup#linting)되어 있다면, 이런 실수를 할 때 린트 오류가 발생해야 합니다. 로컬에서 잘못된 코드를 시도할 때 오류가 발생하지 않으면, 프로젝트에 대한 린팅 설정이 필요합니다.

</Solution>

#### 불필요한 state 제거 {/*remove-unnecessary-state*/}

버튼을 클릭하면 이 예제는 사용자에게 이름을 묻고, 그 후에 인사말을 표시해야 합니다. state를 사용하여 이름을 유지하려고 했지만, 항상 "Hello, !"라고 표시됩니다.

이 코드를 수정하려면 불필요한 state 변수를 제거하세요. (나중에 [이것이 작동하지 않은 이유](/learn/state-as-a-snapshot)에 대해 논의할 것입니다.)

이 state 변수가 불필요했던 이유를 설명할 수 있습니까?

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('What is your name?'));
    alert(`Hello, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}
```

</Sandpack>

<Solution>

다음은 필요한 함수 내에서 선언된 일반 `name` 변수를 사용하는 수정된 버전입니다:

<Sandpack>

```js
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('What is your name?');
    alert(`Hello, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}
```

</Sandpack>

state 변수는 컴포넌트의 재렌더링 간에 정보를 유지하기 위해서만 필요합니다. 단일 이벤트 핸들러 내에서는 일반 변수가 잘 작동합니다. 일반 변수가 잘 작동할 때 state 변수를 도입하지 마세요.

</Solution>

</Challenges>