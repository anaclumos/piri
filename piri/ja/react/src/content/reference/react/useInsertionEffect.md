---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect`はCSS-in-JSライブラリの作者向けです。CSS-in-JSライブラリに取り組んでいてスタイルを挿入する場所が必要でない限り、おそらく[`useEffect`](/reference/react/useEffect)または[`useLayoutEffect`](/reference/react/useLayoutEffect)を使用することをお勧めします。

</Pitfall>

<Intro>

`useInsertionEffect`は、レイアウトエフェクトが発火する前にDOMに要素を挿入することを可能にします。

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

レイアウトを読み取る必要があるエフェクトが発火する前にスタイルを挿入するために`useInsertionEffect`を呼び出します：

```js
import { useInsertionEffect } from 'react';

// CSS-in-JSライブラリ内
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... ここで<style>タグを挿入 ...
  });
  return rule;
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `setup`: エフェクトのロジックを含む関数。セットアップ関数はオプションで*クリーンアップ*関数を返すこともできます。コンポーネントがDOMに追加されると、レイアウトエフェクトが発火する前にReactはセットアップ関数を実行します。依存関係が変更された再レンダリングごとに、Reactはまず古い値でクリーンアップ関数を実行し（提供されている場合）、次に新しい値でセットアップ関数を実行します。コンポーネントがDOMから削除されると、Reactはクリーンアップ関数を実行します。

* **オプション** `dependencies`: `setup`コード内で参照されるすべてのリアクティブな値のリスト。リアクティブな値には、props、state、およびコンポーネント本体内で直接宣言されたすべての変数と関数が含まれます。リンターが[React用に設定されている](/learn/editor-setup#linting)場合、すべてのリアクティブな値が依存関係として正しく指定されていることを確認します。依存関係のリストは一定数の項目を持ち、`[dep1, dep2, dep3]`のようにインラインで書かれる必要があります。Reactは[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較アルゴリズムを使用して各依存関係を以前の値と比較します。依存関係を全く指定しない場合、エフェクトはコンポーネントの再レンダリングごとに再実行されます。

#### 戻り値 {/*returns*/}

`useInsertionEffect`は`undefined`を返します。

#### 注意点 {/*caveats*/}

* エフェクトはクライアントでのみ実行されます。サーバーレンダリング中には実行されません。
* `useInsertionEffect`の内部から状態を更新することはできません。
* `useInsertionEffect`が実行される時点では、refsはまだアタッチされていません。
* `useInsertionEffect`はDOMが更新される前または後に実行される場合があります。DOMが特定の時点で更新されることに依存すべきではありません。
* 他のタイプのエフェクトとは異なり、すべてのエフェクトのクリーンアップを実行してからすべてのエフェクトのセットアップを実行するのではなく、`useInsertionEffect`は1つのコンポーネントごとにクリーンアップとセットアップを実行します。これにより、クリーンアップとセットアップ関数が「インターリーブ」されます。

---

## 使用法 {/*usage*/}

### CSS-in-JSライブラリから動的スタイルを挿入する {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

従来、ReactコンポーネントはプレーンCSSを使用してスタイルを設定していました。

```js
// JSファイル内:
<button className="success" />

// CSSファイル内:
.success { color: green; }
```

一部のチームは、CSSファイルを書く代わりにJavaScriptコード内で直接スタイルを作成することを好みます。これには通常、CSS-in-JSライブラリやツールの使用が必要です。CSS-in-JSには3つの一般的なアプローチがあります：

1. コンパイラを使用してCSSファイルに静的に抽出
2. インラインスタイル、例：`<div style={{ opacity: 1 }}>`
3. `<style>`タグのランタイム挿入

CSS-in-JSを使用する場合、最初の2つのアプローチ（静的スタイルのためのCSSファイル、動的スタイルのためのインラインスタイル）の組み合わせをお勧めします。**ランタイムの`<style>`タグ挿入は2つの理由でお勧めしません：**

1. ランタイム挿入はブラウザにスタイルを再計算させる頻度が大幅に増えます。
2. ランタイム挿入がReactライフサイクルの間違ったタイミングで発生すると非常に遅くなる可能性があります。

最初の問題は解決不可能ですが、`useInsertionEffect`は2番目の問題を解決するのに役立ちます。

レイアウトエフェクトが発火する前にスタイルを挿入するために`useInsertionEffect`を呼び出します：

```js {4-11}
// CSS-in-JSライブラリ内
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // 前述のように、ランタイムの<style>タグ挿入はお勧めしません。
    // しかし、どうしても必要な場合は、useInsertionEffectで行うことが重要です。
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

`useEffect`と同様に、`useInsertionEffect`はサーバーでは実行されません。サーバーで使用されたCSSルールを収集する必要がある場合は、レンダリング中に行うことができます：

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[ランタイム挿入を`useInsertionEffect`にアップグレードするCSS-in-JSライブラリについてさらに読む。](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### レンダリング中やuseLayoutEffectでスタイルを挿入するよりも優れている理由 {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

スタイルをレンダリング中に挿入し、Reactが[非ブロッキング更新](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)を処理している場合、ブラウザはコンポーネントツリーをレンダリングするたびに毎フレームスタイルを再計算し、これが**非常に遅くなる**可能性があります。

`useInsertionEffect`は、[`useLayoutEffect`](/reference/react/useLayoutEffect)や[`useEffect`](/reference/react/useEffect)中にスタイルを挿入するよりも優れています。なぜなら、他のエフェクトがコンポーネント内で実行される時点で、`<style>`タグがすでに挿入されていることを保証するからです。そうでなければ、通常のエフェクト内のレイアウト計算が古いスタイルのために間違ってしまいます。

</DeepDive>