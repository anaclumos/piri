---
title: 내장 React DOM 훅스
---

<Intro>

`react-dom` 패키지에는 웹 애플리케이션(브라우저 DOM 환경에서 실행되는)에서만 지원되는 Hooks가 포함되어 있습니다. 이러한 Hooks는 iOS, Android 또는 Windows 애플리케이션과 같은 비브라우저 환경에서는 지원되지 않습니다. 웹 브라우저 *및 다른 환경*에서 지원되는 Hooks를 찾고 있다면 [React Hooks 페이지](/reference/react)를 참조하세요. 이 페이지에는 `react-dom` 패키지의 모든 Hooks가 나열되어 있습니다.

</Intro>

---

## Form Hooks {/*form-hooks*/}

<Canary>

Form Hooks는 현재 React의 canary 및 실험적 채널에서만 사용할 수 있습니다. [React의 릴리스 채널에 대해 자세히 알아보세요](/community/versioning-policy#all-release-channels).

</Canary>

*Forms*는 정보를 제출하기 위한 인터랙티브 컨트롤을 생성할 수 있게 해줍니다. 컴포넌트에서 폼을 관리하려면 다음 Hooks 중 하나를 사용하세요:

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus)는 폼의 상태에 따라 UI를 업데이트할 수 있게 해줍니다.

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```