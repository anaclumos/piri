---
title: React Conf 2021 まとめ
author: Jesslyn Tannady and Rick Hanlon
date: 2021/12/17
description: 先週、私たちは第6回React Confを開催しました。過去の年では、React Confのステージを使用して、React NativeやReact Hooksなどの業界を変える発表を行ってきました。今年は、React 18のリリースと並行機能の段階的な採用から始まる、Reactのマルチプラットフォームビジョンを共有しました。
---

2021年12月17日 [Jesslyn Tannady](https://twitter.com/jtannady) と [Rick Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

先週、私たちは第6回React Confを開催しました。過去の年では、React Confのステージを利用して、[_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) や [_React Hooks_](https://reactjs.org/docs/hooks-intro.html) など、業界を変える発表を行ってきました。今年は、React 18のリリースと並行機能の段階的な採用から始まる、Reactのマルチプラットフォームビジョンを共有しました。

</Intro>

---

今回のReact Confは初めてオンラインで開催され、無料でストリーミングされ、8つの異なる言語に翻訳されました。世界中の参加者が私たちのカンファレンスDiscordと、全タイムゾーンでのアクセスを可能にするリプレイイベントに参加しました。50,000人以上が登録し、19の講演が60,000回以上視聴され、両イベントで5,000人がDiscordに参加しました。

すべての講演は[オンラインでストリーミング可能](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)です。

ステージで共有された内容の概要は以下の通りです：

## React 18と並行機能 {/*react-18-and-concurrent-features*/}

基調講演では、React 18から始まるReactの未来のビジョンを共有しました。

React 18は、長らく待ち望まれていた並行レンダラーと、重大な破壊的変更なしにSuspenseの更新を追加します。アプリはReact 18にアップグレードし、他の主要リリースと同程度の労力で並行機能を段階的に採用し始めることができます。

**これは、並行モードが存在せず、並行機能のみが存在することを意味します。**

基調講演では、Suspense、Server Components、新しいReactワーキンググループ、そしてReact Nativeの長期的な多プラットフォームビジョンについても共有しました。

[Andrew Clark](https://twitter.com/acdlite)、[Juan Tejada](https://twitter.com/_jstejada)、[Lauren Tan](https://twitter.com/potetotes)、[Rick Hanlon](https://twitter.com/rickhanlonii)による基調講演の全編はこちらでご覧ください：

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" />

## アプリケーション開発者向けのReact 18 {/*react-18-for-application-developers*/}

基調講演では、React 18 RCが現在試用可能であることも発表しました。さらなるフィードバックを待って、これは来年初めに安定版として公開する予定のReactの正確なバージョンです。

React 18 RCを試すには、依存関係をアップグレードしてください：

```bash
npm install react@rc react-dom@rc
```

そして新しい `createRoot` APIに切り替えます：

```js
// 以前
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// 以後
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

React 18へのアップグレードのデモについては、[Shruti Kapoor](https://twitter.com/shrutikapoor08)の講演をご覧ください：

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" />

## Suspenseを使用したストリーミングサーバーレンダリング {/*streaming-server-rendering-with-suspense*/}

React 18には、Suspenseを使用したサーバーサイドレンダリングのパフォーマンス向上も含まれています。

ストリーミングサーバーレンダリングでは、サーバー上でReactコンポーネントからHTMLを生成し、そのHTMLをユーザーにストリーミングすることができます。React 18では、`Suspense`を使用してアプリをより小さな独立したユニットに分割し、それぞれを他の部分をブロックせずに独立してストリーミングすることができます。これにより、ユーザーはコンテンツを早く見ることができ、より早く操作を開始することができます。

詳細については、[Shaundai Person](https://twitter.com/shaundai)の講演をご覧ください：

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" />

## 最初のReactワーキンググループ {/*the-first-react-working-group*/}

React 18のために、専門家、開発者、ライブラリメンテナー、教育者のパネルと協力するための最初のワーキンググループを作成しました。共に、段階的な採用戦略を作成し、`useId`、`useSyncExternalStore`、`useInsertionEffect`などの新しいAPIを洗練しました。

この作業の概要については、[Aakansha' Doshi](https://twitter.com/aakansha1216)の講演をご覧ください：

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" />

## React開発者ツール {/*react-developer-tooling*/}

このリリースの新機能をサポートするために、新しく結成されたReact DevToolsチームと、Reactアプリのデバッグを支援する新しいタイムラインプロファイラーを発表しました。

新しいDevTools機能の詳細とデモについては、[Brian Vaughn](https://twitter.com/brian_d_vaughn)の講演をご覧ください：

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" />

## memoなしのReact {/*react-without-memo*/}

将来を見据えて、[Xuan Huang (黄玄)](https://twitter.com/Huxpro)が自動メモ化コンパイラに関するReact Labsの研究の最新情報を共有しました。詳細とコンパイラプロトタイプのデモについては、この講演をご覧ください：

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" />

## Reactドキュメント基調講演 {/*react-docs-keynote*/}

[Rachel Nabors](https://twitter.com/rachelnabors)は、Reactの新しいドキュメントへの投資についての基調講演で、Reactを使った学習とデザインに関する一連の講演を開始しました（[現在はreact.devとして提供されています](/blog/2023/03/16/introducing-react-dev)）：

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" />

## その他... {/*and-more*/}

**Reactを使った学習とデザインに関する講演もありました：**

* Debbie O'Brien: [新しいReactドキュメントから学んだこと](https://youtu.be/-7odLW_hG7s)。
* Sarah Rainsberger: [ブラウザでの学習](https://youtu.be/5X-WEQflCL0)。
* Linton Ye: [Reactを使ったデザインのROI](https://youtu.be/7cPWmID5XAk)。
* Delba de Oliveira: [Reactを使ったインタラクティブなプレイグラウンド](https://youtu.be/zL8cz2W0z34)。

**Relay、React Native、PyTorchチームからの講演：**

* Robert Balicki: [Relayの再紹介](https://youtu.be/lhVGdErZuN4)。
* Eric RozellとSteven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY)。
* Roman Rädle: [React Nativeのオンデバイス機械学習](https://youtu.be/NLj73vrc2I8)

**アクセシビリティ、ツール、Server Componentsに関するコミュニティからの講演：**

* Daishi Kato: [外部ストアライブラリ向けのReact 18](https://youtu.be/oPfSC5bQPR8)。
* Diego Haz: [React 18でアクセシブルなコンポーネントを構築する](https://youtu.be/dcm8fjBfro8)。
* Tafu Nakazaki: [Reactを使ったアクセシブルな日本語フォームコンポーネント](https://youtu.be/S4a0QlsH0pU)。
* Lyle Troxell: [アーティスト向けのUIツール](https://youtu.be/b3l4WxipFsE)。
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks)。

## ありがとう {/*thank-you*/}

今年は初めて自分たちでカンファレンスを計画し、多くの人々に感謝しています。

まず、すべてのスピーカーに感謝します：[Aakansha Doshi](https://twitter.com/aakansha1216)、[Andrew Clark](https://twitter.com/acdlite)、[Brian Vaughn](https://twitter.com/brian_d_vaughn)、[Daishi Kato](https://twitter.com/dai_shi)、[Debbie O'Brien](https://twitter.com/debs_obrien)、[Delba de Oliveira](https://twitter.com/delba_oliveira)、[Diego Haz](https://twitter.com/diegohaz)、[Eric Rozell](https://twitter.com/EricRozell)、[Helen Lin](https://twitter.com/wizardlyhel)、[Juan Tejada](https://twitter.com/_jstejada)、[Lauren Tan](https://twitter.com/potetotes)、[Linton Ye](https://twitter.com/lintonye)、[Lyle Troxell](https://twitter.com/lyle)、[Rachel Nabors](https://twitter.com/rachelnabors)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Robert Balicki](https://twitter.com/StatisticsFTW)、[Roman Rädle](https://twitter.com/raedle)、[Sarah Rainsberger](https://twitter.com/sarah11918)、[Shaundai Person](https://twitter.com/shaundai)、[Shruti Kapoor](https://twitter.com/shrutikapoor08)、[Steven Moyes](https://twitter.com/moyessa)、[Tafu Nakazaki](https://twitter.com/hawaiiman0)、そして [Xuan Huang (黄玄)](https://twitter.com/Huxpro)。

講演にフィードバックを提供してくれたすべての人に感謝します：[Andrew Clark](https://twitter.com/acdlite)、[Dan Abramov](https://twitter.com/dan_abramov)、[Dave McCabe](https://twitter.com/mcc_abe)、[Eli White](https://twitter.com/Eli_White)、[Joe Savona](https://twitter.com/en_JS)、[Lauren Tan](https://twitter.com/potetotes)、[Rachel Nabors](https://twitter.com/rachelnabors)、そして[Tim Yung](https://twitter.com/yungsters)。

カンファレンスDiscordの設定とDiscord管理者としての役割を果たしてくれた[Lauren Tan](https://twitter.com/potetotes)に感謝します。

全体の方向性に関するフィードバックを提供し、多様性と包括性に焦点を当てるようにしてくれた[Seth Webster](https://twitter.com/sethwebster)に感謝します。

モデレーションの取り組みを先導してくれた[Rachel Nabors](https://twitter.com/rachelnabors)と、モデレーションガイドを作成し、モデレーションチームを率い、翻訳者とモデレーターのトレーニングを行い、両イベントのモデレーションを支援してくれた[Aisha Blake](https://twitter.com/AishaBlake)に感謝します。

モデレーターの[Jesslyn Tannady](https://twitter.com/jtannady)、[Suzie Grange](https://twitter.com/missuze)、[Becca Bailey](https://twitter.com/beccaliz)、[Luna Wei](https://twitter.com/lunaleaps)、[Joe Previte](https://twitter.com/jsjoeio)、[Nicola Corti](https://twitter.com/Cortinico)、[Gijs Weterings](https://twitter.com/gweterings)、[Claudio Procida](https://twitter.com/claudiopro)、Julia Neumann、Mengdi Chen、Jean Zhang、Ricky Li、そして[Xuan Huang (黄玄)](https://twitter.com/Huxpro)に感謝します。

リプレイイベントのモデレーションを支援し、コミュニティにとって魅力的なものにしてくれた[Manjula Dube](https://twitter.com/manjula_dube)、[Sahil Mhapsekar](https://twitter.com/apheri0)、Vihang Patel（[React India](https://www.reactindia.io/)）、[Jasmine Xie](https://twitter.com/jasmine_xby)、[QiChang Li](https://twitter.com/QCL15)、[YanLun Li](https://twitter.com/anneincoding)（[React China](https://twitter.com/ReactChina)）に感謝します。

カンファレンスウェブサイトを構築した[Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit)を公開してくれたVercel、そしてNext.js Confの運営経験を共有してくれた[Lee Robinson](https://twitter.com/leeerob)と[Delba de Oliveira](https://twitter.com/delba_oliveira)に感謝します。

カンファレンスの運営経験を共有し、[RustConf](https://rustconf.com/)の運営からの学びを提供し、カンファレンス運営に関するアドバイスを含む彼女の本[Event Driven](https://leanpub.com/eventdriven/)に感謝します。

Women of React Confの運営経験を共有してくれた[Kevin Lewis](https://twitter.com/_phzn)と[Rachel Nabors](https://twitter.com/rachelnabors)に感謝します。

計画中にアドバイスとアイデアを提供してくれた[Aakansha Doshi](https://twitter.com/aakansha1216)、[Laurie Barth](https://twitter.com/laurieontech)、[Michael Chan](https://twitter.com/chantastic)、そして[Shaundai Person](https://twitter.com/shaundai)に感謝します。

カンファレンスウェブサイトとチケットのデザインと構築を手伝ってくれた[Dan Lebowitz](https://twitter.com/lebo)に感謝します。

基調講演とMeta社員の講演のビデオを録画してくれたFacebook Video ProductionsチームのLaura Podolak Waddell、Desmond Osei-Acheampong、Mark Rossi、Josh Toberman、その他のメンバーに感謝します。

カンファレンスの組織、ストリーム内のすべてのビデオの編集、すべての講演の翻訳、複数の言語でのDiscordのモデレーションを支援してくれたパートナーHitPlayに感謝します。

最後に、素晴らしいReact Confを作り上げてくれたすべての参加者に感謝します！