---
title: Hooks의 규칙
---

<Intro>
Hooks는 JavaScript 함수로 정의되지만, 호출할 수 있는 위치에 제한이 있는 특별한 유형의 재사용 가능한 UI 로직을 나타냅니다.
</Intro>

<InlineToc />

---

##  최상위 레벨에서만 Hooks 호출하기 {/*only-call-hooks-at-the-top-level*/}

이름이 `use`로 시작하는 함수는 React에서 [*Hooks*](/reference/react)라고 합니다.

**Hooks를 루프, 조건문, 중첩 함수 또는 `try`/`catch`/`finally` 블록 내에서 호출하지 마세요.** 대신 항상 React 함수의 최상위 레벨에서, 조기 반환 전에 Hooks를 사용하세요. Hooks는 React가 함수 컴포넌트를 렌더링하는 동안에만 호출할 수 있습니다:

* ✅ [함수 컴포넌트](/learn/your-first-component) 본문의 최상위 레벨에서 호출하세요.
* ✅ [커스텀 Hook](/learn/reusing-logic-with-custom-hooks) 본문의 최상위 레벨에서 호출하세요.

```js{2-3,8-9}
function Counter() {
  // ✅ 좋음: 함수 컴포넌트의 최상위 레벨에서
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ 좋음: 커스텀 Hook의 최상위 레벨에서
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

다른 경우에 Hooks(이름이 `use`로 시작하는 함수)를 호출하는 것은 **지원되지 않습니다**, 예를 들어:

* 🔴 조건문이나 루프 내에서 Hooks를 호출하지 마세요.
* 🔴 조건부 `return` 문 이후에 Hooks를 호출하지 마세요.
* 🔴 이벤트 핸들러 내에서 Hooks를 호출하지 마세요.
* 🔴 클래스 컴포넌트 내에서 Hooks를 호출하지 마세요.
* 🔴 `useMemo`, `useReducer`, 또는 `useEffect`에 전달된 함수 내에서 Hooks를 호출하지 마세요.
* 🔴 `try`/`catch`/`finally` 블록 내에서 Hooks를 호출하지 마세요.

이 규칙을 어기면 다음과 같은 오류가 발생할 수 있습니다.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 나쁨: 조건문 내에서 (수정하려면 밖으로 이동하세요!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 나쁨: 루프 내에서 (수정하려면 밖으로 이동하세요!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 나쁨: 조건부 반환 이후 (수정하려면 반환 이전으로 이동하세요!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 나쁨: 이벤트 핸들러 내에서 (수정하려면 밖으로 이동하세요!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 나쁨: useMemo 내에서 (수정하려면 밖으로 이동하세요!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 나쁨: 클래스 컴포넌트 내에서 (수정하려면 클래스 대신 함수 컴포넌트를 작성하세요!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 나쁨: try/catch/finally 블록 내에서 (수정하려면 밖으로 이동하세요!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

이러한 실수를 잡기 위해 [`eslint-plugin-react-hooks` 플러그인](https://www.npmjs.com/package/eslint-plugin-react-hooks)을 사용할 수 있습니다.

<Note>

[커스텀 Hooks](/learn/reusing-logic-with-custom-hooks)는 다른 Hooks를 호출할 *수 있습니다* (그것이 커스텀 Hooks의 전체 목적입니다). 이는 커스텀 Hooks도 함수 컴포넌트가 렌더링되는 동안에만 호출되어야 하기 때문에 작동합니다.

</Note>

---

## React 함수에서만 Hooks 호출하기 {/*only-call-hooks-from-react-functions*/}

일반 JavaScript 함수에서 Hooks를 호출하지 마세요. 대신, 다음과 같이 할 수 있습니다:

✅ React 함수 컴포넌트에서 Hooks를 호출하세요.
✅ [커스텀 Hooks](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)에서 Hooks를 호출하세요.

이 규칙을 따르면 컴포넌트의 모든 상태 로직이 소스 코드에서 명확하게 보이게 됩니다.

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ 컴포넌트나 커스텀 Hook이 아닙니다!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```