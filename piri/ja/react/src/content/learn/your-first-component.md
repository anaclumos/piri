---
title: 最初のコンポーネント
---

<Intro>

*コンポーネント*はReactのコアコンセプトの一つです。ユーザーインターフェース（UI）を構築する基盤であり、Reactの旅を始めるのに最適な場所です！

</Intro>

<YouWillLearn>

* コンポーネントとは何か
* コンポーネントがReactアプリケーションで果たす役割
* 最初のReactコンポーネントの書き方

</YouWillLearn>

## コンポーネント: UIの構築ブロック {/*components-ui-building-blocks*/}

Webでは、HTMLを使用して`<h1>`や`<li>`のような組み込みタグを使ってリッチな構造化ドキュメントを作成できます。

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

このマークアップは、この記事`<article>`、その見出し`<h1>`、および目次を順序付きリスト`<ol>`として表しています。このようなマークアップは、スタイルのためのCSSやインタラクティブ性のためのJavaScriptと組み合わせて、Web上のすべてのサイドバー、アバター、モーダル、ドロップダウンなど、あらゆるUIの背後にあります。

Reactを使用すると、マークアップ、CSS、およびJavaScriptをカスタム「コンポーネント」に組み合わせることができます。**アプリの再利用可能なUI要素**です。上記の目次コードは、すべてのページにレンダリングできる`<TableOfContents />`コンポーネントに変えることができます。内部的には、依然として`<article>`や`<h1>`などの同じHTMLタグを使用しています。

HTMLタグと同様に、コンポーネントを構成、順序付け、ネストして、全体のページをデザインすることができます。たとえば、あなたが読んでいるドキュメントページは、Reactコンポーネントで構成されています。

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

プロジェクトが成長するにつれて、多くのデザインが既に書いたコンポーネントを再利用することで構成できることに気づくでしょう。これにより開発がスピードアップします。上記の目次は、`<TableOfContents />`を使用して任意の画面に追加できます！Reactオープンソースコミュニティによって共有されている数千のコンポーネント（[Chakra UI](https://chakra-ui.com/)や[Material UI](https://material-ui.com/)など）を使用して、プロジェクトを迅速に開始することもできます。

## コンポーネントの定義 {/*defining-a-component*/}

従来、ウェブページを作成する際、ウェブ開発者はコンテンツをマークアップし、JavaScriptを少し追加してインタラクションを追加していました。これは、インタラクションがWeb上での付加価値であったときにはうまく機能しました。現在では、多くのサイトやすべてのアプリでインタラクションが期待されています。Reactはインタラクティブ性を最優先しながら、同じ技術を使用します。**Reactコンポーネントは、マークアップを振りかけることができるJavaScript関数です。**以下はその例です（以下の例を編集できます）。

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

そして、コンポーネントを構築する方法は次のとおりです。

### ステップ1: コンポーネントをエクスポートする {/*step-1-export-the-component*/}

`export default`プレフィックスは[標準のJavaScript構文](https://developer.mozilla.org/docs/web/javascript/reference/statements/export)です（Reactに特有のものではありません）。これにより、ファイル内のメイン関数をマークし、後で他のファイルからインポートできるようになります。（インポートの詳細は[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)で説明します！）

### ステップ2: 関数を定義する {/*step-2-define-the-function*/}

`function Profile() { }`で、`Profile`という名前のJavaScript関数を定義します。

<Pitfall>

Reactコンポーネントは通常のJavaScript関数ですが、**名前は大文字で始めなければなりません**。そうでないと機能しません！

</Pitfall>

### ステップ3: マークアップを追加する {/*step-3-add-markup*/}

コンポーネントは`src`と`alt`属性を持つ`<img />`タグを返します。`<img />`はHTMLのように書かれていますが、実際にはJavaScriptです！この構文は[JSX](/learn/writing-markup-with-jsx)と呼ばれ、JavaScript内にマークアップを埋め込むことができます。

リターン文は次のように1行で書くことができます。

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

しかし、マークアップが`return`キーワードと同じ行にない場合は、括弧で囲む必要があります。

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

括弧がないと、`return`の後の行のコードは[無視されます](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)！

</Pitfall>

## コンポーネントの使用 {/*using-a-component*/}

`Profile`コンポーネントを定義したので、他のコンポーネント内にネストできます。たとえば、複数の`Profile`コンポーネントを使用する`Gallery`コンポーネントをエクスポートできます。

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### ブラウザが見るもの {/*what-the-browser-sees*/}

大文字と小文字の違いに注意してください。

* `<section>`は小文字なので、ReactはHTMLタグを指していると認識します。
* `<Profile />`は大文字の`P`で始まるので、Reactは`Profile`というコンポーネントを使用したいと認識します。

そして`Profile`はさらにHTMLを含んでいます：`<img />`。最終的にブラウザが見るのは次のようになります。

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### コンポーネントのネストと整理 {/*nesting-and-organizing-components*/}

コンポーネントは通常のJavaScript関数なので、同じファイルに複数のコンポーネントを保持できます。これは、コンポーネントが比較的小さいか、互いに密接に関連している場合に便利です。このファイルが混雑してきた場合は、`Profile`を別のファイルに移動することができます。インポートに関するページでこれを学びます。[インポートとエクスポートのページ](/learn/importing-and-exporting-components)

`Profile`コンポーネントが`Gallery`内でレンダリングされているため、`Gallery`は**親コンポーネント**であり、各`Profile`を「子」としてレンダリングしています。これがReactの魔法の一部です：コンポーネントを一度定義すれば、好きな場所や好きな回数だけ使用できます。

<Pitfall>

コンポーネントは他のコンポーネントをレンダリングできますが、**定義をネストしてはいけません**。

```js {2-5}
export default function Gallery() {
  // 🔴 コンポーネントを他のコンポーネント内に定義しないでください！
  function Profile() {
    // ...
  }
  // ...
}
```

上記のスニペットは[非常に遅く、バグを引き起こします。](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) 代わりに、すべてのコンポーネントをトップレベルで定義します。

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ コンポーネントをトップレベルで宣言します
function Profile() {
  // ...
}
```

子コンポーネントが親からデータを必要とする場合は、定義をネストする代わりに[プロップスで渡します。](/learn/passing-props-to-a-component)

</Pitfall>

<DeepDive>

#### コンポーネントの階層 {/*components-all-the-way-down*/}

Reactアプリケーションは「ルート」コンポーネントから始まります。通常、新しいプロジェクトを開始すると自動的に作成されます。たとえば、[CodeSandbox](https://codesandbox.io/)を使用する場合や、[Next.js](https://nextjs.org/)フレームワークを使用する場合、ルートコンポーネントは`pages/index.js`に定義されています。これらの例では、ルートコンポーネントをエクスポートしています。

ほとんどのReactアプリは、コンポーネントを階層的に使用します。これは、ボタンのような再利用可能な部分だけでなく、サイドバー、リスト、最終的には完全なページのような大きな部分にもコンポーネントを使用することを意味します。コンポーネントは、UIコードとマークアップを整理する便利な方法です。たとえ一度しか使用しない場合でも。

[Reactベースのフレームワーク](/learn/start-a-new-react-project)はこれをさらに一歩進めます。空のHTMLファイルを使用し、ReactがJavaScriptでページを管理するのではなく、ReactコンポーネントからHTMLを自動生成します。これにより、JavaScriptコードが読み込まれる前にアプリがコンテンツを表示できるようになります。

それでも、多くのウェブサイトは既存のHTMLページにインタラクティブ性を追加するためにReactを使用しています。彼らはページ全体のための単一のルートコンポーネントではなく、多くのルートコンポーネントを持っています。必要なだけReactを使用できます。

</DeepDive>

<Recap>

Reactの最初の味を体験しました！いくつかの重要なポイントを振り返りましょう。

* Reactは、**アプリの再利用可能なUI要素**であるコンポーネントを作成できます。
* Reactアプリでは、すべてのUI要素がコンポーネントです。
* Reactコンポーネントは通常のJavaScript関数ですが、次の点が異なります。

  1. 名前は常に大文字で始まります。
  2. JSXマークアップを返します。

</Recap>

<Challenges>

#### コンポーネントをエクスポートする {/*export-the-component*/}

このサンドボックスはルートコンポーネントがエクスポートされていないため機能しません。

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

解決策を見る前に自分で修正してみてください！

<Solution>

関数定義の前に`export default`を追加します。

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

`export`だけではこの例を修正するのに十分でない理由が気になるかもしれません。`export`と`export default`の違いについては[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)で学ぶことができます。

</Solution>

#### リターン文を修正する {/*fix-the-return-statement*/}

この`return`文には何か問題があります。修正できますか？

<Hint>

修正しようとすると「Unexpected token」エラーが発生する場合があります。その場合、セミコロンが閉じ括弧の*後*に表示されていることを確認してください。`return ( )`内にセミコロンを残すとエラーが発生します。

</Hint>

<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

このコンポーネントを修正するには、リターン文を次のように1行に移動します。

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

または、返されるJSXマークアップを`return`の直後に開く括弧で囲みます。

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### 間違いを見つける {/*spot-the-mistake*/}

`Profile`コンポーネントの宣言と使用方法に何か問題があります。間違いを見つけられますか？（Reactがコンポーネントと通常のHTMLタグを区別する方法を思い出してください！）

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Reactコンポーネントの名前は大文字で始まる必要があります。

`function profile()`を`function Profile()`に変更し、すべての`<profile />`を`<Profile />`に変更します。

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### 自分のコンポーネント {/*your-own-component*/}

最初からコンポーネントを作成します。任意の有効な名前を付けて、任意のマークアップを返すことができます。アイデアが浮かばない場合は、`<h1>Good job!</h1>`を表示する`Congratulations`コンポーネントを書くことができます。エクスポートするのを忘れないでください！

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>