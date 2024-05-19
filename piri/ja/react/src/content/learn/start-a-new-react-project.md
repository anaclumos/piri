---
title: 新しいReactプロジェクトを開始する
---

<Intro>

新しいアプリやウェブサイトを完全にReactで構築したい場合、コミュニティで人気のあるReact対応のフレームワークを選ぶことをお勧めします。

</Intro>

フレームワークを使用せずにReactを使用することもできますが、ほとんどのアプリやサイトは最終的にコード分割、ルーティング、データ取得、HTML生成などの一般的な問題に対する解決策を構築することになります。これらの問題はReactに限らず、すべてのUIライブラリに共通しています。

フレームワークを使用することで、Reactを迅速に開始でき、後で独自のフレームワークを構築する必要がなくなります。

<DeepDive>

#### フレームワークなしでReactを使用できますか？ {/*can-i-use-react-without-a-framework*/}

フレームワークなしでReactを使用することはもちろん可能です。これは[ページの一部にReactを使用する方法](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)です。**しかし、新しいアプリやサイトを完全にReactで構築する場合は、フレームワークを使用することをお勧めします。**

その理由は以下の通りです。

最初はルーティングやデータ取得が必要ない場合でも、それらのためのライブラリを追加したくなるでしょう。新しい機能ごとにJavaScriptバンドルが大きくなるにつれて、各ルートごとにコードを分割する方法を考えなければならないかもしれません。データ取得のニーズが複雑になるにつれて、サーバーとクライアント間のネットワークウォーターフォールに直面し、アプリが非常に遅く感じられることがあります。ネットワーク条件が悪いユーザーや低スペックのデバイスを持つユーザーが増えるにつれて、コンポーネントからHTMLを生成して早期にコンテンツを表示する必要があるかもしれません。これをサーバー上で、またはビルド時に行うように設定を変更するのは非常に難しいです。

**これらの問題はReact特有のものではありません。これがSvelteにはSvelteKit、VueにはNuxtがある理由です。** これらの問題を自分で解決するには、バンドラーをルーターやデータ取得ライブラリと統合する必要があります。初期設定を動作させるのは難しくありませんが、アプリが成長するにつれて迅速に読み込まれるようにするには多くの微妙な点があります。最小限のアプリコードを送信しつつ、ページに必要なデータと並行して単一のクライアント-サーバーラウンドトリップで行う必要があります。JavaScriptコードが実行される前にページがインタラクティブになるようにして、プログレッシブエンハンスメントをサポートすることも望むでしょう。マーケティングページのために完全に静的なHTMLファイルのフォルダーを生成し、JavaScriptが無効でも動作するようにすることも考えられます。これらの機能を自分で構築するには本当に手間がかかります。

**このページのReactフレームワークは、これらの問題をデフォルトで解決し、追加の作業を必要としません。** これにより、非常にスリムな状態で開始し、ニーズに応じてアプリをスケールさせることができます。各Reactフレームワークにはコミュニティがあり、質問への回答を見つけたり、ツールをアップグレードしたりするのが容易です。フレームワークはコードに構造を与え、異なるプロジェクト間でコンテキストとスキルを保持するのに役立ちます。逆に、カスタム設定ではサポートされていない依存関係のバージョンに固執しやすくなり、最終的にはコミュニティやアップグレードパスのない独自のフレームワークを作成することになります（過去に作成したもののように、より雑然とした設計になることが多いです）。

これらのフレームワークではうまく対応できない特殊な制約がある場合や、これらの問題を自分で解決したい場合は、Reactを使用して独自のカスタム設定を作成できます。npmから`react`と`react-dom`を取得し、[Vite](https://vitejs.dev/)や[Parcel](https://parceljs.org/)のようなバンドラーでカスタムビルドプロセスを設定し、ルーティング、静的生成、サーバーサイドレンダリングなどのために必要なツールを追加します。

</DeepDive>

## プロダクションレベルのReactフレームワーク {/*production-grade-react-frameworks*/}

これらのフレームワークは、アプリをプロダクションにデプロイしスケールさせるために必要なすべての機能をサポートしており、私たちの[フルスタックアーキテクチャビジョン](#which-features-make-up-the-react-teams-full-stack-architecture-vision)をサポートする方向に進んでいます。私たちが推奨するすべてのフレームワークはオープンソースで、サポートのためのアクティブなコミュニティがあり、自分のサーバーやホスティングプロバイダーにデプロイできます。フレームワークの作者でこのリストに含まれたい方は、[こちらからお知らせください](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)。

### Next.js {/*nextjs-pages-router*/}

**[Next.jsのPages Router](https://nextjs.org/)はフルスタックのReactフレームワークです。** これは非常に柔軟で、ほぼ静的なブログから複雑な動的アプリケーションまで、あらゆるサイズのReactアプリを作成できます。新しいNext.jsプロジェクトを作成するには、ターミナルで次のコマンドを実行します：

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.jsに不慣れな場合は、[Next.jsの学習コース](https://nextjs.org/learn)をチェックしてください。

Next.jsは[Vercel](https://vercel.com/)によってメンテナンスされています。Next.jsアプリを[デプロイ](https://nextjs.org/docs/app/building-your-application/deploying)するには、Node.jsまたはサーバーレスホスティング、または自分のサーバーにデプロイできます。Next.jsは[静的エクスポート](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)もサポートしており、サーバーを必要としません。

### Remix {/*remix*/}

**[Remix](https://remix.run/)はネストされたルーティングを持つフルスタックのReactフレームワークです。** これにより、アプリをネストされた部分に分割し、データを並行してロードし、ユーザーのアクションに応じてリフレッシュできます。新しいRemixプロジェクトを作成するには、次のコマンドを実行します：

<TerminalBlock>
npx create-remix
</TerminalBlock>

Remixに不慣れな場合は、Remixの[ブログチュートリアル](https://remix.run/docs/en/main/tutorials/blog)（短い）と[アプリチュートリアル](https://remix.run/docs/en/main/tutorials/jokes)（長い）をチェックしてください。

Remixは[Shopify](https://www.shopify.com/)によってメンテナンスされています。Remixプロジェクトを作成する際には、[デプロイメントターゲット](https://remix.run/docs/en/main/guides/deployment)を選択する必要があります。RemixアプリをNode.jsまたはサーバーレスホスティングにデプロイするには、[アダプター](https://remix.run/docs/en/main/other-api/adapter)を使用するか作成します。

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/)は高速なCMS対応ウェブサイトのためのReactフレームワークです。** その豊富なプラグインエコシステムとGraphQLデータレイヤーにより、コンテンツ、API、サービスを1つのウェブサイトに統合するのが簡単になります。新しいGatsbyプロジェクトを作成するには、次のコマンドを実行します：

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Gatsbyに不慣れな場合は、[Gatsbyチュートリアル](https://www.gatsbyjs.com/docs/tutorial/)をチェックしてください。

Gatsbyは[Netlify](https://www.netlify.com/)によってメンテナンスされています。完全に静的なGatsbyサイトを[デプロイ](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting)するには、任意の静的ホスティングを使用できます。サーバー専用機能を使用する場合は、ホスティングプロバイダーがGatsbyのためにそれらをサポートしていることを確認してください。

### Expo (ネイティブアプリ用) {/*expo*/}

**[Expo](https://expo.dev/)は、真にネイティブなUIを持つユニバーサルなAndroid、iOS、およびウェブアプリを作成できるReactフレームワークです。** これは[React Native](https://reactnative.dev/)のためのSDKを提供し、ネイティブ部分を使いやすくします。新しいExpoプロジェクトを作成するには、次のコマンドを実行します：

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Expoに不慣れな場合は、[Expoチュートリアル](https://docs.expo.dev/tutorial/introduction/)をチェックしてください。

Expoは[Expo (the company)](https://expo.dev/about)によってメンテナンスされています。Expoを使用してアプリを無料で作成し、GoogleおよびAppleのアプリストアに制限なく提出できます。Expoはさらにオプトインの有料クラウドサービスも提供しています。

## 最先端のReactフレームワーク {/*bleeding-edge-react-frameworks*/}

Reactをさらに改善する方法を探る中で、Reactをフレームワーク（特にルーティング、バンドリング、サーバー技術）とより密接に統合することが、Reactユーザーがより良いアプリを構築するための最大の機会であることに気付きました。Next.jsチームは、[React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)のようなフレームワークに依存しない最先端のReact機能の研究、開発、統合、テストに協力することに同意しました。

これらの機能は毎日プロダクションレディに近づいており、他のバンドラーやフレームワーク開発者とも統合について話し合っています。私たちの希望は、1年か2年のうちに、このページにリストされているすべてのフレームワークがこれらの機能を完全にサポートすることです。（これらの機能を実験するために私たちと提携することに興味があるフレームワークの作者は、ぜひお知らせください！）

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.jsのApp Router](https://nextjs.org/docs)は、Reactチームのフルスタックアーキテクチャビジョンを実現するためのNext.js APIの再設計です。** これにより、サーバー上またはビルド時に実行される非同期コンポーネントでデータを取得できます。

Next.jsは[Vercel](https://vercel.com/)によってメンテナンスされています。Next.jsアプリを[デプロイ](https://nextjs.org/docs/app/building-your-application/deploying)するには、Node.jsまたはサーバーレスホスティング、または自分のサーバーにデプロイできます。Next.jsは[静的エクスポート](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)もサポートしており、サーバーを必要としません。

<DeepDive>

#### Reactチームのフルスタックアーキテクチャビジョンを構成する機能は何ですか？ {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.jsのApp Routerバンドラーは、公式の[React Server Components仕様](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)を完全に実装しています。これにより、ビルド時、サーバー専用、およびインタラクティブなコンポーネントを単一のReactツリーに混在させることができます。

例えば、データベースやファイルから読み取る`async`関数としてサーバー専用のReactコンポーネントを書くことができます。その後、データをインタラクティブなコンポーネントに渡すことができます：

```js
// このコンポーネントはサーバー上（またはビルド時）にのみ実行されます。
async function Talks({ confId }) {
  // 1. サーバー上にいるので、データレイヤーと通信できます。APIエンドポイントは不要です。
  const talks = await db.Talks.findAll({ confId });

  // 2. 任意の量のレンダリングロジックを追加できます。これによりJavaScriptバンドルが大きくなることはありません。
  const videos = talks.map(talk => talk.video);

  // 3. ブラウザで実行されるコンポーネントにデータを渡します。
  return <SearchableVideoList videos={videos} />;
}
```

Next.jsのApp Routerは、[Suspenseを使用したデータ取得](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)も統合しています。これにより、Reactツリー内で異なる部分のユーザーインターフェースに対してローディング状態（スケルトンプレスホルダーなど）を指定できます：

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server ComponentsとSuspenseはNext.jsの機能ではなく、Reactの機能です。しかし、フレームワークレベルでそれらを採用するには、賛同と非トリビアルな実装作業が必要です。現時点では、Next.jsのApp Routerが最も完全な実装です。Reactチームは、次世代のフレームワークでこれらの機能を実装しやすくするために、バンドラー開発者と協力しています。

</DeepDive>