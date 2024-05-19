---
title: memo
---

<Intro>

`memo`を使用すると、propsが変更されていない場合にコンポーネントの再レンダリングをスキップできます。

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

コンポーネントを`memo`でラップして、そのコンポーネントの*メモ化*バージョンを取得します。このメモ化されたコンポーネントは、親コンポーネントが再レンダリングされても、そのpropsが変更されていない限り通常は再レンダリングされません。ただし、Reactはそれでも再レンダリングすることがあります：メモ化はパフォーマンスの最適化であり、保証ではありません。

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `Component`: メモ化したいコンポーネント。`memo`はこのコンポーネントを変更せず、新しいメモ化されたコンポーネントを返します。関数や[`forwardRef`](/reference/react/forwardRef)コンポーネントを含む任意の有効なReactコンポーネントが受け入れられます。

* **オプション** `arePropsEqual`: コンポーネントの以前のpropsと新しいpropsを引数として受け取る関数。古いpropsと新しいpropsが等しい場合、つまり新しいpropsと古いpropsで同じ出力を生成し、同じ動作をする場合は`true`を返すべきです。それ以外の場合は`false`を返すべきです。通常、この関数を指定することはありません。デフォルトでは、Reactは各propsを[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)で比較します。

#### 戻り値 {/*returns*/}

`memo`は新しいReactコンポーネントを返します。提供されたコンポーネントと同じように動作しますが、親が再レンダリングされるときにpropsが変更されない限り、Reactは常に再レンダリングしません。

---

## 使用法 {/*usage*/}

### propsが変更されていない場合の再レンダリングのスキップ {/*skipping-re-rendering-when-props-are-unchanged*/}

Reactは通常、親コンポーネントが再レンダリングされるたびにコンポーネントを再レンダリングします。`memo`を使用すると、新しいpropsが古いpropsと同じである限り、親が再レンダリングされてもReactが再レンダリングしないコンポーネントを作成できます。このようなコンポーネントは*メモ化*されていると言います。

コンポーネントをメモ化するには、それを`memo`でラップし、元のコンポーネントの代わりに返される値を使用します：

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

Reactコンポーネントは常に[純粋なレンダリングロジック](/learn/keeping-components-pure)を持つべきです。これは、props、state、およびcontextが変更されていない場合、同じ出力を返す必要があることを意味します。`memo`を使用することで、Reactに対してコンポーネントがこの要件を満たしていることを伝え、propsが変更されない限り再レンダリングする必要がないことを示します。`memo`を使用しても、コンポーネント自身のstateが変更された場合や、使用しているcontextが変更された場合には再レンダリングされます。

この例では、`Greeting`コンポーネントは`name`が変更されるたびに再レンダリングされます（それはpropsの一つだからです）が、`address`が変更されても再レンダリングされません（それは`Greeting`にpropsとして渡されていないからです）：

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**`memo`はあくまでパフォーマンスの最適化としてのみ使用すべきです。** もし`memo`なしでコードが動作しない場合は、まず根本的な問題を見つけて修正してください。その後、パフォーマンスを向上させるために`memo`を追加することができます。

</Note>

<DeepDive>

#### すべての場所にmemoを追加すべきですか？ {/*should-you-add-memo-everywhere*/}

もしあなたのアプリがこのサイトのようで、ほとんどのインタラクションがページやセクション全体を置き換えるような粗いものであれば、メモ化は通常不要です。一方、あなたのアプリが描画エディタのようで、ほとんどのインタラクションが形状を移動するような細かいものであれば、メモ化が非常に役立つかもしれません。

`memo`による最適化は、コンポーネントが同じpropsで頻繁に再レンダリングされ、その再レンダリングロジックが高価な場合にのみ価値があります。コンポーネントが再レンダリングされるときに知覚できる遅延がない場合、`memo`は不要です。コンポーネントに渡されるpropsが*常に異なる*場合、例えばレンダリング中に定義されたオブジェクトや関数を渡す場合、`memo`は完全に無意味です。このため、`memo`と一緒に[`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components)や[`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)が必要になることがよくあります。

他の場合にコンポーネントを`memo`でラップすることに利点はありません。それを行うことに大きな害もないため、一部のチームは個々のケースについて考えずにできるだけ多くのコンポーネントをメモ化することを選択します。このアプローチの欠点は、コードが読みづらくなることです。また、すべてのメモ化が効果的であるわけではありません。「常に新しい」単一の値がメモ化を破壊するのに十分です。

**実際には、いくつかの原則に従うことで多くのメモ化を不要にすることができます：**

1. コンポーネントが他のコンポーネントを視覚的にラップする場合、[JSXを子として受け入れる](/learn/passing-props-to-a-component#passing-jsx-as-children)ようにします。これにより、ラッパーコンポーネントが自身のstateを更新するときに、Reactはその子が再レンダリングする必要がないことを認識します。
1. ローカルstateを優先し、[stateを必要以上に上に持ち上げない](/learn/sharing-state-between-components)ようにします。例えば、フォームやアイテムがホバーされているかどうかなどの一時的なstateをツリーのトップやグローバルstateライブラリに保持しないでください。
1. [レンダリングロジックを純粋に保つ](/learn/keeping-components-pure)ようにします。コンポーネントの再レンダリングが問題を引き起こしたり、目に見える視覚的なアーティファクトを生成する場合、それはコンポーネントのバグです！バグを修正する代わりにメモ化を追加しないでください。
1. [stateを更新する不要なEffectを避ける](/learn/you-might-not-need-an-effect)ようにします。Reactアプリのほとんどのパフォーマンス問題は、Effectから始まる更新の連鎖によって引き起こされ、コンポーネントが何度もレンダリングされることによって発生します。
1. [Effectから不要な依存関係を削除する](/learn/removing-effect-dependencies)ようにします。例えば、メモ化の代わりに、オブジェクトや関数をEffectの内部やコンポーネントの外部に移動する方が簡単なことがよくあります。

特定のインタラクションがまだ遅いと感じる場合は、[React Developer Toolsのプロファイラ](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)を使用して、メモ化の恩恵を最も受けるコンポーネントを確認し、必要な場所にメモ化を追加します。これらの原則は、コンポーネントをデバッグしやすく理解しやすくするため、いずれにしても従うのが良いです。長期的には、[細かいメモ化を自動的に行う](https://www.youtube.com/watch?v=lGEMwh32soc)研究を進めており、これを一度に解決することを目指しています。

</DeepDive>

---

### stateを使用してメモ化されたコンポーネントを更新する {/*updating-a-memoized-component-using-state*/}

コンポーネントがメモ化されていても、自身のstateが変更された場合には再レンダリングされます。メモ化は親からコンポーネントに渡されるpropsにのみ関係します。

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

state変数を現在の値に設定すると、`memo`なしでもReactはコンポーネントの再レンダリングをスキップします。コンポーネント関数が余分に呼び出されることがありますが、その結果は破棄されます。

---

### contextを使用してメモ化されたコンポーネントを更新する {/*updating-a-memoized-component-using-a-context*/}

コンポーネントがメモ化されていても、使用しているcontextが変更された場合には再レンダリングされます。メモ化は親からコンポーネントに渡されるpropsにのみ関係します。

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

コンポーネントが一部のcontextが変更されたときにのみ再レンダリングされるようにするには、コンポーネントを2つに分割します。外側のコンポーネントでcontextから必要なものを読み取り、メモ化された子にpropsとして渡します。

---

### propsの変更を最小限に抑える {/*minimizing-props-changes*/}

`memo`を使用すると、コンポーネントは以前のpropsと*浅い等価性*がない限り、再レンダリングされます。これは、Reactがコンポーネントの各propsを以前の値と[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較を使用して比較することを意味します。`Object.is(3, 3)`は`true`ですが、`Object.is({}, {})`は`false`です。

`memo`の効果を最大限に引き出すために、propsの変更を最小限に抑えます。例えば、propsがオブジェクトである場合、親コンポーネントが毎回そのオブジェクトを再作成しないように[`useMemo`](/reference/react/useMemo)を使用します：

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

propsの変更を最小限に抑えるより良い方法は、コンポーネントがpropsに必要な最小限の情報を受け入れるようにすることです。例えば、全体のオブジェクトではなく、個々の値を受け入れることができます：

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

個々の値であっても、変更頻度が少ないものに投影することができます。例えば、ここではコンポーネントが値自体ではなく、値の存在を示すブール値を受け入れます：

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

メモ化されたコンポーネントに関数を渡す必要がある場合、その関数をコンポーネントの外部で宣言して変更されないようにするか、[`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components)を使用して再レンダリング間で定義をキャッシュします。

---

### カスタム比較関数を指定する {/*specifying-a-custom-comparison-function*/}

メモ化されたコンポーネントのpropsの変更を最小限に抑えることが難しい場合、カスタム比較関数を提供することができます。この関数は`memo`の第二引数として渡され、浅い等価性の代わりに古いpropsと新しいpropsを比較するために使用されます。この関数は、新しいpropsが古いpropsと同じ出力を生成する場合にのみ`true`を返すべきです。それ以外の場合は`false`を返すべきです。

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

この場合、カスタム比較関数がコンポーネントの再レンダリングよりも実際に高速であることを確認するために、ブラウザの開発者ツールのパフォーマンスパネルを使用してください。驚くかもしれません。

パフォーマンス測定を行う際は、Reactがプロダクションモードで実行されていることを確認してください。

<Pitfall>

カスタム`arePropsEqual`実装を提供する場合、**すべてのprops（関数を含む）を比較する必要があります。** 関数はしばしば親コンポーネントのpropsやstateを[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)します。`oldProps.onClick !== newProps.onClick`の場合に`true`を返すと、コンポーネントは以前のレンダリングのpropsやstateを`onClick`ハンドラ内で「見続ける」ことになり、非常に混乱するバグが発生します。

データ構造の深さが限られていることが確実でない限り、`arePropsEqual`内での深い等価性チェックは避けてください。**深い等価性チェックは非常に遅くなる可能性があり、データ構造が後で変更された場合、アプリが数秒間フリーズすることがあります。**

</Pitfall>

---

## トラブルシューティング {/*troubleshooting*/}
### propsがオブジェクト、配列、または関数である場合にコンポーネントが再レンダリングされる {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

Reactは古いpropsと新しいpropsを浅い等価性で比較します。つまり、各新しいpropsが古いpropsと参照等価であるかどうかを考慮します。親が再レンダリングされるたびに新しいオブジェクトや配列を作成すると、個々の要素が同じであっても、Reactはそれを変更されたと見なします。同様に、親コンポーネントをレンダリングする際に新しい関数を作成すると、その関数が同じ定義を持っていても、Reactはそれを変更されたと見なします。これを避けるために、[propsを簡素化するか、親コンポーネントでpropsをメモ化します](#minimizing-props-changes)。