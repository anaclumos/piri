---
title: React는 컴포넌트와 훅을 호출합니다.
---

<Intro>
React는 사용자 경험을 최적화하기 위해 필요할 때 컴포넌트와 Hooks를 렌더링하는 역할을 합니다. React는 선언적입니다: 컴포넌트의 로직에서 무엇을 렌더링할지 React에 지시하면, React는 사용자에게 가장 잘 보여줄 방법을 찾아냅니다.
</Intro>

<InlineToc />

---

## 컴포넌트 함수를 직접 호출하지 마세요 {/*never-call-component-functions-directly*/}
컴포넌트는 JSX에서만 사용해야 합니다. 일반 함수처럼 호출하지 마세요. React가 호출해야 합니다.

React는 [렌더링 중](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code) 컴포넌트 함수가 호출될 시점을 결정해야 합니다. React에서는 이를 JSX를 사용하여 수행합니다.

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ 좋음: 컴포넌트를 JSX에서만 사용
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 나쁨: 직접 호출하지 마세요
}
```

컴포넌트에 Hooks가 포함된 경우, 루프나 조건문에서 컴포넌트를 직접 호출하면 [Hooks 규칙](/reference/rules/rules-of-hooks)을 위반하기 쉽습니다.

React가 렌더링을 조율하게 하면 여러 가지 이점이 있습니다:

* **컴포넌트는 함수 이상의 것이 됩니다.** React는 트리에서 컴포넌트의 정체성에 연결된 Hooks를 통해 _로컬 상태_와 같은 기능을 추가할 수 있습니다.
* **컴포넌트 유형이 조정에 참여합니다.** React가 컴포넌트를 호출하게 하면 트리의 개념적 구조에 대해 더 많이 알릴 수 있습니다. 예를 들어, `<Feed>`에서 `<Profile>` 페이지로 이동할 때 React는 이를 재사용하려고 하지 않습니다.
* **React는 사용자 경험을 향상시킬 수 있습니다.** 예를 들어, 브라우저가 컴포넌트 호출 사이에 일부 작업을 수행할 수 있게 하여 큰 컴포넌트 트리를 다시 렌더링하는 것이 메인 스레드를 차단하지 않도록 할 수 있습니다.
* **더 나은 디버깅 스토리.** 라이브러리가 인식하는 일급 시민으로서의 컴포넌트가 있다면, 개발 중에 조사할 수 있는 풍부한 개발자 도구를 만들 수 있습니다.
* **더 효율적인 조정.** React는 트리에서 다시 렌더링이 필요한 컴포넌트를 정확히 결정하고 필요 없는 컴포넌트는 건너뛸 수 있습니다. 이는 앱을 더 빠르고 반응성 있게 만듭니다.

---

## Hooks를 일반 값으로 전달하지 마세요 {/*never-pass-around-hooks-as-regular-values*/}

Hooks는 컴포넌트나 Hooks 내부에서만 호출되어야 합니다. 일반 값으로 전달하지 마세요.

Hooks는 React 기능으로 컴포넌트를 확장할 수 있게 합니다. 항상 함수로 호출되어야 하며, 일반 값으로 전달되지 않아야 합니다. 이는 _로컬 추론_을 가능하게 하며, 개발자가 해당 컴포넌트를 고립된 상태에서 이해할 수 있게 합니다.

이 규칙을 위반하면 React가 컴포넌트를 자동으로 최적화하지 않습니다.

### Hook을 동적으로 변경하지 마세요 {/*dont-dynamically-mutate-a-hook*/}

Hooks는 가능한 한 "정적"이어야 합니다. 즉, 동적으로 변경하지 않아야 합니다. 예를 들어, 고차 Hooks를 작성하지 않아야 합니다:

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 나쁨: 고차 Hooks를 작성하지 마세요
  const data = useDataWithLogging();
}
```

Hooks는 불변이어야 하며 변경되지 않아야 합니다. Hook을 동적으로 변경하는 대신, 원하는 기능을 가진 정적 버전의 Hook을 만드세요.

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ 좋음: 새로운 버전의 Hook을 만드세요
}

function useDataWithLogging() {
  // ... 새로운 버전의 Hook을 만들고 여기에 로직을 인라인하세요
}
```

### Hooks를 동적으로 사용하지 마세요 {/*dont-dynamically-use-hooks*/}

Hooks도 동적으로 사용해서는 안 됩니다: 예를 들어, Hook을 값으로 전달하여 컴포넌트에서 의존성 주입을 하는 대신:

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 나쁨: Hooks를 props로 전달하지 마세요
}
```

항상 해당 컴포넌트에서 Hook 호출을 인라인하고 그 안에서 모든 로직을 처리해야 합니다.

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ 좋음: Hook을 직접 사용하세요
}

function useDataWithLogging() {
  // Hook의 동작을 변경하는 조건부 로직이 있다면, 그것은 Hook에 인라인되어야 합니다
}
```

이렇게 하면 `<Button />`을 이해하고 디버그하기가 훨씬 쉬워집니다. Hooks가 동적으로 사용되면 앱의 복잡성이 크게 증가하고 로컬 추론을 방해하여 팀의 생산성이 장기적으로 떨어집니다. 또한 Hooks는 조건부로 호출되어서는 안 된다는 [Hooks 규칙](/reference/rules/rules-of-hooks)을 실수로 위반하기 쉽게 만듭니다. 테스트를 위해 컴포넌트를 모킹해야 하는 경우, 서버를 모킹하여 미리 준비된 데이터를 응답하도록 하는 것이 더 좋습니다. 가능하다면, 앱을 엔드 투 엔드 테스트로 테스트하는 것이 더 효과적입니다.