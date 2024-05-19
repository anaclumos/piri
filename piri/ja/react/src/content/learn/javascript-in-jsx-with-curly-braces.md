---
title: JSX内のJavaScriptは中括弧で囲む
---

<Intro>

JSXは、JavaScriptファイル内にHTMLのようなマークアップを書くことができ、レンダリングロジックとコンテンツを同じ場所に保つことができます。時には、そのマークアップ内に少しのJavaScriptロジックを追加したり、動的なプロパティを参照したりしたいことがあります。このような場合、JSX内で中括弧を使用してJavaScriptへの窓を開くことができます。

</Intro>

<YouWillLearn>

* 引用符付きの文字列を渡す方法
* JSX内で中括弧を使用してJavaScript変数を参照する方法
* JSX内で中括弧を使用してJavaScript関数を呼び出す方法
* JSX内で中括弧を使用してJavaScriptオブジェクトを使用する方法

</YouWillLearn>

## 引用符付きの文字列を渡す {/*passing-strings-with-quotes*/}

JSXに文字列属性を渡したい場合は、シングルクォートまたはダブルクォートで囲みます：

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

ここでは、`"https://i.imgur.com/7vQD0fPs.jpg"` と `"Gregorio Y. Zara"` が文字列として渡されています。

しかし、`src`や`alt`テキストを動的に指定したい場合はどうすればよいでしょうか？ **JavaScriptの値を使用して`"`と`"`を`{`と`}`に置き換える**ことができます：

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

`className="avatar"`は画像を丸くする`"avatar"`というCSSクラス名を指定し、`src={avatar}`はJavaScript変数`avatar`の値を読み取るという違いに注目してください。これは、中括弧を使用することで、マークアップ内でJavaScriptを操作できるからです！

## 中括弧の使用: JavaScriptの世界への窓 {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSXはJavaScriptを書く特別な方法です。つまり、中括弧`{ }`を使用してJavaScriptを使用することが可能です。以下の例では、まず科学者の名前`name`を宣言し、それを中括弧で`<h1>`内に埋め込んでいます：

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

`name`の値を`'Gregorio Y. Zara'`から`'Hedy Lamarr'`に変更してみてください。リストのタイトルがどのように変わるか確認してください。

中括弧内では、`formatDate()`のような関数呼び出しを含む任意のJavaScript式が動作します：

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### 中括弧の使用場所 {/*where-to-use-curly-braces*/}

JSX内で中括弧を使用できるのは2つの方法だけです：

1. **テキストとして** JSXタグ内に直接：`<h1>{name}'s To Do List</h1>`は動作しますが、`<{tag}>Gregorio Y. Zara's To Do List</{tag}>`は動作しません。
2. **属性として** `=`記号の直後に：`src={avatar}`は`avatar`変数を読み取りますが、`src="{avatar}"`は文字列`"{avatar}"`を渡します。

## "ダブルカール"の使用: JSX内のCSSおよびその他のオブジェクト {/*using-double-curlies-css-and-other-objects-in-jsx*/}

文字列、数値、およびその他のJavaScript式に加えて、JSX内でオブジェクトを渡すこともできます。オブジェクトも中括弧で表されるため、JSX内でJSオブジェクトを渡すには、オブジェクトをもう一対の中括弧で囲む必要があります：`person={{ name: "Hedy Lamarr", inventions: 5 }}`。

これはJSX内のインラインCSSスタイルで見ることができます。Reactはインラインスタイルの使用を必須としていません（ほとんどの場合、CSSクラスがうまく機能します）。しかし、インラインスタイルが必要な場合は、`style`属性にオブジェクトを渡します：

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

`backgroundColor`と`color`の値を変更してみてください。

このように書くと、JSX内の中括弧内にJavaScriptオブジェクトがあることがよくわかります：

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

次にJSX内で`{{`と`}}`を見たとき、それはJSXの中括弧内にオブジェクトがあるだけだと理解してください！

<Pitfall>

インライン`style`プロパティはキャメルケースで書かれます。例えば、HTMLの`<ul style="background-color: black">`は、コンポーネント内では`<ul style={{ backgroundColor: 'black' }}>`と書かれます。

</Pitfall>

## JavaScriptオブジェクトと中括弧を使ったさらに楽しいこと {/*more-fun-with-javascript-objects-and-curly-braces*/}

いくつかの式を1つのオブジェクトにまとめ、それをJSX内の中括弧で参照することができます：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

この例では、`person` JavaScriptオブジェクトが`name`文字列と`theme`オブジェクトを含んでいます：

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

コンポーネントは`person`からこれらの値を次のように使用できます：

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSXはテンプレート言語として非常にミニマルです。なぜなら、JavaScriptを使用してデータとロジックを整理できるからです。

<Recap>

これでJSXについてほぼすべてを知っています：

* 引用符内のJSX属性は文字列として渡されます。
* 中括弧を使用すると、JavaScriptのロジックや変数をマークアップに取り込むことができます。
* それらはJSXタグの内容内または属性の`=`の直後に機能します。
* `{{`と`}}`は特別な構文ではありません：JSXの中括弧内にJavaScriptオブジェクトが隠れています。

</Recap>

<Challenges>

#### 間違いを修正する {/*fix-the-mistake*/}

このコードは`Objects are not valid as a React child`というエラーでクラッシュします：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

問題を見つけられますか？

<Hint>中括弧の中に何があるかを見てください。正しいものを入れていますか？</Hint>

<Solution>

この例では、*オブジェクト自体*をマークアップにレンダリングしようとしているため、`<h1>{person}'s Todos</h1>`は`person`オブジェクト全体をレンダリングしようとしています！生のオブジェクトをテキストコンテンツとして含めると、Reactはそれをどのように表示するか分からないため、エラーが発生します。

これを修正するには、`<h1>{person}'s Todos</h1>`を`<h1>{person.name}'s Todos</h1>`に置き換えます：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### 情報をオブジェクトに抽出する {/*extract-information-into-an-object*/}

画像URLを`person`オブジェクトに抽出します。

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

画像URLを`person.imageUrl`というプロパティに移動し、カールを使用して`<img>`タグから読み取ります：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### JSX中括弧内に式を書く {/*write-an-expression-inside-jsx-curly-braces*/}

以下のオブジェクトでは、完全な画像URLが4つの部分に分割されています：ベースURL、`imageId`、`imageSize`、およびファイル拡張子。

画像URLはこれらの属性を組み合わせて作成したいです：ベースURL（常に`'https://i.imgur.com/'`）、`imageId`（`'7vQD0fP'`）、`imageSize`（`'s'`）、およびファイル拡張子（常に`'.jpg'`）。しかし、`<img>`タグが`src`を指定する方法に何か問題があります。

修正できますか？

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

修正がうまくいったかどうかを確認するには、`imageSize`の値を`'b'`に変更してみてください。編集後に画像がリサイズされるはずです。

<Solution>

`src={baseUrl + person.imageId + person.imageSize + '.jpg'}`と書くことができます。

1. `{`はJavaScript式を開きます
2. `baseUrl + person.imageId + person.imageSize + '.jpg'`は正しいURL文字列を生成します
3. `}`はJavaScript式を閉じます

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div{ padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

この式を`getImageUrl`のような別の関数に移動することもできます：

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

変数や関数を使用すると、マークアップをシンプルに保つことができます！

</Solution>

</Challenges>