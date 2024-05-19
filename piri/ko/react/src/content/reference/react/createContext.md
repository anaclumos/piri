---
title: createContext
---

<Intro>

`createContext`는 컴포넌트가 제공하거나 읽을 수 있는 [context](/learn/passing-data-deeply-with-context)를 생성할 수 있게 해줍니다.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

컴포넌트 외부에서 `createContext`를 호출하여 컨텍스트를 생성합니다.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[아래에서 더 많은 예제를 확인하세요.](#usage)

#### 매개변수 {/*parameters*/}

* `defaultValue`: 컨텍스트를 읽는 컴포넌트 위의 트리에서 일치하는 컨텍스트 제공자가 없을 때 컨텍스트가 가지길 원하는 값입니다. 의미 있는 기본값이 없다면 `null`을 지정하세요. 기본값은 "최후의 수단"으로 사용되는 폴백입니다. 이는 정적이며 시간이 지나도 변하지 않습니다.

#### 반환값 {/*returns*/}

`createContext`는 컨텍스트 객체를 반환합니다.

**컨텍스트 객체 자체는 아무 정보도 담고 있지 않습니다.** 이는 다른 컴포넌트가 읽거나 제공하는 _어떤_ 컨텍스트를 나타냅니다. 일반적으로, 컴포넌트 위에서 [`SomeContext.Provider`](#provider)를 사용하여 컨텍스트 값을 지정하고, 아래의 컴포넌트에서 [`useContext(SomeContext)`](/reference/react/useContext)를 호출하여 이를 읽습니다. 컨텍스트 객체는 몇 가지 속성을 가지고 있습니다:

* `SomeContext.Provider`는 컴포넌트에 컨텍스트 값을 제공할 수 있게 해줍니다.
* `SomeContext.Consumer`는 컨텍스트 값을 읽는 대체 방법으로, 거의 사용되지 않습니다.

---

### `SomeContext.Provider` {/*provider*/}

컨텍스트 제공자 안에 컴포넌트를 감싸서 이 컨텍스트의 값을 내부의 모든 컴포넌트에 지정합니다:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: 이 제공자 내부의 컨텍스트를 읽는 모든 컴포넌트에 전달하고자 하는 값입니다. 컨텍스트 값은 어떤 타입이든 될 수 있습니다. 제공자 내부에서 [`useContext(SomeContext)`](/reference/react/useContext)를 호출하는 컴포넌트는 위의 가장 안쪽에 있는 해당 컨텍스트 제공자의 `value`를 받습니다.

---

### `SomeContext.Consumer` {/*consumer*/}

`useContext`가 존재하기 전에, 컨텍스트를 읽는 오래된 방법이 있었습니다:

```js
function Button() {
  // 🟡 레거시 방식 (권장하지 않음)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

이 오래된 방식은 여전히 작동하지만, **새로 작성된 코드는 [`useContext()`](/reference/react/useContext)를 사용하여 컨텍스트를 읽어야 합니다:**

```js
function Button() {
  // ✅ 권장 방식
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: 함수입니다. React는 현재 컨텍스트 값을 사용하여 이 함수를 호출하고, 이 함수에서 반환하는 결과를 렌더링합니다. React는 부모 컴포넌트에서 컨텍스트가 변경될 때마다 이 함수를 다시 실행하고 UI를 업데이트합니다.

---

## 사용법 {/*usage*/}

### 컨텍스트 생성하기 {/*creating-context*/}

컨텍스트는 컴포넌트가 [깊이 있는 정보를 전달](/learn/passing-data-deeply-with-context)할 수 있게 해줍니다.

컨텍스트를 생성하려면 컴포넌트 외부에서 `createContext`를 호출합니다.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext`는 <CodeStep step={1}>컨텍스트 객체</CodeStep>를 반환합니다. 컴포넌트는 이를 [`useContext()`](/reference/react/useContext)에 전달하여 컨텍스트를 읽을 수 있습니다:

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

기본적으로, 이들이 받는 값은 컨텍스트를 생성할 때 지정한 <CodeStep step={3}>기본값</CodeStep>입니다. 그러나 기본값은 절대 변하지 않기 때문에 이것만으로는 유용하지 않습니다.

컨텍스트는 컴포넌트에서 **다른 동적 값을 제공할 수 있기 때문에 유용합니다:**

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

이제 `Page` 컴포넌트와 그 내부의 모든 컴포넌트는 전달된 컨텍스트 값을 "볼" 수 있습니다. 전달된 컨텍스트 값이 변경되면, React는 컨텍스트를 읽는 컴포넌트를 다시 렌더링합니다.

[컨텍스트 읽기 및 제공에 대해 더 읽고 예제를 확인하세요.](/reference/react/useContext)

---

### 파일에서 컨텍스트 가져오기 및 내보내기 {/*importing-and-exporting-context-from-a-file*/}

종종, 다른 파일에 있는 컴포넌트들이 동일한 컨텍스트에 접근해야 할 필요가 있습니다. 그래서 컨텍스트를 별도의 파일에 선언하는 것이 일반적입니다. 그런 다음 [`export` 문](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)을 사용하여 다른 파일에서 컨텍스트를 사용할 수 있게 합니다:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

다른 파일에 선언된 컴포넌트는 [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) 문을 사용하여 이 컨텍스트를 읽거나 제공할 수 있습니다:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

이것은 [컴포넌트를 가져오고 내보내는 것](/learn/importing-and-exporting-components)과 유사하게 작동합니다.

---

## 문제 해결 {/*troubleshooting*/}

### 컨텍스트 값을 변경할 방법을 찾을 수 없습니다 {/*i-cant-find-a-way-to-change-the-context-value*/}

이와 같은 코드는 *기본* 컨텍스트 값을 지정합니다:

```js
const ThemeContext = createContext('light');
```

이 값은 절대 변하지 않습니다. React는 일치하는 제공자를 찾을 수 없을 때만 이 값을 폴백으로 사용합니다.

컨텍스트가 시간이 지남에 따라 변경되도록 하려면, [상태를 추가하고 컴포넌트를 컨텍스트 제공자로 감싸세요.](/reference/react/useContext#updating-data-passed-via-context)