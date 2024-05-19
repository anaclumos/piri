---
title: React v18.0
author: The React Team
date: 2022/03/08
description: React 18は現在npmで利用可能です！前回の投稿では、アプリをReact 18にアップグレードするためのステップバイステップの手順を共有しました。今回の投稿では、React 18の新機能とその将来への影響について概説します。
---

2022年3月29日 [The React Team](/community/team)

---

<Intro>

React 18がnpmで利用可能になりました！前回の投稿では、[アプリをReact 18にアップグレードするためのステップバイステップの手順](/blog/2022/03/08/react-18-upgrade-guide)を共有しました。今回の投稿では、React 18の新機能とその将来への影響について概観します。

</Intro>

---

最新のメジャーバージョンには、自動バッチ処理、startTransitionのような新しいAPI、Suspenseをサポートするストリーミングサーバーサイドレンダリングなどの改善が含まれています。

React 18の多くの機能は、新しいコンカレントレンダラーの上に構築されています。これは、強力な新機能を解放する舞台裏の変更です。コンカレントReactはオプトインであり、コンカレント機能を使用する場合にのみ有効になりますが、アプリケーションの構築方法に大きな影響を与えると考えています。

私たちは、Reactでのコンカレント処理のサポートを研究し、開発するために何年も費やしてきました。そして、既存のユーザーが段階的に採用できるように特別な配慮をしました。昨年の夏、[React 18 Working Groupを結成](/blog/2021/06/08/the-plan-for-react-18)し、コミュニティの専門家からフィードバックを集め、Reactエコシステム全体のスムーズなアップグレード体験を確保しました。

見逃した場合のために、React Conf 2021でこのビジョンの多くを共有しました：

* [基調講演](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)では、React 18が開発者が素晴らしいユーザー体験を構築するのを容易にするという私たちの使命にどのように適合するかを説明しています
* [Shruti Kapoor](https://twitter.com/shrutikapoor08)は、[React 18の新機能の使い方をデモンストレーション](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)しました
* [Shaundai Person](https://twitter.com/shaundai)は、[Suspenseを使用したストリーミングサーバーレンダリングの概要](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)を説明しました

以下は、Concurrent Renderingから始まるこのリリースで期待できることの全体的な概要です。

<Note>

React Nativeユーザー向けに、React 18は新しいReact Nativeアーキテクチャと共にReact Nativeに搭載されます。詳細については、[React Conf基調講演](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)をご覧ください。

</Note>

## Concurrent Reactとは？ {/*what-is-concurrent-react*/}

React 18で最も重要な追加機能は、考える必要がないことを願っているものです：コンカレンシー。これはアプリケーション開発者にとってはほとんど当てはまると考えていますが、ライブラリメンテナにとっては少し複雑かもしれません。

コンカレンシーは機能そのものではありません。これは、Reactが同時に複数のバージョンのUIを準備できるようにする新しい舞台裏のメカニズムです。コンカレンシーは実装の詳細と考えることができます。それが価値があるのは、それが解放する機能のためです。Reactは、優先度キューや複数のバッファリングなどの高度な技術を内部実装で使用していますが、これらの概念は公開APIには現れません。

APIを設計する際には、開発者から実装の詳細を隠すように努めています。React開発者としては、ユーザー体験がどのように見えるべきかに焦点を当て、Reactがその体験を提供する方法を処理します。したがって、React開発者がコンカレンシーがどのように機能するかを知る必要はないと考えています。

しかし、Concurrent Reactは通常の実装の詳細よりも重要です。これはReactのコアレンダリングモデルへの基礎的なアップデートです。したがって、コンカレンシーがどのように機能するかを知ることはそれほど重要ではありませんが、高レベルでそれが何であるかを知る価値はあるかもしれません。

Concurrent Reactの重要な特性の一つは、レンダリングが中断可能であることです。React 18に最初にアップグレードしたとき、コンカレント機能を追加する前は、更新は以前のバージョンのReactと同じように単一の中断されない同期トランザクションでレンダリングされます。同期レンダリングでは、更新がレンダリングを開始すると、ユーザーが画面上で結果を見るまで何も中断できません。

コンカレントレンダリングでは、これは常に当てはまるわけではありません。Reactは更新のレンダリングを開始し、中断し、後で続行することがあります。進行中のレンダリングを完全に放棄することさえあります。Reactは、レンダリングが中断されてもUIが一貫して表示されることを保証します。これを行うために、ツリー全体が評価された後にDOMの変異を実行します。この機能により、Reactはメインスレッドをブロックせずにバックグラウンドで新しい画面を準備できます。これにより、大規模なレンダリングタスクの途中でもUIがユーザー入力に即座に応答し、スムーズなユーザー体験を実現します。

もう一つの例は再利用可能な状態です。Concurrent Reactは、UIのセクションを画面から削除し、以前の状態を再利用しながら後で再追加できます。例えば、ユーザーが画面からタブを離れて戻ると、Reactは以前の画面を以前の状態で復元できるはずです。今後のマイナーリリースでは、このパターンを実装する新しいコンポーネント<Offscreen>を追加する予定です。同様に、Offscreenを使用して新しいUIをバックグラウンドで準備し、ユーザーが表示する前に準備することができます。

コンカレントレンダリングはReactの強力な新しいツールであり、Suspense、トランジション、ストリーミングサーバーレンダリングなどのほとんどの新機能はこれを活用するように設計されています。しかし、React 18はこの新しい基盤の上に構築することを目指す始まりに過ぎません。

## コンカレント機能の段階的な採用 {/*gradually-adopting-concurrent-features*/}

技術的には、コンカレントレンダリングは破壊的な変更です。コンカレントレンダリングが中断可能であるため、コンポーネントは有効になったときにわずかに異なる動作をします。

テストでは、数千のコンポーネントをReact 18にアップグレードしました。ほとんどの既存のコンポーネントは、コンカレントレンダリングで変更なしに「そのまま動作」することがわかりました。しかし、一部のコンポーネントは追加の移行作業が必要な場合があります。変更は通常小さいですが、自分のペースで行うことができます。React 18の新しいレンダリング動作は、新機能を使用するアプリの部分でのみ有効になります。

全体的なアップグレード戦略は、既存のコードを壊さずにアプリケーションをReact 18で動作させることです。その後、自分のペースでコンカレント機能を段階的に追加し始めることができます。開発中にコンカレンシー関連のバグを表面化させるために[`<StrictMode>`](/reference/react/StrictMode)を使用できます。Strict Modeは本番環境の動作には影響しませんが、開発中には追加の警告をログに記録し、冪等性が期待される関数を二重に呼び出します。すべてをキャッチするわけではありませんが、最も一般的なタイプのミスを防ぐのに効果的です。

React 18にアップグレードした後、すぐにコンカレント機能を使用し始めることができます。例えば、startTransitionを使用して、ユーザー入力をブロックせずに画面間をナビゲートできます。また、useDeferredValueを使用して高価な再レンダリングをスロットルできます。

しかし、長期的には、コンカレント機能をアプリに追加する主な方法は、コンカレント対応のライブラリやフレームワークを使用することになると予想しています。ほとんどの場合、コンカレントAPIと直接対話することはありません。例えば、開発者が新しい画面にナビゲートするたびにstartTransitionを呼び出す代わりに、ルーターライブラリがナビゲーションを自動的にstartTransitionでラップします。

ライブラリがコンカレント互換にアップグレードするには時間がかかるかもしれません。ライブラリがコンカレント機能を活用しやすくするために新しいAPIを提供しました。その間、Reactエコシステムを段階的に移行するためにメンテナに忍耐を持ってください。

詳細については、以前の投稿を参照してください：[React 18へのアップグレード方法](/blog/2022/03/08/react-18-upgrade-guide)。

## データフレームワークにおけるSuspense {/*suspense-in-data-frameworks*/}

React 18では、Relay、Next.js、Hydrogen、Remixのような意見のあるフレームワークでデータフェッチングのために[Suspense](/reference/react/Suspense)を使用し始めることができます。アドホックなデータフェッチングでSuspenseを使用することは技術的には可能ですが、一般的な戦略としてはまだ推奨されていません。

将来的には、意見のあるフレームワークを使用せずにSuspenseでデータにアクセスしやすくする追加のプリミティブを公開するかもしれません。しかし、Suspenseはアプリケーションのアーキテクチャに深く統合されていると最も効果的です：ルーター、データレイヤー、サーバーレンダリング環境。したがって、長期的には、ライブラリやフレームワークがReactエコシステムで重要な役割を果たすと予想しています。

以前のバージョンのReactと同様に、React.lazyを使用してクライアントでコード分割のためにSuspenseを使用することもできます。しかし、Suspenseのビジョンはコードの読み込み以上のものであり、最終的には同じ宣言的なSuspenseフォールバックが任意の非同期操作（コード、データ、画像の読み込みなど）を処理できるようにすることを目指しています。

## Server Componentsはまだ開発中です {/*server-components-is-still-in-development*/}

[**Server Components**](/blog/2020/12/21/data-fetching-with-react-server-components)は、クライアントとサーバーをまたいでアプリを構築し、クライアントサイドアプリの豊かなインタラクティビティと従来のサーバーレンダリングのパフォーマンス向上を組み合わせることができる新機能です。Server Componentsは本質的にConcurrent Reactと結びついているわけではありませんが、Suspenseやストリーミングサーバーレンダリングのようなコンカレント機能と最もよく連携するように設計されています。

Server Componentsはまだ実験的ですが、18.xのマイナーリリースで初期バージョンをリリースする予定です。その間、Next.js、Hydrogen、Remixのようなフレームワークと協力して提案を進め、広範な採用に向けて準備を進めています。

## React 18の新機能 {/*whats-new-in-react-18*/}

### 新機能: 自動バッチ処理 {/*new-feature-automatic-batching*/}

バッチ処理とは、複数の状態更新を1つの再レンダリングにグループ化してパフォーマンスを向上させることです。自動バッチ処理がない場合、Reactイベントハンドラ内でのみ更新がバッチ処理されました。Promise、setTimeout、ネイティブイベントハンドラ、その他のイベント内の更新はデフォルトでReactではバッチ処理されませんでした。自動バッチ処理により、これらの更新は自動的にバッチ処理されます：

```js
// Before: only React events were batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

詳細については、[React 18での自動バッチ処理によるレンダリングの削減](https://github.com/reactwg/react-18/discussions/21)の投稿を参照してください。

### 新機能: トランジション {/*new-feature-transitions*/}

トランジションは、緊急の更新と非緊急の更新を区別するためのReactの新しい概念です。

* **緊急の更新**は、タイピング、クリック、押すなどの直接的なインタラクションを反映します。
* **トランジションの更新**は、UIをあるビューから別のビューに移行させます。

タイピング、クリック、押すなどの緊急の更新は、物理的なオブジェクトの動作に関する直感に一致するために即座の応答が必要です。そうでなければ「間違っている」と感じます。しかし、トランジションは異なります。ユーザーは画面上のすべての中間値を見ることを期待していません。

例えば、ドロップダウンでフィルターを選択するとき、フィルターボタン自体はクリックしたときに即座に応答することを期待します。しかし、実際の結果は別々にトランジションすることがあります。小さな遅延は目立たず、しばしば期待されます。そして、結果がレンダリングされる前にフィルターを再度変更した場合、最新の結果だけを見たいと思います。

通常、最良のユーザー体験のためには、単一のユーザー入力が緊急の更新と非緊急の更新の両方を引き起こすべきです。入力イベント内でstartTransition APIを使用して、どの更新が緊急でどれが「トランジション」であるかをReactに通知できます：

```js
import { startTransition } from 'react';

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});
```

startTransitionでラップされた更新は非緊急として処理され、クリックやキー入力などのより緊急の更新が入ると中断されます。トランジションがユーザーによって中断された場合（例えば、連続して複数の文字を入力する場合）、Reactは完了していない古いレンダリング作業を破棄し、最新の更新のみをレンダリングします。

* `useTransition`: トランジションを開始するためのフックで、保留状態を追跡する値を含みます。
* `startTransition`: フックを使用できない場合にトランジションを開始するメソッド。

トランジションはコンカレントレンダリングにオプトインし、更新が中断可能になります。コンテンツが再度サスペンドされる場合、トランジションはReactに現在のコンテンツを表示し続けるように指示し、バックグラウンドでトランジ
ションコンテンツをレンダリングします（詳細については[Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)を参照してください）。

[トランジションのドキュメントはこちら](/reference/react/useTransition)。

### 新しいSuspense機能 {/*new-suspense-features*/}

Suspenseを使用すると、まだ表示準備ができていないコンポーネントツリーの一部のローディング状態を宣言的に指定できます：

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

Suspenseは、Reactのプログラミングモデルにおいて「UIのローディング状態」を一級の宣言的な概念にします。これにより、上位の機能をその上に構築することができます。

数年前に限定版のSuspenseを導入しました。しかし、唯一サポートされていたユースケースはReact.lazyを使用したコード分割であり、サーバーでのレンダリング時には全くサポートされていませんでした。

React 18では、サーバーでのSuspenseのサポートを追加し、コンカレントレンダリング機能を使用してその機能を拡張しました。

React 18のSuspenseは、トランジションAPIと組み合わせると最も効果的です。トランジション中にサスペンドすると、Reactは既に表示されているコンテンツがフォールバックに置き換えられるのを防ぎます。代わりに、Reactは十分なデータがロードされるまでレンダリングを遅らせ、悪いローディング状態を防ぎます。

詳細については、[React 18のSuspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)を参照してください。

### 新しいクライアントおよびサーバーレンダリングAPI {/*new-client-and-server-rendering-apis*/}

このリリースでは、クライアントおよびサーバーでのレンダリングに公開するAPIを再設計する機会を得ました。これらの変更により、React 17モードで古いAPIを使用し続けながら、React 18の新しいAPIにアップグレードすることができます。

#### React DOM Client {/*react-dom-client*/}

これらの新しいAPIは`react-dom/client`からエクスポートされます：

* `createRoot`: `render`または`unmount`するための新しいメソッド。`ReactDOM.render`の代わりに使用します。React 18の新機能はこれなしでは動作しません。
* `hydrateRoot`: サーバーレンダリングされたアプリケーションをハイドレートするための新しいメソッド。新しいReact DOM Server APIと組み合わせて`ReactDOM.hydrate`の代わりに使用します。React 18の新機能はこれなしでは動作しません。

`createRoot`と`hydrateRoot`の両方は、レンダリングまたはハイドレーション中にエラーから回復する際に通知を受けたい場合に使用する新しいオプション`onRecoverableError`を受け入れます。デフォルトでは、Reactは[`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError)または古いブラウザでは`console.error`を使用します。

[React DOM Clientのドキュメントはこちら](/reference/react-dom/client)。

#### React DOM Server {/*react-dom-server*/}

これらの新しいAPIは`react-dom/server`からエクスポートされ、サーバーでのストリーミングSuspenseを完全にサポートします：

* `renderToPipeableStream`: Node環境でのストリーミング用。
* `renderToReadableStream`: DenoやCloudflare workersなどの最新のエッジランタイム環境用。

既存の`renderToString`メソッドは引き続き動作しますが、推奨されません。

[React DOM Serverのドキュメントはこちら](/reference/react-dom/server)。

### 新しいStrict Modeの動作 {/*new-strict-mode-behaviors*/}

将来的には、Reactが状態を保持しながらUIのセクションを追加および削除できる機能を追加したいと考えています。例えば、ユーザーが画面からタブを離れて戻ると、Reactは以前の画面を即座に表示できるはずです。これを行うために、Reactは以前と同じコンポーネント状態を使用してツリーをアンマウントおよびリマウントします。

この機能により、Reactアプリはデフォルトでより良いパフォーマンスを発揮しますが、エフェクトが複数回マウントおよび破棄されることに対してコンポーネントが耐性を持つ必要があります。ほとんどのエフェクトは変更なしで動作しますが、一部のエフェクトは一度だけマウントまたは破棄されることを前提としています。

これらの問題を表面化させるために、React 18ではStrict Modeに新しい開発専用のチェックを導入しました。この新しいチェックは、コンポーネントが初めてマウントされるたびに自動的にアンマウントおよびリマウントし、2回目のマウント時に以前の状態を復元します。

この変更の前に、Reactはコンポーネントをマウントし、エフェクトを作成しました：

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
```

React 18のStrict Modeでは、Reactは開発モードでコンポーネントのアンマウントおよびリマウントをシミュレートします：

```
* React mounts the component.
  * Layout effects are created.
  * Effects are created.
* React simulates unmounting the component.
  * Layout effects are destroyed.
  * Effects are destroyed.
* React simulates mounting the component with the previous state.
  * Layout effects are created.
  * Effects are created.
```

[再利用可能な状態を確保するためのドキュメントはこちら](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development)。

### 新しいHooks {/*new-hooks*/}

#### useId {/*useid*/}

`useId`は、クライアントとサーバーの両方で一意のIDを生成し、ハイドレーションの不一致を回避するための新しいフックです。これは、アクセシビリティAPIと統合するコンポーネントライブラリに主に役立ちます。これはReact 17およびそれ以前のバージョンで既に存在する問題を解決しますが、新しいストリーミングサーバーレンダラーがHTMLを順不同で配信するため、React 18ではさらに重要です。[ドキュメントはこちら](/reference/react/useId)。

> 注意
>
> `useId`は[リスト内のキー](/learn/rendering-lists#where-to-get-your-key)を生成するためのものではありません。キーはデータから生成する必要があります。

#### useTransition {/*usetransition*/}

`useTransition`と`startTransition`は、一部の状態更新を緊急でないものとしてマークすることができます。他の状態更新はデフォルトで緊急と見なされます。Reactは、緊急の状態更新（例えば、テキスト入力の更新）が非緊急の状態更新（例えば、検索結果のリストのレンダリング）を中断できるようにします。[ドキュメントはこちら](/reference/react/useTransition)。

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue`は、ツリーの非緊急部分の再レンダリングを遅延させることができます。これはデバウンスに似ていますが、いくつかの利点があります。固定の時間遅延がないため、Reactは最初のレンダリングが画面に反映された直後に遅延レンダリングを試みます。遅延レンダリングは中断可能であり、ユーザー入力をブロックしません。[ドキュメントはこちら](/reference/react/useDeferredValue)。

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore`は、外部ストアが更新を同期的に強制することでコンカレントリードをサポートできるようにする新しいフックです。外部データソースへのサブスクリプションを実装する際にuseEffectを使用する必要がなくなり、Reactと統合するライブラリに推奨されます。[ドキュメントはこちら](/reference/react/useSyncExternalStore)。

> 注意
>
> `useSyncExternalStore`はライブラリによって使用されることを意図しており、アプリケーションコードではありません。

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect`は、CSS-in-JSライブラリがレンダリング時にスタイルを挿入するパフォーマンスの問題に対処するための新しいフックです。CSS-in-JSライブラリを既に構築していない限り、これを使用することはないと予想しています。このフックは、DOMが変異した後、レイアウトエフェクトが新しいレイアウトを読み取る前に実行されます。これはReact 17およびそれ以前のバージョンで既に存在する問題を解決しますが、Reactがコンカレントレンダリング中にブラウザに譲歩し、レイアウトを再計算する機会を与えるため、React 18ではさらに重要です。[ドキュメントはこちら](/reference/react/useInsertionEffect)。

> 注意
>
> `useInsertionEffect`はライブラリによって使用されることを意図しており、アプリケーションコードではありません。

## アップグレード方法 {/*how-to-upgrade*/}

ステップバイステップの手順と破壊的変更および注目すべき変更の完全なリストについては、[React 18へのアップグレード方法](/blog/2022/03/08/react-18-upgrade-guide)を参照してください。

## 変更履歴 {/*changelog*/}

### React {/*react*/}

* 緊急の更新とトランジションを分離するために`useTransition`と`useDeferredValue`を追加しました。([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), and [@sebmarkbage](https://github.com/sebmarkbage))
* 一意のIDを生成するために`useId`を追加しました。([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), and [@sebmarkbage](https://github.com/sebmarkbage))
* 外部ストアライブラリがReactと統合するのを支援するために`useSyncExternalStore`を追加しました。([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@drarmstr](https://github.com/drarmstr))
* 保留フィードバックなしで`useTransition`のバージョンとして`startTransition`を追加しました。([#19696](https://github.com/facebook/react/pull/19696)  by [@rickhanlonii](https://github.com/rickhanlonii))
* CSS-in-JSライブラリのために`useInsertionEffect`を追加しました。([#21913](https://github.com/facebook/react/pull/21913)  by [@rickhanlonii](https://github.com/rickhanlonii))
* コンテンツが再表示されるときにSuspenseがレイアウトエフェクトをリマウントするようにしました。([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@lunaruan](https://github.com/lunaruan))
* `<StrictMode>`がエフェクトを再実行して再利用可能な状態をチェックするようにしました。([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418)  by [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* シンボルが常に利用可能であると仮定します。([#23348](https://github.com/facebook/react/pull/23348)  by [@sebmarkbage](https://github.com/sebmarkbage))
* `object-assign`ポリフィルを削除しました。([#23351](https://github.com/facebook/react/pull/23351)  by [@sebmarkbage](https://github.com/sebmarkbage))
* サポートされていない`unstable_changedBits` APIを削除しました。([#20953](https://github.com/facebook/react/pull/20953)  by [@acdlite](https://github.com/acdlite))
* コンポーネントが未定義をレンダリングできるようにしました。([#21869](https://github.com/facebook/react/pull/21869)  by [@rickhanlonii](https://github.com/rickhanlonii))
* クリックなどの離散イベントからの`useEffect`を同期的にフラッシュします。([#21150](https://github.com/facebook/react/pull/21150)  by [@acdlite](https://github.com/acdlite))
* Suspenseの`fallback={undefined}`が`null`と同じように動作し、無視されないようにしました。([#21854](https://github.com/facebook/react/pull/21854)  by [@rickhanlonii](https://github.com/rickhanlonii))
* すべての`lazy()`が同じコンポーネントに解決されると見なします。([#20357](https://github.com/facebook/react/pull/20357)  by [@sebmarkbage](https://github.com/sebmarkbage))
* 最初のレンダリング中にコンソールをパッチしないようにしました。([#22308](https://github.com/facebook/react/pull/22308)  by [@lunaruan](https://github.com/lunaruan))
* メモリ使用量を改善しました。([#21039](https://github.com/facebook/react/pull/21039)  by [@bgirard](https://github.com/bgirard))
* 文字列強制が失敗した場合のメッセージを改善しました（Temporal.*, Symbolなど）。([#22064](https://github.com/facebook/react/pull/22064)  by [@justingrant](https://github.com/justingrant))
* `MessageChannel`よりも利用可能な場合は`setImmediate`を使用します。([#20834](https://github.com/facebook/react/pull/20834)  by [@gaearon](https://github.com/gaearon))
* サスペンドされたツリー内でコンテキストが伝播しない問題を修正しました。([#23095](https://github.com/facebook/react/pull/23095)  by [@gaearon](https://github.com/gaearon))
* `useReducer`が誤ったプロップを観察する問題を修正し、早期バイアウトメカニズムを削除しました。([#22445](https://github.com/facebook/react/pull/22445)  by [@josephsavona](https://github.com/josephsavona))
* Safariでiframeを追加する際に`setState`が無視される問題を修正しました。([#23111](https://github.com/facebook/react/pull/23111)  by [@gaearon](https://github.com/gaearon))
* ツリー内で`ZonedDateTime`をレンダリングする際のクラッシュを修正しました。([#20617](https://github.com/facebook/react/pull/20617)  by [@dimaqq](https://github.com/dimaqq))
* テストでドキュメントが`null`に設定されている場合のクラッシュを修正しました。([#22695](https://github.com/facebook/react/pull/22695)  by [@SimenB](https://github.com/SimenB))
* コンカレント機能がオンのときに`onLoad`がトリガーされない問題を修正しました。([#23316](https://github.com/facebook/react/pull/23316)  by [@gnoff](https://github.com/gnoff))
* セレクタが`NaN`を返すときの警告を修正しました。([#23333](https://github.com/facebook/react/pull/23333)  by [@hachibeeDI](https://github.com/hachibeeDI))
* テストでドキュメントが`null`に設定されている場合のクラッシュを修正しました。([#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* 生成されたライセンスヘッダーを修正しました。([#23004](https://github.com/facebook/react/pull/23004)  by [@vitaliemiron](https://github.com/vitaliemiron))
* `package.json`をエントリーポイントの1つとして追加しました。([#22954](https://github.com/facebook/react/pull/22954)  by [@Jack](https://github.com/Jack-Works))
* Suspense境界外でのサスペンドを許可します。([#23267](https://github.com/facebook/react/pull/23267)  by [@acdlite](https://github.com/acdlite))
* ハイドレーションが失敗したときに回復可能なエラーをログに記録します。([#23319](https://github.com/facebook/react/pull/23319)  by [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* `createRoot`と`hydrateRoot`を追加しました。([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), and [@sebmarkbage](https://github.com/sebmarkbage))
* 選択的ハイドレーションを追加しました。([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) by [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), and [@sebmarkbage](https://github.com/sebmarkbage))
* 既知のARIA属性のリストに`aria-description`を追加しました。([#22142](https://github.com/facebook/react/pull/22142)  by [@mahyareb](https://github.com/mahyareb))
* ビデオ要素に`onResize`イベントを追加しました。([#21973](https://github.com/facebook/react/pull/21973)  by [@rileyjshaw](https://github.com/rileyjshaw))
* 既知のプロップに`imageSizes`と`imageSrcSet`を追加しました。([#22550](https://github.com/facebook/react/pull/22550)  by [@eps1lon](https://github.com/eps1lon))
* `value`が提供されている場合、非文字列の`<option>`子を許可します。([#21431](https://github.com/facebook/react/pull/21431)  by [@sebmarkbage](https://github.com/sebmarkbage))
* `aspectRatio`スタイルが適用されない問題を修正しました。([#21100](https://github.com/facebook/react/pull/21100)  by [@gaearon](https://github.com/gaearon))
* `renderSubtreeIntoContainer`が呼び出された場合に警告します。([#23355](https://github.com/facebook/react/pull/23355)  by [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* 新しいストリーミングレンダラーを追加しました。([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage))
* 複数のリクエストを処理する際のSSRでのコンテキストプロバイダーの問題を修正しました。([#23171](https://github.com/facebook/react/pull/23171)  by [@frandiox](https://github.com/frandiox))
* テキストの不一致時にクライアントレンダリングに戻ります。([#23354](https://github.com/facebook/react/pull/23354)  by [@acdlite](https://github.com/acdlite))
* `renderToNodeStream`を非推奨にします。([#23359](https://github.com/facebook/react/pull/23359)  by [@sebmarkbage](https://github.com/sebmarkbage))
* 新しいサーバーレンダラーでの誤ったエラーログを修正しました。([#24043](https://github.com/facebook/react/pull/24043)  by [@eps1lon](https://github.com/eps1lon))
* 新しいサーバーレンダラーのバグを修正しました。([#22617](https://github.com/facebook/react/pull/22617)  by [@shuding](https://github.com/shuding))
* サーバー上のカスタム要素内の関数およびシンボル値を無視します。([#21157](https://github.com/facebook/react/pull/21157)  by [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* 本番環境で`act`が使用された場合にスローします。([#21686](https://github.com/facebook/react/pull/21686)  by [@acdlite](https://github.com/acdlite))
* `global.IS_REACT_ACT_ENVIRONMENT`で不要なact警告を無効にするサポートを追加しました。([#22561](https://github.com/facebook/react/pull/22561)  by [@acdlite](https://github.com/acdlite))
* Reactの作業をスケジュールする可能性のあるすべてのAPIをカバーするようにact警告を拡張します。([#22607](https://github.com/facebook/react/pull/22607)  by [@acdlite](https://github.com/acdlite))
* `act`が更新をバッチ処理するようにします。([#21797](https://github.com/facebook/react/pull/21797)  by [@acdlite](https://github.com/acdlite))
* パッシブエフェクトの残存警告を削除します。([#22609](https://github.com/facebook/react/pull/22609)  by [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Fast Refreshで遅延マウントされたルートを追跡します。([#22740](https://github.com/facebook/react/pull/22740)  by [@anc95](https://github.com/anc95))
* `package.json`に`exports`フィールドを追加します。([#23087](https://github.com/facebook/react/pull/23087)  by [@otakustay](https://github.com/otakustay))

### Server Components (Experimental) {/*server-components-experimental*/}

* サーバーコンテキストのサポートを追加します。([#23244](https://github.com/facebook/react/pull/23244)  by [@salazarm](https://github.com/salazarm))
* `lazy`サポートを追加します。([#24068](https://github.com/facebook/react/pull/24068)  by [@gnoff](https://github.com/gnoff))
* webpack 5用のwebpackプラグインを更新します。([#22739](https://github.com/facebook/react/pull/22739)  by [@michenly](https://github.com/michenly))
* Nodeローダーのミスを修正します。([#22537](https://github.com/facebook/react/pull/22537)  by [@btea](https://github.com/btea))
* エッジ環境用に`window`の代わりに`globalThis`を使用します。([#22777](https://github.com/facebook/react/pull/22777)  by [@huozhi](https://github.com/huozhi))