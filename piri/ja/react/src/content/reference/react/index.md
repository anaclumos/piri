---
title: React リファレンス概要
---

<Intro>

このセクションでは、Reactを使用するための詳細なリファレンスドキュメントを提供します。Reactの紹介については、[Learn](/learn)セクションをご覧ください。

</Intro>

Reactのリファレンスドキュメントは、機能ごとに細分化されています：

## React {/*react*/}

プログラム的なReactの機能：

* [Hooks](/reference/react/hooks) - コンポーネントからさまざまなReact機能を使用します。
* [Components](/reference/react/components) - JSXで使用できる組み込みコンポーネントを文書化します。
* [APIs](/reference/react/apis) - コンポーネントを定義するのに役立つAPI。
* [Directives](/reference/rsc/directives) - React Server Componentsに対応するバンドラーに指示を提供します。

## React DOM {/*react-dom*/}

React-domには、ウェブアプリケーション（ブラウザのDOM環境で実行される）でのみサポートされる機能が含まれています。このセクションは次のように分かれています：

* [Hooks](/reference/react-dom/hooks) - ブラウザのDOM環境で実行されるウェブアプリケーション用のHooks。
* [Components](/reference/react-dom/components) - Reactはすべてのブラウザ組み込みのHTMLおよびSVGコンポーネントをサポートします。
* [APIs](/reference/react-dom) - `react-dom`パッケージには、ウェブアプリケーションでのみサポートされるメソッドが含まれています。
* [Client APIs](/reference/react-dom/client) - `react-dom/client` APIは、クライアント（ブラウザ）でReactコンポーネントをレンダリングすることを可能にします。
* [Server APIs](/reference/react-dom/server) - `react-dom/server` APIは、サーバー上でReactコンポーネントをHTMLにレンダリングすることを可能にします。

## Rules of React {/*rules-of-react*/}

Reactには、理解しやすく高品質なアプリケーションを生み出すためのパターンを表現するための慣用句（またはルール）があります：

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – 純粋性はコードを理解しやすくし、デバッグを容易にし、ReactがコンポーネントとHooksを自動的に最適化できるようにします。
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – Reactは、ユーザーエクスペリエンスを最適化するために必要に応じてコンポーネントとHooksをレンダリングします。
* [Rules of Hooks](/reference/rules/rules-of-hooks) – HooksはJavaScript関数を使用して定義されますが、呼び出し場所に制限がある特別な種類の再利用可能なUIロジックを表します。

## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - `react`パッケージからエクスポートされますが、新しく書かれたコードでの使用は推奨されません。