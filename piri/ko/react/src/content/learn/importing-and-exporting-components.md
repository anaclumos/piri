---
title: 컴포넌트 가져오기 및 내보내기
---

<Intro>

컴포넌트의 마법은 재사용성에 있습니다: 다른 컴포넌트로 구성된 컴포넌트를 만들 수 있습니다. 하지만 더 많은 컴포넌트를 중첩할수록 이를 다른 파일로 분할하는 것이 합리적일 때가 많습니다. 이렇게 하면 파일을 쉽게 스캔하고 더 많은 곳에서 컴포넌트를 재사용할 수 있습니다.

</Intro>

<YouWillLearn>

* 루트 컴포넌트 파일이 무엇인지
* 컴포넌트를 import하고 export하는 방법
* default와 named import 및 export를 언제 사용하는지
* 하나의 파일에서 여러 컴포넌트를 import하고 export하는 방법
* 컴포넌트를 여러 파일로 분할하는 방법

</YouWillLearn>

## 루트 컴포넌트 파일 {/*the-root-component-file*/}

[Your First Component](/learn/your-first-component)에서 `Profile` 컴포넌트와 이를 렌더링하는 `Gallery` 컴포넌트를 만들었습니다:

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

이들은 현재 `App.js`라는 이름의 **루트 컴포넌트 파일**에 있습니다. 설정에 따라 루트 컴포넌트가 다른 파일에 있을 수도 있습니다. Next.js와 같은 파일 기반 라우팅을 사용하는 프레임워크를 사용하면 페이지마다 루트 컴포넌트가 다를 것입니다.

## 컴포넌트 export 및 import하기 {/*exporting-and-importing-a-component*/}

미래에 랜딩 화면을 변경하여 과학 책 목록을 넣거나 모든 프로필을 다른 곳에 배치하고 싶다면 어떻게 해야 할까요? `Gallery`와 `Profile`을 루트 컴포넌트 파일에서 이동하는 것이 합리적입니다. 이렇게 하면 더 모듈화되고 다른 파일에서 재사용할 수 있습니다. 컴포넌트를 이동하는 방법은 세 단계로 이루어집니다:

1. **새로운 JS 파일을 만들어** 컴포넌트를 넣습니다.
2. **컴포넌트 함수**를 해당 파일에서 export합니다 (default 또는 named export를 사용).
3. **컴포넌트를 사용할 파일에서** import합니다 (default 또는 named import를 사용).

여기서 `Profile`과 `Gallery`는 `App.js`에서 `Gallery.js`라는 새 파일로 이동되었습니다. 이제 `App.js`를 변경하여 `Gallery.js`에서 `Gallery`를 import할 수 있습니다:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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

이 예제는 이제 두 개의 컴포넌트 파일로 나뉘어 있습니다:

1. `Gallery.js`:
     - 동일한 파일 내에서만 사용되고 export되지 않는 `Profile` 컴포넌트를 정의합니다.
     - `Gallery` 컴포넌트를 **default export**로 export합니다.
2. `App.js`:
     - `Gallery.js`에서 **default import**로 `Gallery`를 import합니다.
     - 루트 `App` 컴포넌트를 **default export**로 export합니다.

<Note>

`.js` 파일 확장자를 생략한 파일을 만날 수 있습니다:

```js 
import Gallery from './Gallery';
```

`'./Gallery.js'` 또는 `'./Gallery'` 둘 다 React에서 작동하지만, 전자는 [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) 방식에 더 가깝습니다.

</Note>

<DeepDive>

#### Default vs named exports {/*default-vs-named-exports*/}

JavaScript에서 값을 export하는 주요 방법은 default export와 named export 두 가지가 있습니다. 지금까지의 예제는 default export만 사용했습니다. 하지만 동일한 파일에서 둘 다 사용할 수 있습니다. **파일은 하나의 _default_ export만 가질 수 있지만, 원하는 만큼 _named_ export를 가질 수 있습니다.**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

컴포넌트를 export하는 방식에 따라 import하는 방식이 결정됩니다. default export를 named export처럼 import하려고 하면 오류가 발생합니다! 이 표는 이를 추적하는 데 도움이 됩니다:

| 구문           | Export 문장                           | Import 문장                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

_default_ import를 작성할 때 `import` 뒤에 원하는 이름을 넣을 수 있습니다. 예를 들어, `import Banana from './Button.js'`라고 작성해도 동일한 default export를 제공합니다. 반면, named import의 경우 이름이 양쪽에서 일치해야 합니다. 그래서 _named_ import라고 불리는 것입니다!

**파일이 하나의 컴포넌트만 export하는 경우 default export를 사용하고, 여러 컴포넌트와 값을 export하는 경우 named export를 사용하는 경우가 많습니다.** 어떤 코딩 스타일을 선호하든, 항상 컴포넌트 함수와 이를 포함하는 파일에 의미 있는 이름을 부여하세요. `export default () => {}`와 같은 이름 없는 컴포넌트는 디버깅을 어렵게 만들기 때문에 권장되지 않습니다.

</DeepDive>

## 동일한 파일에서 여러 컴포넌트 export 및 import하기 {/*exporting-and-importing-multiple-components-from-the-same-file*/}

갤러리 대신 하나의 `Profile`만 표시하고 싶다면 어떻게 해야 할까요? `Profile` 컴포넌트도 export할 수 있습니다. 하지만 `Gallery.js`에는 이미 *default* export가 있으며, _두 개의_ default export를 가질 수는 없습니다. 새로운 파일을 만들어 default export를 하거나 `Profile`에 *named* export를 추가할 수 있습니다. **파일은 하나의 default export만 가질 수 있지만, 여러 named export를 가질 수 있습니다!**

<Note>

default와 named export 간의 혼란을 줄이기 위해 일부 팀은 하나의 스타일(default 또는 named)만 고수하거나 단일 파일에서 혼합 사용을 피합니다. 자신에게 가장 잘 맞는 방식을 선택하세요!

</Note>

먼저, `Profile`을 named export로 `Gallery.js`에서 **export**합니다 (default 키워드 없이):

```js
export function Profile() {
  // ...
}
```

그런 다음, `App.js`에서 `Gallery.js`로부터 named import로 `Profile`을 **import**합니다 (중괄호 사용):

```js
import { Profile } from './Gallery.js';
```

마지막으로, `App` 컴포넌트에서 `<Profile />`을 **렌더링**합니다:

```js
export default function App() {
  return <Profile />;
}
```

이제 `Gallery.js`에는 두 개의 export가 있습니다: default `Gallery` export와 named `Profile` export. `App.js`는 둘 다 import합니다. 이 예제에서 `<Profile />`을 `<Gallery />`로 변경하고 다시 되돌려 보세요:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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

이제 default와 named export를 혼합하여 사용하고 있습니다:

* `Gallery.js`:
  - `Profile` 컴포넌트를 **`Profile`이라는 named export**로 export합니다.
  - `Gallery` 컴포넌트를 **default export**로 export합니다.
* `App.js`:
  - `Gallery.js`에서 **`Profile`이라는 named import**로 `Profile`을 import합니다.
  - `Gallery.js`에서 **default import**로 `Gallery`를 import합니다.
  - 루트 `App` 컴포넌트를 **default export**로 export합니다.

<Recap>

이 페이지에서 배운 내용:

* 루트 컴포넌트 파일이 무엇인지
* 컴포넌트를 import하고 export하는 방법
* default와 named import 및 export를 언제 어떻게 사용하는지
* 동일한 파일에서 여러 컴포넌트를 export하는 방법

</Recap>

<Challenges>

#### 컴포넌트를 더 분할하기 {/*split-the-components-further*/}

현재 `Gallery.js`는 `Profile`과 `Gallery`를 모두 export하고 있어 약간 혼란스럽습니다.

`Profile` 컴포넌트를 별도의 `Profile.js`로 이동한 다음, `App` 컴포넌트를 변경하여 `<Profile />`과 `<Gallery />`를 차례로 렌더링하세요.

`Profile`에 대해 default 또는 named export를 사용할 수 있지만, `App.js`와 `Gallery.js`에서 해당하는 import 구문을 사용해야 합니다! 위의 deep dive에서 제공된 표를 참조할 수 있습니다:

| 구문           | Export 문장                           | Import 문장                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

컴포넌트가 호출되는 곳에서 컴포넌트를 import하는 것을 잊지 마세요. `Gallery`도 `Profile`을 사용하지 않나요?

</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
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

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

한 종류의 export로 작동하게 한 후, 다른 종류의 export로 작동하게 만드세요.

<Solution>

이것은 named export를 사용한 솔루션입니다:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

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
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

이것은 default export를 사용한 솔루션입니다:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>