---
title: React ラボ: 私たちが取り組んでいること – 2024年2月
author: Joseph Savona, Ricky Hanlon, Andrew Clark, Matt Carroll, and Dan Abramov
date: 2024/02/15
description: React Labsの投稿では、現在研究開発中のプロジェクトについて書いています。前回の更新以来、私たちは大きな進展を遂げており、その進捗を共有したいと思います。
---

2024年2月15日 [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), および [Dan Abramov](https://twitter.com/dan_abramov) による。

---

<Intro>

React Labsの投稿では、現在進行中の研究開発プロジェクトについて書いています。前回の[更新](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)以来、大きな進展がありましたので、その進捗を共有したいと思います。

</Intro>

<Note>

React Conf 2024は、5月15日から16日にネバダ州ヘンダーソンで開催される予定です！React Confに直接参加したい方は、2月28日までに[チケット抽選に登録](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK)してください。

チケット、無料ストリーミング、スポンサーシップなどの詳細については、[React Confのウェブサイト](https://conf.react.dev)をご覧ください。

</Note>

---

## React Compiler {/*react-compiler*/}

React Compilerはもはや研究プロジェクトではありません。現在、instagram.comの本番環境でコンパイラが稼働しており、Metaの他のサービスにも展開を進め、最初のオープンソースリリースの準備を進めています。

[前回の投稿](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler)で述べたように、Reactは状態が変わると*時々*再レンダリングが多すぎることがあります。Reactの初期から、このような場合の解決策として手動のメモ化がありました。現在のAPIでは、[`useMemo`](/reference/react/useMemo)、[`useCallback`](/reference/react/useCallback)、および[`memo`](/reference/react/memo) APIを適用して、状態変化時のReactの再レンダリングを手動で調整します。しかし、手動のメモ化は妥協策です。コードが煩雑になりやすく、間違いやすく、最新の状態を保つために追加の作業が必要です。

手動のメモ化は合理的な妥協策ですが、私たちは満足していませんでした。私たちのビジョンは、Reactが状態変化時にUIの適切な部分を*自動的に*再レンダリングすることです。*Reactのコアメンタルモデルを妥協することなく*。Reactのアプローチ—状態の単純な関数としてのUI、標準的なJavaScriptの値とイディオム—は、多くの開発者にとってReactが親しみやすい理由の一部であると信じています。だからこそ、Reactのための最適化コンパイラの構築に投資してきました。

JavaScriptはその緩いルールと動的な性質のため、最適化が非常に難しい言語です。React Compilerは、JavaScriptのルール*と*「Reactのルール」の両方をモデル化することで、安全にコードをコンパイルすることができます。例えば、Reactコンポーネントは同じ入力を与えられた場合に同じ値を返す必要があり、propsや状態値を変更することはできません。これらのルールは開発者ができることを制限し、コンパイラが最適化するための安全なスペースを確保します。

もちろん、開発者がルールを少し曲げることがあることは理解しています。私たちの目標は、React Compilerができるだけ多くのコードでそのまま動作することです。コンパイラは、コードがReactのルールに厳密に従っていない場合を検出し、安全な場合はコードをコンパイルし、安全でない場合はコンパイルをスキップします。このアプローチを検証するために、Metaの大規模で多様なコードベースでテストを行っています。

Reactのルールに従っていることを確認したい開発者には、[Strict Modeを有効にする](/reference/react/StrictMode)ことと、[ReactのESLintプラグインを設定する](/learn/editor-setup#linting)ことをお勧めします。これらのツールは、Reactコードの微妙なバグをキャッチし、アプリケーションの品質を向上させ、React Compilerのような今後の機能に備えるのに役立ちます。また、Reactのルールの統合ドキュメントの作成と、これらのルールを理解し適用するためのESLintプラグインの更新にも取り組んでいます。

コンパイラの動作を確認するには、[昨秋の講演](https://www.youtube.com/watch?v=qOQClO3g8-Y)をご覧ください。講演の時点では、instagram.comの1ページでReact Compilerを試した初期の実験データがありました。それ以来、コンパイラをinstagram.com全体の本番環境に導入しました。また、Metaの他のサービスへの展開を加速し、オープンソース化に向けてチームを拡大しました。今後の道のりに興奮しており、今後数ヶ月でさらに多くの情報を共有する予定です。

## Actions {/*actions*/}

私たちは以前、[Server Actions](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)を使用して、クライアントからサーバーにデータを送信し、データベースの変更やフォームの実装を行うソリューションを検討していることを共有しました。Server Actionsの開発中に、これらのAPIをクライアント専用アプリケーションのデータ処理をサポートするように拡張しました。

この広範な機能群を単に「Actions」と呼んでいます。Actionsを使用すると、[`<form/>`](/reference/react-dom/components/form)などのDOM要素に関数を渡すことができます：

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

`action`関数は同期的または非同期的に動作することができます。標準的なJavaScriptを使用してクライアント側で定義するか、[`'use server'`](/reference/rsc/use-server)ディレクティブを使用してサーバー側で定義することができます。アクションを使用すると、Reactはデータ送信のライフサイクルを管理し、[`useFormStatus`](/reference/react-dom/hooks/useFormStatus)や[`useActionState`](/reference/react/useActionState)などのフックを提供して、フォームアクションの現在の状態と応答にアクセスできます。

デフォルトでは、Actionsは[transition](/reference/react/useTransition)内で送信され、アクションが処理されている間、現在のページをインタラクティブに保ちます。Actionsは非同期関数をサポートしているため、`async/await`をトランジションで使用する機能も追加しました。これにより、`fetch`のような非同期リクエストが開始されたときに`isPending`状態で保留中のUIを表示し、更新が適用されるまで保留中のUIを表示することができます。

Actionsと並行して、楽観的な状態更新を管理するための[`useOptimistic`](/reference/react/useOptimistic)という機能を導入しています。このフックを使用すると、最終状態がコミットされると自動的に元に戻る一時的な更新を適用できます。Actionsの場合、送信が成功することを前提にクライアント側でデータの最終状態を楽観的に設定し、サーバーから受け取ったデータの値に戻すことができます。これは通常の`async`/`await`を使用して動作するため、クライアントで`fetch`を使用する場合でも、サーバーからのServer Actionを使用する場合でも同じように動作します。

ライブラリの作者は、`useTransition`を使用して独自のコンポーネントでカスタムの`action={fn}`プロップを実装できます。私たちの意図は、ライブラリがコンポーネントAPIを設計する際にActionsパターンを採用し、React開発者に一貫した体験を提供することです。例えば、ライブラリが`<Calendar onSelect={eventHandler}>`コンポーネントを提供している場合、`<Calendar selectAction={action}>`APIも公開することを検討してください。

最初はクライアント-サーバーデータ転送のためのServer Actionsに焦点を当てていましたが、Reactの哲学はすべてのプラットフォームと環境で同じプログラミングモデルを提供することです。可能な限り、クライアントで機能を導入する場合、サーバーでも動作するようにし、その逆も同様です。この哲学により、アプリがどこで実行されても動作する単一のAPIセットを作成し、後で異なる環境にアップグレードするのを容易にします。

Actionsは現在Canaryチャンネルで利用可能で、次のReactリリースで提供される予定です。

## React Canaryの新機能 {/*new-features-in-react-canary*/}

[React Canaries](/blog/2023/05/03/react-canaries)を導入し、設計が最終段階に近づいた新しい安定機能を、安定したsemverバージョンでリリースされる前に個別に採用できるオプションを提供しました。

CanariesはReactの開発方法に変化をもたらします。以前は、機能はMeta内部で非公開で研究され構築されていたため、ユーザーは安定版がリリースされたときに最終的な製品を見ることができました。Canariesでは、React Labsブログシリーズで共有する機能を最終化するために、コミュニティの助けを借りて公開で開発を行っています。これにより、機能が完成する前に、最終化されている段階で新機能について知ることができます。

React Server Components、Asset Loading、Document Metadata、およびActionsはすべてReact Canaryに導入されており、これらの機能のドキュメントをreact.devに追加しました：

- **Directives**: [`"use client"`](/reference/rsc/use-client)および[`"use server"`](/reference/rsc/use-server)は、フルスタックReactフレームワーク向けに設計されたバンドラー機能です。これらは2つの環境間の「分割ポイント」を示します：`"use client"`はバンドラーに`<script>`タグを生成するよう指示し（[Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)のように）、`"use server"`はバンドラーにPOSTエンドポイントを生成するよう指示します（[tRPC Mutations](https://trpc.io/docs/concepts)のように）。これらを組み合わせることで、クライアント側のインタラクティブ性と関連するサーバー側のロジックを組み合わせた再利用可能なコンポーネントを作成できます。

- **Document Metadata**: [`<title>`](/reference/react-dom/components/title)、[`<meta>`](/reference/react-dom/components/meta)、およびメタデータ[`<link>`](/reference/react-dom/components/link)タグのレンダリングをコンポーネントツリーのどこでもサポートする組み込み機能を追加しました。これらは、完全にクライアント側のコード、SSR、およびRSCを含むすべての環境で同じ方法で動作します。これにより、[React Helmet](https://github.com/nfl/react-helmet)のようなライブラリが先駆けた機能の組み込みサポートが提供されます。

- **Asset Loading**: スタイルシート、フォント、スクリプトなどのリソースの読み込みライフサイクルとSuspenseを統合し、Reactが`<style>`、[`<link>`](/reference/react-dom/components/link)、および[`<script>`](/reference/react-dom/components/script)の要素の内容が表示可能かどうかを判断するために考慮するようにしました。また、リソースの読み込みと初期化のタイミングを制御するための新しい[Resource Loading APIs](/reference/react-dom#resource-preloading-apis)（`preload`および`preinit`）を追加しました。

- **Actions**: 上記のように、クライアントからサーバーへのデータ送信を管理するためにActionsを追加しました。[`<form/>`](/reference/react-dom/components/form)などの要素に`action`を追加し、[`useFormStatus`](/reference/react-dom/hooks/useFormStatus)でステータスにアクセスし、[`useActionState`](/reference/react/useActionState)で結果を処理し、[`useOptimistic`](/reference/react/useOptimistic)でUIを楽観的に更新できます。

これらの機能はすべて連携して動作するため、個別に安定版チャンネルでリリースするのは難しいです。補完的なフックがないと、Actionsの実用性が制限されます。React Server ComponentsをServer Actionsと統合せずに導入すると、サーバー上のデータを変更するのが複雑になります。

安定版チャンネルに機能セットをリリースする前に、それらが一貫して動作し、開発者が本番環境で使用するために必要なすべてのものを提供する必要があります。React Canariesは、これらの機能を個別に開発し、機能セットが完成するまで安定したAPIを段階的にリリースすることを可能にします。

現在のReact Canaryの機能セットは完成しており、リリースの準備が整っています。

## 次のメジャーバージョンのReact {/*the-next-major-version-of-react*/}

数年の反復を経て、`react@canary`は`react@latest`にリリースする準備が整いました。上記の新機能は、アプリが実行されるどの環境でも互換性があり、本番環境で使用するために必要なすべてを提供します。Asset LoadingとDocument Metadataは一部のアプリにとって破壊的な変更となる可能性があるため、次のReactバージョンはメジャーバージョンとなります：**React 19**。

リリースの準備を整えるためにまだやるべきことがあります。React 19では、Web Componentsのサポートなど、破壊的な変更を伴う長年の要望に応える改善も追加しています。現在の焦点は、これらの変更を着地させ、リリースの準備を整え、新機能のドキュメントを最終化し、含まれる内容の発表を行うことです。

React 19に含まれるすべての情報、新しいクライアント機能の採用方法、およびReact Server Componentsのサポートの構築方法について、今後数ヶ月でさらに情報を共有します。

## Offscreen（Activityに改名） {/*offscreen-renamed-to-activity*/}

前回の更新以来、研究中の機能の名前を「Offscreen」から「Activity」に変更しました。「Offscreen」という名前は、アプリの見えない部分にのみ適用されることを示唆していましたが、機能を研究する中で、モーダルの背後にあるコンテンツのように、アプリの一部が見えていても非アクティブである可能性があることに気付きました。新しい名前は、アプリの特定の部分を「アクティブ」または「非アクティブ」とマークする動作をより正確に反映しています。

Activityはまだ研究中であり、ライブラリ開発者に公開されるプリミティブを最終化するための作業が残っています。より完成度の高い機能の出荷に集中するため、この分野の優先順位を下げました。

* * *

この更新に加えて、私たちのチームは会議で発表を行い、ポッドキャストに出演して私たちの仕事について話し、質問に答えました。

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran)は[React India](https://www.youtube.com/watch?v=kjOacmVsLSE)会議でReact Compilerについて話しました。

- [Dan Abramov](/community/team#dan-abramov)は[RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s)で「React from Another Dimension」というタイトルの講演を行い、React Server ComponentsとActionsがどのように作成されたかの代替歴史を探りました。

- [Dan Abramov](/community/team#dan-abramov)は[the Changelog’s JS Party podcast](https://changelog.com/jsparty/311)でReact Server Componentsについてインタビューを受けました。

- [Matt Carroll](/community/team#matt-carroll)は[Front-End Fire podcast](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll)でインタビューを受け、「[The Two Reacts](https://overreacted.io/the-two-reacts/)」について話しました。

この投稿をレビューしてくれた[Lauren Tan](https://twitter.com/potetotes)、[Sophie Alpert](https://twitter.com/sophiebits)、[Jason Bonta](https://threads.net/someextent)、[Eli White](https://twitter.com/Eli_White)、および[Sathya Gunasekaran](https://twitter.com/_gsathya)に感謝します。

読んでいただきありがとうございます。[React Confでお会いしましょう](https://conf.react.dev/)！