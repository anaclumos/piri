---
title: experimental_useEffectEvent
---

<Wip>

**이 API는 실험적이며 아직 안정된 버전의 React에서는 사용할 수 없습니다.**

React 패키지를 최신 실험 버전으로 업그레이드하여 시도해 볼 수 있습니다:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

실험 버전의 React는 버그가 있을 수 있습니다. 프로덕션에서는 사용하지 마세요.

</Wip>


<Intro>

`useEffectEvent`는 비반응성 로직을 [Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event)로 추출할 수 있게 해주는 React Hook입니다.

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />