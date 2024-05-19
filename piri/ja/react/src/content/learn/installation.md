---
title: Installation
---

<Intro>

Reactは、段階的な導入を最初から設計されています。必要に応じて少しだけReactを使うことも、たくさん使うこともできます。Reactを試してみたい、HTMLページにインタラクティブ性を追加したい、または複雑なReactを使ったアプリを始めたい場合でも、このセクションが役立ちます。

</Intro>

<YouWillLearn isChapter={true}>

* [新しいReactプロジェクトを始める方法](/learn/start-a-new-react-project)
* [既存のプロジェクトにReactを追加する方法](/learn/add-react-to-an-existing-project)
* [エディタの設定方法](/learn/editor-setup)
* [React Developer Toolsのインストール方法](/learn/react-developer-tools)

</YouWillLearn>

## Reactを試す {/*try-react*/}

Reactを試すために何もインストールする必要はありません。このサンドボックスを編集してみてください！

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

直接編集するか、右上の「Fork」ボタンを押して新しいタブで開くことができます。

Reactのドキュメントのほとんどのページには、このようなサンドボックスが含まれています。Reactのドキュメント以外にも、Reactをサポートする多くのオンラインサンドボックスがあります。例えば、[CodeSandbox](https://codesandbox.io/s/new)、[StackBlitz](https://stackblitz.com/fork/react)、または[CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)

### ローカルでReactを試す {/*try-react-locally*/}

コンピュータでローカルにReactを試すには、[このHTMLページをダウンロードしてください。](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) エディタとブラウザで開いてください！

## 新しいReactプロジェクトを始める {/*start-a-new-react-project*/}

アプリやウェブサイトを完全にReactで構築したい場合は、[新しいReactプロジェクトを始めてください。](/learn/start-a-new-react-project)

## 既存のプロジェクトにReactを追加する {/*add-react-to-an-existing-project*/}

既存のアプリやウェブサイトでReactを試してみたい場合は、[既存のプロジェクトにReactを追加してください。](/learn/add-react-to-an-existing-project)

## 次のステップ {/*next-steps*/}

毎日遭遇する最も重要なReactの概念をツアーするために、[クイックスタート](/learn)ガイドに進んでください。