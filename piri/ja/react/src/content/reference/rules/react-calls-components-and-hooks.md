---
title: React はコンポーネントとフックを呼び出します
---

<Intro>
Reactは、ユーザーエクスペリエンスを最適化するために必要に応じてコンポーネントやHooksをレンダリングする責任があります。Reactは宣言的です：コンポーネントのロジックで何をレンダリングするかをReactに伝えると、Reactはそれをユーザーに最適に表示する方法を見つけ出します。
</Intro>

<InlineToc />

---

## コンポーネント関数を直接呼び出さない {/*never-call-component-functions-directly*/}
コンポーネントはJSXでのみ使用するべきです。通常の関数として呼び出さないでください。Reactがそれを呼び出すべきです。

Reactは[レンダリング中](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code)にコンポーネント関数が呼び出されるタイミングを決定する必要があります。Reactでは、これをJSXを使用して行います。

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ 良い: コンポーネントはJSXでのみ使用する
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 悪い: 直接呼び出さない
}
```

コンポーネントがHooksを含む場合、ループや条件付きでコンポーネントを直接呼び出すと[Hooksのルール](/reference/rules/rules-of-hooks)に違反しやすくなります。

Reactにレンダリングを調整させることで、いくつかの利点があります：

* **コンポーネントは関数以上のものになる。** Reactは、ツリー内のコンポーネントのアイデンティティに結びついたHooksを通じて_ローカルステート_のような機能を追加できます。
* **コンポーネントタイプは調整に参加する。** Reactにコンポーネントを呼び出させることで、ツリーの概念的な構造についても伝えることができます。例えば、`<Feed>`から`<Profile>`ページに移動する際、Reactはそれらを再利用しようとはしません。
* **Reactはユーザーエクスペリエンスを向上させることができる。** 例えば、ブラウザがコンポーネント呼び出しの間にいくつかの作業を行うことができ、大きなコンポーネントツリーの再レンダリングがメインスレッドをブロックしないようにします。
* **より良いデバッグストーリー。** コンポーネントがライブラリに認識される一級市民である場合、開発中の内省のための豊富な開発者ツールを構築できます。
* **より効率的な調整。** Reactはツリー内で再レンダリングが必要なコンポーネントを正確に決定し、必要のないものをスキップできます。これにより、アプリがより速く、よりスナッピーになります。

---

## Hooksを通常の値として渡さない {/*never-pass-around-hooks-as-regular-values*/}

HooksはコンポーネントやHooksの内部でのみ呼び出すべきです。通常の値として渡さないでください。

HooksはReactの機能でコンポーネントを拡張することを可能にします。常に関数として呼び出されるべきであり、通常の値として渡されるべきではありません。これにより、_ローカルな推論_、つまり開発者がそのコンポーネントを孤立して見たときにそのコンポーネントが何をするかを理解する能力が可能になります。

このルールを破ると、Reactはコンポーネントを自動的に最適化しなくなります。

### Hookを動的に変更しない {/*dont-dynamically-mutate-a-hook*/}

Hooksはできるだけ「静的」であるべきです。つまり、動的に変更しないでください。例えば、高次Hooksを書かないでください：

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 悪い: 高次Hooksを書かない
  const data = useDataWithLogging();
}
```

Hooksは不変であり、変更されるべきではありません。Hookを動的に変更する代わりに、望ましい機能を持つ静的なバージョンのHookを作成してください。

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ 良い: 新しいバージョンのHookを作成する
}

function useDataWithLogging() {
  // ... 新しいバージョンのHookを作成し、ここにロジックをインライン化する
}
```

### Hooksを動的に使用しない {/*dont-dynamically-use-hooks*/}

Hooksも動的に使用すべきではありません：例えば、Hookを値として渡してコンポーネントで依存性注入を行う代わりに：

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 悪い: Hooksをpropsとして渡さない
}
```

常にそのコンポーネント内でHookの呼び出しをインライン化し、そこでロジックを処理してください。

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ 良い: Hookを直接使用する
}

function useDataWithLogging() {
  // Hookの動作を変更するための条件付きロジックがある場合、それはHookにインライン化されるべきです
}
```

このようにすると、`<Button />`ははるかに理解しやすく、デバッグしやすくなります。Hooksが動的に使用されると、アプリの複雑さが大幅に増し、ローカルな推論を妨げ、長期的にはチームの生産性が低下します。また、Hooksは条件付きで呼び出されるべきではないという[Hooksのルール](/reference/rules/rules-of-hooks)を誤って破りやすくなります。テストのためにコンポーネントをモックする必要がある場合、代わりにサーバーをモックして缶詰データで応答させる方が良いです。可能であれば、エンドツーエンドテストでアプリをテストする方が通常は効果的です。