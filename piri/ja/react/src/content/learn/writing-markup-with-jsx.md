---
title: JSXでマークアップを書く
---

<Intro>

*JSX*は、JavaScriptファイル内にHTMLのようなマークアップを書くことができるJavaScriptの構文拡張です。コンポーネントを書く他の方法もありますが、ほとんどのReact開発者はJSXの簡潔さを好み、ほとんどのコードベースで使用されています。

</Intro>

<YouWillLearn>

* なぜReactはマークアップとレンダリングロジックを混ぜるのか
* JSXがHTMLとどのように異なるのか
* JSXで情報を表示する方法

</YouWillLearn>

## JSX: マークアップをJavaScriptに組み込む {/*jsx-putting-markup-into-javascript*/}

WebはHTML、CSS、JavaScriptの上に構築されています。長年にわたり、ウェブ開発者はコンテンツをHTMLに、デザインをCSSに、ロジックをJavaScriptに分けていました—しばしば別々のファイルに！コンテンツはHTML内でマークアップされ、ページのロジックは別々にJavaScriptで管理されていました：

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="紫色の背景にHTMLマークアップと、2つの子タグ（pとform）を持つdiv。">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="黄色の背景に3つのJavaScriptハンドラー：onSubmit、onLogin、onClick。">

JavaScript

</Diagram>

</DiagramGroup>

しかし、Webがよりインタラクティブになるにつれて、ロジックがコンテンツを決定することが増えました。JavaScriptがHTMLを管理していたのです！これが**Reactでは、レンダリングロジックとマークアップが同じ場所—コンポーネント—に存在する理由です。**

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="前の例からHTMLとJavaScriptが混在するReactコンポーネント。関数名はSidebarで、黄色で強調表示されたisLoggedIn関数を呼び出します。関数内に紫色で強調表示されたpタグと、次の図で示されるコンポーネントを参照するFormタグがネストされています。">

`Sidebar.js` Reactコンポーネント

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="前の例からHTMLとJavaScriptが混在するReactコンポーネント。関数名はFormで、黄色で強調表示された2つのハンドラーonClickとonSubmitを含みます。ハンドラーの後には紫色で強調表示されたHTMLが続きます。HTMLには、各onClickプロップを持つネストされたinput要素を含むform要素が含まれています。">

`Form.js` Reactコンポーネント

</Diagram>

</DiagramGroup>

ボタンのレンダリングロジックとマークアップを一緒に保つことで、編集のたびにそれらが同期していることが保証されます。逆に、ボタンのマークアップとサイドバーのマークアップのように関連のない詳細は互いに分離されているため、どちらか一方を安全に変更することができます。

各Reactコンポーネントは、Reactがブラウザにレンダリングするマークアップを含むJavaScript関数です。Reactコンポーネントは、JSXと呼ばれる構文拡張を使用してそのマークアップを表現します。JSXはHTMLに非常に似ていますが、少し厳格で動的な情報を表示することができます。これを理解する最良の方法は、いくつかのHTMLマークアップをJSXマークアップに変換することです。

<Note>

JSXとReactは別物です。しばしば一緒に使用されますが、*独立して使用することもできます*。[詳細はこちら](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)。JSXは構文拡張であり、ReactはJavaScriptライブラリです。

</Note>

## HTMLをJSXに変換する {/*converting-html-to-jsx*/}

有効なHTMLがあるとします：

```html
<h1>ヘディ・ラマーのToDoリスト</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="ヘディ・ラマー" 
  class="photo"
>
<ul>
    <li>新しい信号機を発明する
    <li>映画のシーンをリハーサルする
    <li>スペクトル技術を改善する
</ul>
```

そして、これをコンポーネントに組み込みたいとします：

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

そのままコピー＆ペーストすると、動作しません：

<Sandpack>

```js
export default function TodoList() {
  return (
    // これはうまくいきません！
    <h1>ヘディ・ラマーのToDoリスト</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="ヘディ・ラマー" 
      class="photo"
    >
    <ul>
      <li>新しい信号機を発明する
      <li>映画のシーンをリハーサルする
      <li>スペクトル技術を改善する
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

これは、JSXがHTMLよりも厳格で、いくつかの追加ルールがあるためです！上記のエラーメッセージを読めば、マークアップを修正するためのガイドが表示されます。または、以下のガイドに従うこともできます。

<Note>

ほとんどの場合、Reactの画面上のエラーメッセージが問題の場所を見つけるのに役立ちます。行き詰まった場合は、エラーメッセージを読んでみてください！

</Note>

## JSXのルール {/*the-rules-of-jsx*/}

### 1. 単一のルート要素を返す {/*1-return-a-single-root-element*/}

コンポーネントから複数の要素を返すには、**単一の親タグでラップします。**

例えば、`<div>`を使用できます：

```js {1,11}
<div>
  <h1>ヘディ・ラマーのToDoリスト</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="ヘディ・ラマー" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

マークアップに余分な`<div>`を追加したくない場合は、`<>`と`</>`を使用できます：

```js {1,11}
<>
  <h1>ヘディ・ラマーのToDoリスト</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="ヘディ・ラマー" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

この空のタグは*[Fragment](/reference/react/Fragment)*と呼ばれます。Fragmentを使用すると、ブラウザのHTMLツリーに痕跡を残さずにグループ化できます。

<DeepDive>

#### なぜ複数のJSXタグをラップする必要があるのか？ {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSXはHTMLのように見えますが、内部ではプレーンなJavaScriptオブジェクトに変換されます。関数から2つのオブジェクトをラップせずに返すことはできません。これが、他のタグやFragmentでラップせずに2つのJSXタグを返すことができない理由です。

</DeepDive>

### 2. すべてのタグを閉じる {/*2-close-all-the-tags*/}

JSXではタグを明示的に閉じる必要があります：自己閉じタグの`<img>`は`<img />`に、ラッピングタグの`<li>oranges`は`<li>oranges</li>`と書く必要があります。

これがヘディ・ラマーの画像とリストアイテムを閉じた状態です：

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="ヘディ・ラマー" 
    class="photo"
   />
  <ul>
    <li>新しい信号機を発明する</li>
    <li>映画のシーンをリハーサルする</li>
    <li>スペクトル技術を改善する</li>
  </ul>
</>
```

### 3. camelCase <s>すべて</s> ほとんどのもの！ {/*3-camelcase-salls-most-of-the-things*/}

JSXはJavaScriptに変換され、JSXで書かれた属性はJavaScriptオブジェクトのキーになります。独自のコンポーネントでは、これらの属性を変数に読み込むことがよくあります。しかし、JavaScriptには変数名に制限があります。例えば、名前にダッシュを含めることはできず、`class`のような予約語を使用することもできません。

このため、Reactでは多くのHTMLおよびSVG属性がcamelCaseで書かれます。例えば、`stroke-width`の代わりに`strokeWidth`を使用します。`class`は予約語であるため、Reactでは代わりに`className`と書きます。これは[対応するDOMプロパティ](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)にちなんで名付けられています：

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="ヘディ・ラマー" 
  className="photo"
/>
```

これらの属性は[DOMコンポーネントのプロップのリスト](/reference/react-dom/components/common)で見つけることができます。間違えた場合でも心配しないでください—Reactは[ブラウザコンソール](https://developer.mozilla.org/docs/Tools/Browser_Console)に可能な修正を含むメッセージを表示します。

<Pitfall>

歴史的な理由から、[`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA)および[`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes)属性はダッシュを使用してHTMLのように書かれます。

</Pitfall>

### プロのヒント: JSXコンバーターを使用する {/*pro-tip-use-a-jsx-converter*/}

既存のマークアップのすべての属性を変換するのは面倒です！既存のHTMLおよびSVGをJSXに変換するために[コンバーター](https://transform.tools/html-to-jsx)を使用することをお勧めします。コンバーターは実際に非常に便利ですが、何が起こっているのかを理解して、自分でJSXを書くことができるようにする価値があります。

最終結果は次のとおりです：

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>ヘディ・ラマーのToDoリスト</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="ヘディ・ラマー" 
        className="photo" 
      />
      <ul>
        <li>新しい信号機を発明する</li>
        <li>映画のシーンをリハーサルする</li>
        <li>スペクトル技術を改善する</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

これで、JSXが存在する理由とコンポーネントでの使用方法がわかりました：

* Reactコンポーネントは、関連するレンダリングロジックとマークアップを一緒にグループ化します。
* JSXはHTMLに似ていますが、いくつかの違いがあります。必要に応じて[コンバーター](https://transform.tools/html-to-jsx)を使用できます。
* エラーメッセージは、マークアップを修正するための正しい方向を示してくれることがよくあります。

</Recap>

<Challenges>

#### HTMLをJSXに変換する {/*convert-some-html-to-jsx*/}

このHTMLはコンポーネントに貼り付けられましたが、有効なJSXではありません。修正してください：

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>私のウェブサイトへようこそ！</h1>
    </div>
    <p class="summary">
      ここで私の考えを見つけることができます。
      <br><br>
      <b>そして<i>科学者の写真</b></i>も！
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

手作業で行うか、コンバーターを使用するかはあなた次第です！

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>私のウェブサイトへようこそ！</h1>
      </div>
      <p className="summary">
        ここで私の考えを見つけることができます。
        <br /><br />
        <b>そして<i>科学者の写真</i></b>も！
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>