---
title: 条件付きレンダリング
---

<Intro>

コンポーネントは、異なる条件に応じて異なるものを表示する必要があることがよくあります。Reactでは、`if`文、`&&`、および`? :`演算子などのJavaScript構文を使用して、条件付きでJSXをレンダリングできます。

</Intro>

<YouWillLearn>

* 条件に応じて異なるJSXを返す方法
* JSXの一部を条件付きで含めたり除外したりする方法
* Reactのコードベースでよく見かける条件付き構文のショートカット

</YouWillLearn>

## 条件付きでJSXを返す {/*conditionally-returning-jsx*/}

`PackingList`コンポーネントがいくつかの`Item`をレンダリングし、それらが梱包済みかどうかを示すとします：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

いくつかの`Item`コンポーネントの`isPacked`プロップが`false`ではなく`true`に設定されていることに注意してください。`isPacked={true}`の場合、梱包済みのアイテムにチェックマーク（✔）を追加したいとします。

これを[`if`/`else`文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)として次のように書くことができます：

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

`isPacked`プロップが`true`の場合、このコードは**異なるJSXツリーを返します。**この変更により、いくつかのアイテムにチェックマークが付きます：

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

どちらの場合に返されるものを編集して、結果がどのように変わるかを確認してみてください！

JavaScriptの`if`および`return`文を使用して分岐ロジックを作成していることに注意してください。Reactでは、制御フロー（条件など）はJavaScriptによって処理されます。

### `null`で何も返さない条件付き {/*conditionally-returning-nothing-with-null*/}

場合によっては、何もレンダリングしたくないことがあります。たとえば、梱包済みのアイテムをまったく表示したくない場合です。コンポーネントは何かを返す必要があります。この場合、`null`を返すことができます：

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

`isPacked`がtrueの場合、コンポーネントは何も返さず、`null`を返します。それ以外の場合は、レンダリングするJSXを返します。

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

実際には、コンポーネントから`null`を返すことは一般的ではありません。なぜなら、それをレンダリングしようとする開発者を驚かせる可能性があるからです。より一般的には、親コンポーネントのJSXでコンポーネントを条件付きで含めたり除外したりします。次にその方法を説明します！

## 条件付きでJSXを含める {/*conditionally-including-jsx*/}

前の例では、コンポーネントが返すJSXツリーを制御しました。レンダリング出力にいくつかの重複があることに気付いたかもしれません：

```js
<li className="item">{name} ✔</li>
```

は

```js
<li className="item">{name}</li>
```

と非常に似ています。

両方の条件分岐は`<li className="item">...</li>`を返します：

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

この重複は有害ではありませんが、コードの保守性を低下させる可能性があります。`className`を変更したい場合、コードの2か所でそれを行う必要があります！このような状況では、少しのJSXを条件付きで含めることで、コードをより[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)にすることができます。

### 条件（3項）演算子（`? :`） {/*conditional-ternary-operator--*/}

JavaScriptには、条件式を記述するためのコンパクトな構文があります。それが[条件演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)または「3項演算子」です。

これの代わりに：

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

次のように書くことができます：

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

これは*「`isPacked`がtrueなら（`?`）、`name + ' ✔'`をレンダリングし、そうでなければ（`:`）`name`をレンダリングする」*と読むことができます。

<DeepDive>

#### これらの2つの例は完全に同等ですか？ {/*are-these-two-examples-fully-equivalent*/}

オブジェクト指向プログラミングの背景を持つ人は、上記の2つの例が微妙に異なると仮定するかもしれません。なぜなら、1つは異なる`<li>`の「インスタンス」を作成する可能性があるからです。しかし、JSX要素は「インスタンス」ではありません。内部状態を保持せず、実際のDOMノードでもありません。それらは軽量な記述、つまり設計図のようなものです。したがって、これらの2つの例は実際には完全に同等です。[状態の保持とリセット](/learn/preserving-and-resetting-state)は、この仕組みについて詳しく説明しています。

</DeepDive>

次に、完了したアイテムのテキストを別のHTMLタグ（例えば`<del>`）で囲んで取り消し線を引きたいとします。各ケースでより多くのJSXをネストしやすくするために、さらに多くの改行と括弧を追加できます：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

このスタイルは単純な条件にはうまく機能しますが、適度に使用してください。コンポーネントがネストされた条件付きマークアップで乱雑になる場合は、子コンポーネントを抽出して整理することを検討してください。Reactでは、マークアップはコードの一部であるため、変数や関数などのツールを使用して複雑な式を整理できます。

### 論理AND演算子（`&&`） {/*logical-and-operator-*/}

もう1つの一般的なショートカットは、[JavaScriptの論理AND（`&&`）演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.)です。Reactコンポーネント内では、条件がtrueの場合にJSXをレンダリングし、**そうでない場合は何もレンダリングしない**場合によく使用されます。`&&`を使用すると、`isPacked`が`true`の場合にのみチェックマークを条件付きでレンダリングできます：

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

これは*「`isPacked`なら（`&&`）、チェックマークをレンダリングし、そうでなければ何もレンダリングしない」*と読むことができます。

実際の動作は次のとおりです：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScriptの&&式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)は、左側（この場合は条件）が`true`の場合、右側の値（この場合はチェックマーク）を返します。しかし、条件が`false`の場合、式全体が`false`になります。Reactは`false`をJSXツリーの「穴」と見なし、`null`や`undefined`と同様に、その場所には何もレンダリングしません。

<Pitfall>

**`&&`の左側に数値を置かないでください。**

条件をテストするために、JavaScriptは左側を自動的にブール値に変換します。しかし、左側が`0`の場合、式全体がその値（`0`）を取得し、Reactは何もレンダリングしないのではなく、`0`をレンダリングします。

たとえば、`messageCount && <p>New messages</p>`のようなコードを書くのは一般的な間違いです。`messageCount`が`0`の場合、何もレンダリングされないと仮定しがちですが、実際には`0`自体がレンダリングされます！

これを修正するには、左側をブール値にします：`messageCount > 0 && <p>New messages</p>`。

</Pitfall>

### JSXを変数に条件付きで割り当てる {/*conditionally-assigning-jsx-to-a-variable*/}

ショートカットがプレーンなコードの記述を妨げる場合は、`if`文と変数を使用してみてください。[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)で定義された変数を再割り当てできるので、表示したいデフォルトの内容（名前）を提供することから始めます：

```js
let itemContent = name;
```

`isPacked`が`true`の場合、`if`文を使用してJSX式を`itemContent`に再割り当てします：

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[波括弧は「JavaScriptへの窓」を開きます。](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) 以前に計算された式をJSX内にネストし、波括弧を使用して返されるJSXツリーに変数を埋め込みます：

```js
<li className="item">
  {itemContent}
</li>
```

このスタイルは最も冗長ですが、最も柔軟です。実際の動作は次のとおりです：

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

以前と同様に、これはテキストだけでなく任意のJSXにも機能します：

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

JavaScriptに不慣れな場合、このさまざまなスタイルは最初は圧倒されるかもしれません。しかし、それらを学ぶことで、あらゆるJavaScriptコード（Reactコンポーネントだけでなく）を読み書きできるようになります！最初は好みのものを選び、他のものの動作を忘れた場合はこのリファレンスを再度参照してください。

<Recap>

* Reactでは、JavaScriptで分岐ロジックを制御します。
* `if`文を使用して条件付きでJSX式を返すことができます。
* JSXを変数に条件付きで保存し、波括弧を使用して他のJSX内に含めることができます。
* JSXでは、`{cond ? <A /> : <B />}`は*「`cond`なら`<A />`をレンダリングし、そうでなければ`<B />`をレンダリングする」*を意味します。
* JSXでは、`{cond && <A />}`は*「`cond`なら`<A />`をレンダリングし、そうでなければ何もレンダリングしない」*を意味します。
* ショートカットは一般的ですが、プレーンな`if`を好む場合は使用する必要はありません。

</Recap>

<Challenges>

#### `? :`を使用して未完了のアイテムにアイコンを表示する {/*show-an-icon-for-incomplete-items-with--*/}

条件演算子（`cond ? a : b`）を使用して、`isPacked`が`true`でない場合に❌をレンダリングします。

<Sandpack>

```js
function Item({ name,isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&`を使用してアイテムの重要性を表示する {/*show-the-item-importance-with-*/}

この例では、各`Item`が数値の`importance`プロップを受け取ります。`&&`演算子を使用して、重要性がゼロでないアイテムにのみイタリック体で「_(Importance: X)_」をレンダリングします。アイテムリストは次のようになります：

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

2つのラベルの間にスペースを追加するのを忘れないでください！

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

これでうまくいくはずです：

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance > 0 && ...`と書く必要があることに注意してください。`importance`が`0`の場合、`0`が結果としてレンダリングされないようにします！

この解決策では、名前と重要性ラベルの間にスペースを挿入するために2つの別々の条件が使用されています。代わりに、先頭にスペースを持つフラグメントを使用することもできます：`importance > 0 && <> <i>...</i></>`または`<i>`の内側にスペースを追加する：`importance > 0 && <i> ...</i>`。

</Solution>

#### 一連の`? :`を`if`と変数にリファクタリングする {/*refactor-a-series-of---to-if-and-variables*/}

この`Drink`コンポーネントは、一連の`? :`条件を使用して、`name`プロップが`"tea"`か`"coffee"`かに応じて異なる情報を表示します。問題は、各飲み物に関する情報が複数の条件に分散していることです。このコードをリファクタリングして、3つの`? :`条件の代わりに単一の`if`文を使用します。

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

コードを`if`を使用してリファクタリングしたら、さらに簡素化する方法についてのアイデアはありますか？

<Solution>

いくつかの方法がありますが、ここに1つの出発点があります：

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

ここでは、各飲み物に関する情報が複数の条件に分散するのではなく、一緒にグループ化されています。これにより、将来さらに多くの飲み物を追加するのが簡単になります。

もう1つの解決策は、情報をオブジェクトに移動して条件を完全に削除することです：

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>