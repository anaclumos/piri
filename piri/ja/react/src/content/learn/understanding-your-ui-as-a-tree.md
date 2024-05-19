---
title: UIをツリーとして理解する
---

<Intro>

あなたのReactアプリは、多くのコンポーネントが互いにネストされて形作られています。Reactはどのようにしてアプリのコンポーネント構造を追跡しているのでしょうか？

Reactや他の多くのUIライブラリは、UIをツリーとしてモデル化します。アプリをツリーとして考えることは、コンポーネント間の関係を理解するのに役立ちます。この理解は、パフォーマンスや状態管理などの将来の概念をデバッグするのに役立ちます。

</Intro>

<YouWillLearn>

* Reactがコンポーネント構造をどのように「見る」か
* レンダーツリーとは何か、それが何に役立つか
* モジュール依存ツリーとは何か、それが何に役立つか

</YouWillLearn>

## ツリーとしてのUI {/*your-ui-as-a-tree*/}

ツリーはアイテム間の関係モデルであり、UIはしばしばツリー構造を使用して表現されます。例えば、ブラウザはツリー構造を使用してHTML（[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)）やCSS（[CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)）をモデル化します。モバイルプラットフォームもビュー階層を表現するためにツリーを使用します。

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="図は横に並んだ3つのセクションで構成されています。最初のセクションには、縦に積み重なった3つの長方形があり、それぞれに「Component A」、「Component B」、「Component C」とラベルが付いています。次のペインに移行する矢印にはReactのロゴが上にあり、「React」とラベルが付いています。中央のセクションには、ルートが「A」とラベル付けされ、2つの子が「B」と「C」とラベル付けされたコンポーネントのツリーがあります。次のセクションも「React DOM」とラベル付けされたReactのロゴが上にある矢印で移行します。最後のセクションはブラウザのワイヤーフレームで、8つのノードのツリーが含まれており、そのうちの一部だけが強調表示されています（中央のセクションからのサブツリーを示しています）。">

ReactはコンポーネントからUIツリーを作成します。この例では、UIツリーがDOMにレンダリングされます。
</Diagram>

ブラウザやモバイルプラットフォームと同様に、Reactもツリー構造を使用してReactアプリのコンポーネント間の関係を管理およびモデル化します。これらのツリーは、Reactアプリ内のデータフローを理解し、レンダリングやアプリサイズの最適化を行うための有用なツールです。

## レンダーツリー {/*the-render-tree*/}

コンポーネントの主要な機能の一つは、他のコンポーネントを構成する能力です。コンポーネントを[ネストする](/learn/your-first-component#nesting-and-organizing-components)と、親コンポーネントと子コンポーネントの概念が生まれ、各親コンポーネントは別のコンポーネントの子である場合があります。

Reactアプリをレンダリングするとき、この関係をツリーとしてモデル化することができ、これをレンダーツリーと呼びます。

ここに、インスピレーショナルな引用をレンダリングするReactアプリがあります。

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="ツリーグラフには5つのノードがあります。各ノードはコンポーネントを表しています。ツリーのルートはAppで、そこから'InspirationGenerator'と'FancyText'に向かって2つの矢印が伸びています。矢印には'renders'というラベルが付いています。'InspirationGenerator'ノードには'FancyText'と'Copyright'に向かう2つの矢印もあります。">

Reactはレンダーツリー、つまりレンダリングされたコンポーネントで構成されたUIツリーを作成します。

</Diagram>

この例のアプリから、上記のレンダーツリーを構築することができます。

ツリーはノードで構成されており、それぞれがコンポーネントを表しています。`App`、`FancyText`、`Copyright`などがツリー内のノードです。

Reactレンダーツリーのルートノードはアプリの[ルートコンポーネント](/learn/importing-and-exporting-components#the-root-component-file)です。この場合、ルートコンポーネントは`App`であり、Reactが最初にレンダリングするコンポーネントです。ツリー内の各矢印は親コンポーネントから子コンポーネントへの関係を示しています。

<DeepDive>

#### レンダーツリーにはHTMLタグはどこにあるのか？ {/*where-are-the-html-elements-in-the-render-tree*/}

上記のレンダーツリーには、各コンポーネントがレンダリングするHTMLタグが記載されていないことに気づくでしょう。これは、レンダーツリーがReactの[コンポーネント](learn/your-first-component#components-ui-building-blocks)のみで構成されているためです。

ReactはUIフレームワークとしてプラットフォームに依存しません。react.devでは、HTMLマークアップをUIプリミティブとして使用するウェブにレンダリングする例を紹介していますが、Reactアプリはモバイルやデスクトッププラットフォームにもレンダリングされる可能性があり、[UIView](https://developer.apple.com/documentation/uikit/uiview)や[FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0)などの異なるUIプリミティブを使用することがあります。

これらのプラットフォームUIプリミティブはReactの一部ではありません。Reactレンダーツリーは、アプリがどのプラットフォームにレンダリングされるかに関係なく、Reactアプリに関する洞察を提供できます。

</DeepDive>

レンダーツリーは、Reactアプリケーションの単一のレンダーパスを表します。[条件付きレンダリング](/learn/conditional-rendering)を使用すると、親コンポーネントは渡されたデータに応じて異なる子をレンダリングすることがあります。

アプリを更新して、インスピレーショナルな引用または色を条件付きでレンダリングするようにできます。

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="ツリーグラフには6つのノードがあります。ツリーの最上部のノードは'App'とラベル付けされており、'InspirationGenerator'と'FancyText'に向かって2つの矢印が伸びています。矢印は実線で、'renders'というラベルが付いています。'InspirationGenerator'ノードには3つの矢印もあります。'FancyText'と'Color'への矢印は点線で、'renders?'というラベルが付いています。最後の矢印は'Copyright'に向かっており、実線で'renders'というラベルが付いています。">

条件付きレンダリングでは、異なるレンダーごとにレンダーツリーが異なるコンポーネントをレンダリングすることがあります。

</Diagram>

この例では、`inspiration.type`が何であるかに応じて、`<FancyText>`または`<Color>`をレンダリングすることがあります。レンダーパスごとにレンダーツリーが異なる場合があります。

レンダーツリーはレンダーパスごとに異なる場合がありますが、これらのツリーは一般的にReactアプリの*トップレベル*および*リーフコンポーネント*を特定するのに役立ちます。トップレベルコンポーネントはルートコンポーネントに最も近いコンポーネントであり、その下のすべてのコンポーネントのレンダリングパフォーマンスに影響を与え、しばしば最も複雑です。リーフコンポーネントはツリーの下部にあり、子コンポーネントを持たず、頻繁に再レンダリングされることが多いです。

これらのコンポーネントのカテゴリを特定することは、アプリのデータフローとパフォーマンスを理解するのに役立ちます。

## モジュール依存ツリー {/*the-module-dependency-tree*/}

Reactアプリのもう一つの関係は、アプリのモジュール依存関係をツリーとしてモデル化することができます。コンポーネントやロジックを別々のファイルに[分割する](/learn/importing-and-exporting-components#exporting-and-importing-a-component)と、コンポーネント、関数、定数をエクスポートする[JSモジュール](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)を作成します。

モジュール依存ツリーの各ノードはモジュールであり、各ブランチはそのモジュール内の`import`文を表します。

前述のInspirationsアプリを例にとると、モジュール依存ツリー、または依存ツリーを構築することができます。

<Diagram name="module_dependency_tree" height={250} width={658} alt="ツリーグラフには7つのノードがあります。各ノードにはモジュール名がラベル付けされています。ツリーの最上部のノードは'App.js'とラベル付けされています。3つの矢印がモジュール'InspirationGenerator.js'、'FancyText.js'、'Copyright.js'に向かっており、矢印には'imports'というラベルが付いています。'InspirationGenerator.js'ノードからは、'FancyText.js'、'Color.js'、'inspirations.js'の3つのモジュールに向かって3つの矢印が伸びています。矢印には'imports'というラベルが付いています。">

Inspirationsアプリのモジュール依存ツリー。

</Diagram>

ツリーのルートノードはルートモジュール、またはエントリーポイントファイルとして知られています。通常、ルートコンポーネントを含むモジュールです。

同じアプリのレンダーツリーと比較すると、似た構造がありますが、いくつかの顕著な違いがあります：

* ツリーを構成するノードはコンポーネントではなくモジュールを表しています。
* `inspirations.js`のような非コンポーネントモジュールもこのツリーに表現されています。レンダーツリーはコンポーネントのみをカプセル化します。
* `Copyright.js`は`App.js`の下に表示されますが、レンダーツリーでは`Copyright`コンポーネントは`InspirationGenerator`の子として表示されます。これは、`InspirationGenerator`が[子プロップ](/learn/passing-props-to-a-component#passing-jsx-as-children)としてJSXを受け入れるため、子コンポーネントとして`Copyright`をレンダリングしますが、モジュールをインポートしないためです。

依存ツリーは、Reactアプリを実行するために必要なモジュールを特定するのに役立ちます。Reactアプリをプロダクション用にビルドする際には、クライアントに送信するために必要なJavaScriptをすべてバンドルするビルドステップが通常あります。この役割を担うツールは[バンドラー](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem)と呼ばれ、バンドラーは依存ツリーを使用してどのモジュールを含めるべきかを決定します。

アプリが成長するにつれて、バンドルサイズも大きくなることがよくあります。大きなバンドルサイズはクライアントがダウンロードして実行するのにコストがかかります。大きなバンドルサイズはUIの描画時間を遅らせる可能性があります。アプリの依存ツリーを把握することで、これらの問題のデバッグに役立つことがあります。

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* ツリーはエンティティ間の関係を表現する一般的な方法です。UIをモデル化するためによく使用されます。
* レンダーツリーは、単一のレンダーにおけるReactコンポーネント間のネスト関係を表します* 条件付きレンダリングでは、レンダーツリーは異なるレンダーごとに変わることがあります。異なるプロップ値により、コンポーネントは異なる子コンポーネントをレンダリングすることがあります。
* レンダーツリーは、トップレベルコンポーネントとリーフコンポーネントを特定するのに役立ちます。トップレベルコンポーネントはその下のすべてのコンポーネントのレンダリングパフォーマンスに影響を与え、リーフコンポーネントは頻繁に再レンダリングされることが多いです。これらを特定することは、レンダリングパフォーマンスの理解とデバッグに役立ちます。
* 依存ツリーは、Reactアプリのモジュール依存関係を表します。
* 依存ツリーは、ビルドツールがアプリを出荷するために必要なコードをバンドルするために使用されます。
* 依存ツリーは、ペイント時間を遅らせる大きなバンドルサイズをデバッグし、バンドルするコードを最適化する機会を見つけるのに役立ちます。

</Recap>

[TODO]: <> (Add challenges)