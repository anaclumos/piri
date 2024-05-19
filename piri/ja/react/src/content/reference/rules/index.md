---
title: React のルール
---

<Intro>
異なるプログラミング言語がそれぞれの概念を表現する方法を持っているように、Reactもパターンを理解しやすく、高品質なアプリケーションを生み出すための独自の慣用表現（またはルール）を持っています。
</Intro>

<InlineToc />

---

<Note>
ReactでUIを表現する方法について詳しく知りたい場合は、[Thinking in React](/learn/thinking-in-react)を読むことをお勧めします。
</Note>

このセクションでは、慣用的なReactコードを書くために従うべきルールについて説明します。慣用的なReactコードを書くことは、整理された、安全で、再利用可能なアプリケーションを書くのに役立ちます。これらの特性は、アプリを変更に強くし、他の開発者、ライブラリ、ツールと一緒に作業するのを容易にします。

これらのルールは**Reactのルール**として知られています。これらはガイドラインではなくルールであり、破るとアプリにバグが発生する可能性が高くなります。また、コードが非慣用的になり、理解しにくく、論理的に考えにくくなります。

Reactの[ESLintプラグイン](https://www.npmjs.com/package/eslint-plugin-react-hooks)と一緒に[Strict Mode](/reference/react/StrictMode)を使用することを強くお勧めします。Reactのルールに従うことで、これらのバグを見つけて対処し、アプリケーションを保守可能に保つことができます。

---

## コンポーネントとフックは純粋でなければならない {/*components-and-hooks-must-be-pure*/}

[コンポーネントとフックの純粋性](/reference/rules/components-and-hooks-must-be-pure)は、アプリを予測可能にし、デバッグを容易にし、Reactがコードを自動的に最適化できるようにするための重要なルールです。

* [コンポーネントは冪等でなければならない](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) – Reactコンポーネントは、入力（props、state、context）に対して常に同じ出力を返すと仮定されます。
* [副作用はレンダーの外で実行されなければならない](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – 副作用はレンダー内で実行されるべきではありません。Reactは最適なユーザー体験を提供するためにコンポーネントを複数回レンダーすることがあります。
* [Propsとstateは不変である](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – コンポーネントのpropsとstateは、単一のレンダーに対して不変のスナップショットです。直接変更しないでください。
* [フックへの戻り値と引数は不変である](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – 一度フックに渡された値は変更しないでください。JSXのpropsのように、フックに渡された値は不変になります。
* [JSXに渡された後の値は不変である](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – JSXに使用された後の値を変更しないでください。変更はJSXが作成される前に行ってください。

---

## Reactはコンポーネントとフックを呼び出す {/*react-calls-components-and-hooks*/}

[Reactはユーザー体験を最適化するために必要に応じてコンポーネントとフックをレンダーします。](/reference/rules/react-calls-components-and-hooks) これは宣言的です：コンポーネントのロジックで何をレンダーするかをReactに伝え、Reactはそれをユーザーに最適な形で表示する方法を見つけます。

* [コンポーネント関数を直接呼び出さない](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – コンポーネントはJSXでのみ使用されるべきです。通常の関数として呼び出さないでください。
* [フックを通常の値として渡さない](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – フックはコンポーネント内でのみ呼び出されるべきです。通常の値として渡さないでください。

---

## フックのルール {/*rules-of-hooks*/}

フックはJavaScript関数を使用して定義されますが、呼び出し場所に制限がある特別な種類の再利用可能なUIロジックを表します。フックを使用する際には[フックのルール](/reference/rules/rules-of-hooks)に従う必要があります。

* [フックはトップレベルでのみ呼び出す](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – ループ、条件、ネストされた関数内でフックを呼び出さないでください。代わりに、React関数のトップレベルで、早期リターンの前にフックを常に使用してください。
* [フックはReact関数からのみ呼び出す](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – 通常のJavaScript関数からフックを呼び出さないでください。