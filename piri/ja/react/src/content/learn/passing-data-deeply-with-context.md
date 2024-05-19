---
title: コンテキストを使用してデータを深く渡す
---

<Intro>

通常、親コンポーネントから子コンポーネントに情報を渡す際にはpropsを使用します。しかし、propsを多くの中間コンポーネントを通じて渡す必要がある場合や、アプリ内の多くのコンポーネントが同じ情報を必要とする場合、propsの使用は冗長で不便になることがあります。*Context*を使用すると、親コンポーネントがツリー内の任意のコンポーネントに情報を提供できるようになり、propsを明示的に渡すことなく、どれだけ深くても情報を利用できるようになります。

</Intro>

<YouWillLearn>

- "prop drilling"とは何か
- 繰り返しのprops渡しをcontextで置き換える方法
- contextの一般的な使用例
- contextの一般的な代替手段

</YouWillLearn>

## propsを渡す際の問題 {/*the-problem-with-passing-props*/}

[propsを渡す](/learn/passing-props-to-a-component)ことは、UIツリーを通じてデータを明示的にパイプし、それを使用するコンポーネントに渡す素晴らしい方法です。

しかし、propsをツリーの深い部分に渡す必要がある場合や、多くのコンポーネントが同じpropsを必要とする場合、propsの使用は冗長で不便になることがあります。最も近い共通の祖先がデータを必要とするコンポーネントから遠く離れている場合、[状態を持ち上げる](/learn/sharing-state-between-components)ことが必要になり、これが「prop drilling」と呼ばれる状況を引き起こすことがあります。

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="3つのコンポーネントのツリーを示す図。親コンポーネントには紫色で強調表示された値を表すバブルが含まれています。この値は2つの子コンポーネントに流れ、それぞれが紫色で強調表示されています。">

状態を持ち上げる

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="10個のノードからなるツリーを示す図。各ノードには2つ以下の子ノードがあります。ルートノードには紫色で強調表示された値を表すバブルが含まれています。この値は2つの子ノードに流れ、それぞれが値を渡しますが、値を含んでいません。左の子ノードは2つの子ノードに値を渡し、両方が紫色で強調表示されています。ルートの右の子ノードは2つの子ノードのうち1つに値を渡し、その右の子ノードが紫色で強調表示されています。その子ノードは1つの子ノードに値を渡し、その子ノードは2つの子ノードに値を渡し、両方が紫色で強調表示されています。">

Prop drilling

</Diagram>

</DiagramGroup>

ツリー内の必要なコンポーネントにpropsを渡さずにデータを「テレポート」できる方法があれば素晴らしいと思いませんか？Reactのcontext機能を使えば、それが可能です！

## Context: propsを渡す代替手段 {/*context-an-alternative-to-passing-props*/}

Contextを使用すると、親コンポーネントがツリー全体にデータを提供できます。contextには多くの用途があります。ここでは一例を紹介します。この`Heading`コンポーネントは、サイズのために`level`を受け取ります：

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

同じ`Section`内の複数の見出しが常に同じサイズであるようにしたいとします：

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

現在、各`<Heading>`に個別に`level`プロップを渡しています：

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

`level`プロップを`<Section>`コンポーネントに渡し、`<Heading>`から削除できれば便利です。これにより、同じセクション内のすべての見出しが同じサイズであることを強制できます：

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

しかし、`<Heading>`コンポーネントはどのようにして最も近い`<Section>`のレベルを知ることができるでしょうか？**それには、子がツリーの上部からデータを「要求」する方法が必要です。**

propsだけではそれを行うことはできません。ここでcontextが登場します。これを3つのステップで行います：

1. **contextを作成**します。（これは見出しのレベル用なので、`LevelContext`と呼ぶことができます。）
2. **そのcontextを使用**します。（`Heading`は`LevelContext`を使用します。）
3. **そのcontextを提供**します。（`Section`は`LevelContext`を提供します。）

Contextを使用すると、親コンポーネント（たとえ遠くにあっても）がツリー内のすべてのコンポーネントにデータを提供できます。

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="3つのコンポーネントのツリーを示す図。親コンポーネントにはオレンジ色で強調表示された値を表すバブルが含まれ、それが2つの子コンポーネントに投影され、両方がオレンジ色で強調表示されています。">

近い子コンポーネントでcontextを使用

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="10個のノードからなるツリーを示す図。各ノードには2つ以下の子ノードがあります。ルート親ノードにはオレンジ色で強調表示された値を表すバブルが含まれています。この値はツリー内の4つのリーフと1つの中間コンポーネントに直接投影され、すべてオレンジ色で強調表示されています。他の中間コンポーネントは強調表示されていません。">

遠い子コンポーネントでcontextを使用

</Diagram>

</DiagramGroup>

### ステップ1: contextを作成する {/*step-1-create-the-context*/}

まず、contextを作成する必要があります。**ファイルからエクスポート**して、コンポーネントがそれを使用できるようにします：

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`createContext`の唯一の引数は_デフォルト_値です。ここでは、`1`は最も大きな見出しレベルを指しますが、任意の値（オブジェクトでも）を渡すことができます。デフォルト値の重要性は次のステップでわかります。

### ステップ2: contextを使用する {/*step-2-use-the-context*/}

Reactから`useContext`フックとcontextをインポートします：

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

現在、`Heading`コンポーネントはpropsから`level`を読み取ります：

```js
export default function Heading({ level, children }) {
  // ...
}
```

代わりに、`level`プロップを削除し、インポートしたcontextである`LevelContext`から値を読み取ります：

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext`はフックです。`useState`や`useReducer`と同様に、フックはReactコンポーネントの内部で直接呼び出す必要があります（ループや条件の中では呼び出せません）。**`useContext`はReactに`Heading`コンポーネントが`LevelContext`を読み取りたいことを伝えます。**

`Heading`コンポーネントが`level`プロップを持たなくなったので、次のようにJSXで`Heading`にlevelプロップを渡す必要はありません：

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

JSXを更新して、`Section`がそれを受け取り、`Heading`から削除します：

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

これが動作するようにしようとしていたマークアップのリマインダーです：

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

この例はまだ完全には動作しません！すべての見出しが同じサイズになっています。**contextを*使用*しているにもかかわらず、まだ*提供*していないからです。** Reactはどこからcontextを取得するかを知りません！

contextを提供しない場合、Reactは前のステップで指定したデフォルト値を使用します。この例では、`createContext`の引数として`1`を指定したので、`useContext(LevelContext)`は`1`を返し、すべての見出しを`<h1>`に設定します。この問題を修正するために、各`Section`が独自のcontextを提供するようにしましょう。

### ステップ3: contextを提供する {/*step-3-provide-the-context*/}

`Section`コンポーネントは現在、子コンポーネントをレンダリングしています：

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**contextプロバイダーでラップ**して、`LevelContext`を提供します：

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

これはReactに「この
`<Section>`内の任意のコンポーネントが`LevelContext`を要求する場合、この`level`を提供するように指示します。コンポーネントはUIツリーの上部にある最も近い`<LevelContext.Provider>`の値を使用します。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

これは元のコードと同じ結果ですが、各`Heading`コンポーネントに`level`プロップを渡す必要はありませんでした！代わりに、`Heading`は最も近い`Section`からその見出しレベルを「見つけ出します」：

1. `level`プロップを`<Section>`に渡します。
2. `Section`は子コンポーネントを`<LevelContext.Provider value={level}>`でラップします。
3. `Heading`は`useContext(LevelContext)`で最も近い`LevelContext`の値を取得します。

## 同じコンポーネントからcontextを使用および提供する {/*using-and-providing-context-from-the-same-component*/}

現在、各セクションの`level`を手動で指定する必要があります：

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

contextを使用すると、上位のセクションから情報を読み取ることができるため、各`Section`は上位の`Section`から`level`を読み取り、自動的に`level + 1`を渡すことができます。以下のようにすることができます：

```js src/Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

この変更により、`level`プロップを`<Section>`や`<Heading>`に渡す必要がなくなります：

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

これで`Heading`と`Section`の両方が`LevelContext`を読み取り、自分がどれだけ「深い」かを判断します。そして、`Section`はその子コンポーネントを`LevelContext`でラップし、その中のすべてが「より深い」レベルにあることを指定します。

<Note>

この例では、ネストされたコンポーネントがcontextを上書きできる方法を視覚的に示すために見出しレベルを使用しています。しかし、contextは他の多くの使用例にも役立ちます。サブツリー全体で必要な情報（現在のカラーテーマ、現在ログインしているユーザーなど）を渡すことができます。

</Note>

## contextは中間コンポーネントを通過する {/*context-passes-through-intermediate-components*/}

contextを提供するコンポーネントとそれを使用するコンポーネントの間に、好きなだけ多くのコンポーネントを挿入できます。これには、`<div>`のような組み込みコンポーネントや、自分で作成したコンポーネントが含まれます。

この例では、同じ`Post`コンポーネント（破線の枠で囲まれたもの）が異なるネストレベルで2回レンダリングされています。内部の`<Heading>`は最も近い`<Section>`から自動的にレベルを取得します：

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

これが動作するために特別なことをする必要はありませんでした。`Section`はその内部のツリーに対してcontextを指定するため、どこに`<Heading>`を挿入しても正しいサイズになります。上のサンドボックスで試してみてください！

**Contextを使用すると、コンポーネントが「周囲に適応」し、どこで（または、どのcontextで）レンダリングされているかに応じて異なる表示を行うことができます。**

contextの動作は、[CSSプロパティの継承](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance)を思い出させるかもしれません。CSSでは、`<div>`に`color: blue`を指定すると、その内部の任意のDOMノードは、途中の他のDOMノードが`color: green`で上書きしない限り、その色を継承します。同様に、Reactでは、上から来るcontextを上書きする唯一の方法は、異なる値を持つcontextプロバイダーで子をラップすることです。

CSSでは、`color`や`background-color`のような異なるプロパティは互いに上書きしません。すべての`<div>`の`color`を赤に設定しても、`background-color`には影響しません。同様に、**異なるReactのcontextは互いに上書きしません。** `createContext()`で作成した各contextは他のcontextとは完全に独立しており、その特定のcontextを使用および提供するコンポーネントを結びつけます。1つのコンポーネントが多くの異なるcontextを使用または提供することも問題ありません。

## contextを使用する前に {/*before-you-use-context*/}

contextを使用するのは非常に魅力的です！しかし、これはcontextを過剰に使用するのも簡単であることを意味します。**いくつかのpropsを数レベル深く渡す必要があるからといって、その情報をcontextに入れるべきだとは限りません。**

contextを使用する前に検討すべきいくつかの代替手段を紹介します：

1. **まずは[propsを渡す](/learn/passing-props-to-a-component)ことから始めましょう。** コンポーネントがトリビアルでない場合、数十のpropsを数十のコンポーネントに渡すことは珍しくありません。それは手間に感じるかもしれませんが、どのコンポーネントがどのデータを使用しているかを非常に明確にします！あなたのコードを保守する人は、propsでデータフローを明示的にしてくれたことに感謝するでしょう。
2. **コンポーネントを抽出し、[JSXを`children`として渡す](/learn/passing-props-to-a-component#passing-jsx-as-children)ことを検討してください。** データを使用しない中間コンポーネントを通じて多くのレイヤーを通過させる場合、途中でいくつかのコンポーネントを抽出するのを忘れていることがよくあります。例えば、`posts`のようなデータpropsを直接使用しない視覚コンポーネントに渡す場合、`<Layout posts={posts} />`のようにするのではなく、`Layout`に`children`をpropsとして渡し、`<Layout><Posts posts={posts} /></Layout>`のようにします。これにより、データを指定するコンポーネントとそれを必要とするコンポーネントの間のレイヤー数が減ります。

これらのアプローチがうまくいかない場合は、contextを検討してください。

## contextの使用例 {/*use-cases-for-context*/}

* **テーマ設定:** アプリがユーザーに外観を変更させる場合（例：ダークモード）、アプリのトップにcontextプロバイダーを配置し、そのcontextを視覚的な外観を調整する必要があるコンポーネントで使用できます。
* **現在のアカウント:** 多くのコンポーネントが現在ログインしているユーザーを知る必要がある場合があります。contextに入れることで、ツリーのどこでも簡単に読み取ることができます。一部のアプリでは、複数のアカウントを同時に操作できる場合もあります（例：別のユーザーとしてコメントを残す）。そのような場合、UIの一部を異なる現在のアカウント値を持つネストされたプロバイダーでラップすることが便利です。
* **ルーティング:** ほとんどのルーティングソリューションは、現在のルートを保持するために内部的にcontextを使用します。これにより、すべてのリンクがアクティブかどうかを「知る」ことができます。独自のルーターを構築する場合も、同様にcontextを使用することを検討してください。
* **状態管理:** アプリが成長するにつれて、アプリのトップに近い場所に多くの状態が集まることがあります。下位の多くのコンポーネントがそれを変更したい場合があります。複雑な状態を管理し、遠くのコンポーネントに手間をかけずに渡すために、[reducerとcontextを一緒に使用する](/learn/scaling-up-with-reducer-and-context)ことが一般的です。

contextは静的な値に限定されません。次のレンダーで異なる値を渡すと、Reactはそれを読み取るすべてのコンポーネントを更新します！このため、contextはしばしば状態と組み合わせて使用されます。

一般的に、ツリーの異なる部分にある遠くのコンポーネントが情報を必要とする場合、contextが役立つ良い指標となります。

<Recap>

* contextを使用すると、コンポーネントがツリー全体に情報を提供できます。
* contextを渡すには：
  1. `export const MyContext = createContext(defaultValue)`で作成し、エクスポートします。
  2. 任意の子コンポーネントで`useContext(MyContext)`フックを使用して読み取ります。
  3. 親コンポーネントから`<MyContext.Provider value={...}>`でラップして提供します。
* contextは中間コンポーネントを通過します。
* contextを使用すると、コンポーネントが「周囲に適応」することができます。
* contextを使用する前に、propsを渡すか、JSXを`children`として渡すことを試してください。

</Recap>

<Challenges>

#### prop drillingをcontextで置き換える {/*replace-prop-drilling-with-context*/}

この例では、チェックボックスを切り替えると、各`<PlaceImage>`に渡される`imageSize`プロップが変更されます。チェックボックスの状態はトップレベルの`App`コンポーネントで保持されていますが、各`<PlaceImage>`はそれを認識する必要があります。

現在、`App`は`imageSize`を`List`に渡し、`List`はそれを各`Place`に渡し、`Place`はそれを`PlaceImage`に渡しています。`imageSize`プロップを削除し、代わりに`App`コンポーネントから直接`PlaceImage`に渡します。

`Context.js`でcontextを宣言できます。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js

```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

`imageSize`プロップをすべてのコンポーネントから削除します。

`Context.js`で`ImageSizeContext`を作成してエクスポートします。次に、`List`を`<ImageSizeContext.Provider value={imageSize}>`でラップして値を渡し、`PlaceImage`で`useContext(ImageSizeContext)`を使用して読み取ります：

<Sandpack>

```js src/App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repels mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

中間のコンポーネントが`imageSize`を渡す必要がなくなったことに注目してください。

</Solution>

</Challenges>