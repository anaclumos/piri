---
title: 組み込みReact API
---

<Intro>

[Hooks](/reference/react)や[Components](/reference/react/components)に加えて、`react`パッケージはコンポーネントを定義するために役立ついくつかの他のAPIもエクスポートします。このページでは、残りのすべての最新のReact APIを一覧にしています。

</Intro>

---

* [`createContext`](/reference/react/createContext)は、子コンポーネントにコンテキストを定義して提供することができます。[`useContext`](/reference/react/useContext)と一緒に使用します。
* [`forwardRef`](/reference/react/forwardRef)は、コンポーネントが親にDOMノードをrefとして公開することができます。[`useRef`](/reference/react/useRef)と一緒に使用します。
* [`lazy`](/reference/react/lazy)は、コンポーネントのコードの読み込みを初めてレンダリングされるまで遅延させることができます。
* [`memo`](/reference/react/memo)は、同じpropsで再レンダリングをスキップすることができます。[`useMemo`](/reference/react/useMemo)や[`useCallback`](/reference/react/useCallback)と一緒に使用します。
* [`startTransition`](/reference/react/startTransition)は、状態の更新を緊急でないものとしてマークすることができます。[`useTransition`](/reference/react/useTransition)と似ています。

---

## リソースAPI {/*resource-apis*/}

*リソース*は、コンポーネントの状態の一部として持たなくても、コンポーネントによってアクセスされることができます。例えば、コンポーネントはPromiseからメッセージを読み取ったり、コンテキストからスタイリング情報を読み取ったりすることができます。

リソースから値を読み取るには、このAPIを使用します：

* [`use`](/reference/react/use)は、[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)や[context](/learn/passing-data-deeply-with-context)のようなリソースの値を読み取ることができます。
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```