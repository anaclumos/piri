---
title: experimental_useEffectEvent
---

<Wip>

**このAPIは実験的なものであり、まだ安定版のReactでは利用できません。**

Reactパッケージを最新の実験版にアップグレードすることで試すことができます：

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Reactの実験版にはバグが含まれている可能性があります。プロダクション環境では使用しないでください。

</Wip>


<Intro>

`useEffectEvent`は、非反応的なロジックを[Effect Event](/learn/separating-events-from-effects#declaring-an-effect-event)に抽出するためのReact Hookです。

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />