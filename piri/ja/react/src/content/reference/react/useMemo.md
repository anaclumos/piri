---
title: useMemo
---

<Intro>

`useMemo`は、再レンダリング間で計算結果をキャッシュするためのReact Hookです。

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

`useMemo`をコンポーネントのトップレベルで呼び出して、再レンダリング間で計算をキャッシュします：

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `calculateValue`: キャッシュしたい値を計算する関数です。純粋であるべきで、引数を取らず、任意の型の値を返すべきです。Reactは初回レンダリング時にこの関数を呼び出します。次回のレンダリング時には、`dependencies`が前回のレンダリングから変更されていない場合、Reactは同じ値を再び返します。そうでない場合、`calculateValue`を呼び出し、その結果を返し、後で再利用できるように保存します。

* `dependencies`: `calculateValue`コード内で参照されるすべてのリアクティブな値のリストです。リアクティブな値には、props、state、およびコンポーネント本体内で直接宣言されたすべての変数と関数が含まれます。リンターが[React用に設定されている](/learn/editor-setup#linting)場合、すべてのリアクティブな値が依存関係として正しく指定されていることを確認します。依存関係のリストは一定数の項目を持ち、`[dep1, dep2, dep3]`のようにインラインで書かれる必要があります。Reactは[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較を使用して各依存関係を前の値と比較します。

#### 戻り値 {/*returns*/}

初回レンダリング時に、`useMemo`は引数なしで`calculateValue`を呼び出した結果を返します。

次回のレンダリング時には、依存関係が変更されていない場合、前回のレンダリングから保存された値を返します。そうでない場合、`calculateValue`を再度呼び出し、その結果を返します。

#### 注意点 {/*caveats*/}

* `useMemo`はHookなので、**コンポーネントのトップレベル**または独自のHookでのみ呼び出すことができます。ループや条件内で呼び出すことはできません。その場合は、新しいコンポーネントを抽出し、状態をそこに移動します。
* ストリクトモードでは、Reactは**計算関数を2回呼び出して**、[偶発的な不純物を見つけるのを助けます。](#my-calculation-runs-twice-on-every-re-render) これは開発時のみの動作であり、本番環境には影響しません。計算関数が純粋であれば（そうあるべきです）、これはロジックに影響を与えません。呼び出しの1つの結果は無視されます。
* Reactは**特定の理由がない限り、キャッシュされた値を破棄しません。** 例えば、開発中にコンポーネントのファイルを編集すると、Reactはキャッシュを破棄します。開発中および本番環境の両方で、初回マウント中にコンポーネントがサスペンドすると、Reactはキャッシュを破棄します。将来的には、Reactはキャッシュを破棄することを利用する新機能を追加するかもしれません。例えば、Reactが将来的に仮想化リストの組み込みサポートを追加する場合、仮想化テーブルのビューポートからスクロールアウトするアイテムのキャッシュを破棄するのが理にかなっています。`useMemo`をパフォーマンス最適化のためだけに使用する場合、これは問題ありません。それ以外の場合は、[状態変数](/reference/react/useState#avoiding-recreating-the-initial-state)や[ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)がより適切かもしれません。

<Note>

このように戻り値をキャッシュすることは[*メモ化*](https://en.wikipedia.org/wiki/Memoization)とも呼ばれ、これがこのHookが`useMemo`と呼ばれる理由です。

</Note>

---

## 使用法 {/*usage*/}

### 高価な再計算のスキップ {/*skipping-expensive-recalculations*/}

再レンダリング間で計算をキャッシュするには、コンポーネントのトップレベルで`useMemo`呼び出しでラップします：

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo`に2つのものを渡す必要があります：

1. <CodeStep step={1}>引数を取らない計算関数</CodeStep>、例えば`() =>`のように、計算したいものを返します。
2. <CodeStep step={2}>依存関係のリスト</CodeStep>、計算内で使用されるコンポーネント内のすべての値を含みます。

初回レンダリング時に、`useMemo`から得られる<CodeStep step={3}>値</CodeStep>は、<CodeStep step={1}>計算</CodeStep>を呼び出した結果です。

次回のレンダリング時には、Reactは<CodeStep step={2}>依存関係</CodeStep>を前回のレンダリング時に渡された依存関係と比較します。依存関係が変更されていない場合（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)で比較）、`useMemo`は前回計算した値を返します。そうでない場合、Reactは計算を再実行し、新しい値を返します。

言い換えれば、`useMemo`は依存関係が変わるまで再レンダリング間で計算結果をキャッシュします。

**これが役立つ場合の例を見てみましょう。**

デフォルトでは、Reactは再レンダリングするたびにコンポーネント全体の本体を再実行します。例えば、この`TodoList`が状態を更新したり、親から新しいpropsを受け取ったりすると、`filterTodos`関数が再実行されます：

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

通常、これは問題ではありません。ほとんどの計算は非常に高速だからです。しかし、大きな配列をフィルタリングしたり変換したり、または高価な計算を行っている場合、データが変更されていない場合は再実行をスキップしたいかもしれません。`todos`と`tab`の両方が前回のレンダリング時と同じである場合、先ほどのように計算を`useMemo`でラップすることで、以前に計算した`visibleTodos`を再利用できます。

このタイプのキャッシュは*[メモ化](https://en.wikipedia.org/wiki/Memoization)*と呼ばれます。

<Note>

**`useMemo`はパフォーマンス最適化としてのみ依存するべきです。** それなしでコードが動作しない場合は、根本的な問題を見つけて修正してください。その後、パフォーマンスを向上させるために`useMemo`を追加することができます。

</Note>

<DeepDive>

#### 計算が高価かどうかを判断する方法 {/*how-to-tell-if-a-calculation-is-expensive*/}

一般的に、数千のオブジェクトを作成したりループしたりしない限り、高価ではない可能性が高いです。自信を持ちたい場合は、コードの一部にかかる時間を測定するためにコンソールログを追加できます：

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

測定している操作を実行します（例えば、入力に入力する）。その後、コンソールに`filter array: 0.15ms`のようなログが表示されます。全体のログ時間が（例えば`1ms`以上）かなりの量になる場合、その計算をメモ化することが理にかなっているかもしれません。実験として、計算を`useMemo`でラップして、その操作の合計ログ時間が減少したかどうかを確認できます：

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // todosとtabが変更されていない場合はスキップされます
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo`は*最初の*レンダリングを速くすることはありません。更新時の不要な作業をスキップするのに役立ちます。

あなたのマシンはユーザーのマシンよりも速い可能性が高いので、人工的な遅延を使用してパフォーマンスをテストするのが良いアイデアです。例えば、Chromeは[CPUスロットリング](https://developer.chrome.com/blog/new-in-devtools-61/#throttling)オプションを提供しています。

また、開発中のパフォーマンス測定は最も正確な結果を提供しないことに注意してください。（例えば、[Strict Mode](/reference/react/StrictMode)がオンの場合、各コンポーネントは1回ではなく2回レンダリングされます。）最も正確なタイミングを得るためには、アプリを本番用にビルドし、ユーザーが持っているようなデバイスでテストしてください。

</DeepDive>

<DeepDive>

#### useMemoをどこにでも追加すべきか？ {/*should-you-add-usememo-everywhere*/}

あなたのアプリがこのサイトのようであり、ほとんどの操作がページやセクション全体を置き換えるような粗いものである場合、メモ化は通常不要です。一方、あなたのアプリが描画エディタのようであり、ほとんどの操作が形状を移動するような細かいものである場合、メモ化が非常に役立つかもしれません。

`useMemo`での最適化は、いくつかのケースでのみ価値があります：

- `useMemo`に入れる計算が明らかに遅く、その依存関係がめったに変わらない場合。
- それを[`memo`](/reference/react/memo)でラップされたコンポーネントにpropとして渡す場合。値が変わっていない場合に再レンダリングをスキップしたい。メモ化により、依存関係が同じでない場合にのみコンポーネントが再レンダリングされます。
- 渡している値が他のHookの依存関係として後で使用される場合。例えば、別の`useMemo`計算値がそれに依存しているかもしれません。または、[`useEffect`](/reference/react/useEffect)からこの値に依存しているかもしれません。

他のケースでは、計算を`useMemo`でラップすることに利点はありません。それを行うことに大きな害もありませんので、一部のチームは個々のケースについて考えずにできるだけ多くのメモ化を選択します。このアプローチの欠点は、コードが読みづらくなることです。また、すべてのメモ化が効果的であるわけではありません。「常に新しい」単一の値がメモ化を破るのに十分です。

**実際には、いくつかの原則に従うことで多くのメモ化を不要にすることができます：**

1. コンポーネントが他のコンポーネントを視覚的にラップする場合、[JSXを子として受け入れるようにします。](/learn/passing-props-to-a-component#passing-jsx-as-children) これにより、ラッパーコンポーネントが独自の状態を更新するときに、Reactはその子が再レンダリングする必要がないことを認識します。
1. ローカル状態を優先し、必要以上に[状態を持ち上げないでください。](/learn/sharing-state-between-components) 例えば、フォームやアイテムがホバーされているかどうかなどの一時的な状態をツリーのトップやグローバル状態ライブラリに保持しないでください。
1. [レンダリングロジックを純粋に保ちます。](/learn/keeping-components-pure) コンポーネントの再レンダリングが問題を引き起こしたり、目に見える視覚的なアーティファクトを生成する場合、それはコンポーネントのバグです！バグを修正する代わりにメモ化を追加してください。
1. [状態を更新する不要なエフェクトを避けます。](/learn/you-might-not-need-an-effect) Reactアプリのほとんどのパフォーマンス問題は、エフェクトから始まる更新の連鎖によって引き起こされ、コンポーネントが何度もレンダリングされることによって引き起こされます。
1. [エフェクトから不要な依存関係を削除します。](/learn/removing-effect-dependencies) 例えば、メモ化の代わりに、オブジェクトや関数をエフェクト内またはコンポーネントの外に移動する方が簡単なことがよくあります。

特定の操作がまだ遅いと感じる場合は、[React Developer Toolsプロファイラ](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)を使用して、メモ化の恩恵を最も受けるコンポーネントを確認し、必要に応じてメモ化を追加します。これらの原則はコンポーネントをデバッグしやすく理解しやすくするので、どのケースでも従うのが良いです。長期的には、[自動的に細かいメモ化を行う](https://www.youtube.com/watch?v=lGEMwh32soc)ことを研究しており、これを一度に解決することを目指しています。

</DeepDive>

<Recipes titleText="useMemoと直接値を計算することの違い" titleId="examples-recalculation">

#### useMemoを使用して再計算をスキップする {/*skipping-recalculation-with-usememo*/}

この例では、`filterTodos`の実装が**人工的に遅く**されているため、レンダリング中に呼び出しているJavaScript関数が本当に遅い場合に何が起こるかを見ることができます。タブを切り替えたり、テーマを切り替えたりしてみてください。

タブの切り替えは遅く感じます。これは、遅くされた`filterTodos`が再実行されるためです。これは予想されることで、`tab`が変更されたため、計算全体を再実行する必要があります。（なぜ2回実行されるのか気になる場合は、[こちら](#my-calculation-runs-twice-on-every-re-render)で説明されています）

テーマを切り替えてみてください。**`useMemo`のおかげで、人工的な遅延にもかかわらず高速です！** 遅い`filterTodos`の呼び出しはスキップされました。なぜなら、`useMemo`に渡した依存関係である`todos`と`tab`が前回のレンダリングから変更されていないからです。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <
<label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>注意: <code>filterTodos</code>は人工的に遅くされています！</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 非常に遅いコードをエミュレートするために500ms間何もしない
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 常に値を再計算する {/*always-recalculating-a-value*/}

この例では、`filterTodos`の実装も**人工的に遅く**されているため、レンダリング中に呼び出しているJavaScript関数が本当に遅い場合に何が起こるかを見ることができます。タブを切り替えたり、テーマを切り替えたりしてみてください。

前の例とは異なり、テーマの切り替えも遅くなります！これは、このバージョンには`useMemo`呼び出しがないため、人工的に遅くされた`filterTodos`が毎回呼び出されるためです。`theme`が変更された場合でも呼び出されます。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>注意: <code>filterTodos</code>は人工的に遅くされています！</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 非常に遅いコードをエミュレートするために500ms間何もしない
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

しかし、ここでは**人工的な遅延を取り除いた**同じコードです。`useMemo`がないことが目立つかどうかを確認してください。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() to setTab('all')}>
        All
      </button>
      <button onClick={() to setTab('active')}>
        Active
      </button>
      <button onClick={() to setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js src/TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

多くの場合、メモ化なしのコードは問題なく動作します。操作が十分に速い場合、メモ化は必要ありません。

`utils.js`のtodoアイテムの数を増やして、動作がどのように変わるかを確認できます。この特定の計算は元々それほど高価ではありませんでしたが、todoの数が大幅に増えると、ほとんどのオーバーヘッドはフィルタリングではなく再レンダリングにあります。`useMemo`を使用して再レンダリングを最適化する方法については、以下を読み続けてください。

<Solution />

</Recipes>

---

### コンポーネントの再レンダリングをスキップする {/*skipping-re-rendering-of-components*/}

場合によっては、`useMemo`を使用して子コンポーネントの再レンダリングのパフォーマンスを最適化することもできます。これを説明するために、この`TodoList`コンポーネントが`visibleTodos`を子の`List`コンポーネントにpropとして渡すとしましょう：

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

`theme` propを切り替えるとアプリが一瞬フリーズすることに気づきましたが、JSXから`<List />`を削除すると速く感じます。これは、`List`コンポーネントを最適化する価値があることを示しています。

**デフォルトでは、コンポーネントが再レンダリングされると、Reactはその子を再帰的にすべて再レンダリングします。** これが、`TodoList`が異なる`theme`で再レンダリングされると、`List`コンポーネントも再レンダリングされる理由です。再レンダリングに多くの計算を必要としないコンポーネントには問題ありません。しかし、再レンダリングが遅いことを確認した場合、[`memo`](/reference/react/memo)でラップして、propsが前回のレンダリングと同じ場合に再レンダリングをスキップするように`List`に指示できます：

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**この変更により、`List`はすべてのpropsが前回のレンダリングと同じ場合に再レンダリングをスキップします。** ここで計算のキャッシュが重要になります！`useMemo`なしで`visibleTodos`を計算したと想像してください：

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // テーマが変更されるたびに、これは異なる配列になります...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... したがって、Listのpropsは常に同じではなく、毎回再レンダリングされます */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**上記の例では、`filterTodos`関数は常に*異なる*配列を作成します。** これは、`{}`オブジェクトリテラルが常に新しいオブジェクトを作成するのと同様です。通常、これは問題ではありませんが、`List`のpropsが常に同じではないため、[`memo`](/reference/react/memo)最適化が機能しません。ここで`useMemo`が役立ちます：

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // 再レンダリング間で計算をキャッシュするようにReactに指示します...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ... これらの依存関係が変更されない限り...
  );
  return (
    <div className={theme}>
      {/* ... Listは同じpropsを受け取り、再レンダリングをスキップできます */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**`visibleTodos`の計算を`useMemo`でラップすることで、再レンダリング間で*同じ*値を持つことを保証します**（依存関係が変更されるまで）。特定の理由がない限り、計算を`useMemo`でラップする必要はありません。この例では、[`memo`](/reference/react/memo)でラップされたコンポーネントに渡すために行っています。これにより、再レンダリングをスキップできます。他にも`useMemo`を追加する理由がいくつかあり、このページで説明されています。

<DeepDive>

#### 個々のJSXノードのメモ化 {/*memoizing-individual-jsx-nodes*/}

[`memo`](/reference/react/memo)で`List`をラップする代わりに、`<List />` JSXノード自体を`useMemo`でラップすることができます：

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

動作は同じです。`visibleTodos`が変更されていない場合、`List`は再レンダリングされません。

`<List items={visibleTodos} />`のようなJSXノードは、`{ type: List, props: { items: visibleTodos } }`のようなオブジェクトです。このオブジェクトを作成するのは非常に安価ですが、Reactはその内容が前回と同じかどうかを知りません。これが、デフォルトでReactが`List`コンポーネントを再レンダリングする理由です。

しかし、Reactが前回のレンダリングと同じJSXを見た場合、コンポーネントの再レンダリングを試みません。これは、JSXノードが[不変](https://en.wikipedia.org/wiki/Immutable_object)であるためです。JSXノードオブジェクトは時間とともに変わることがないため、Reactは再レンダリングをスキップしても安全であることを知っています。しかし、これが機能するためには、ノードが実際に同じオブジェクトである必要があります。コードで同じように見えるだけではありません。これがこの例で`useMemo`が行うことです。

JSXノードを手動で`useMemo`にラップするのは便利ではありません。例えば、条件付きでこれを行うことはできません。通常、コンポーネントを[`memo`](/reference/react/memo)でラップする理由はこれです。

</DeepDive>

<Recipes titleText="再レンダリングをスキップすることと常に再レンダリングすることの違い" titleId="examples-rerendering">

#### useMemoとmemoを使用して再レンダリングをスキップする {/*skipping-re-rendering-with-usememo-and-memo*/}

この例では、`List`コンポーネントが**人工的に遅く**されているため、レンダリングしているReactコンポーネントが本当に遅い場合に何が起こるかを見ることができます。タブを切り替えたり、テーマを切り替えたりしてみてください。

タブの切り替えは遅く感じます。これは、遅くされた`List`が再レンダリングされるためです。これは予想されることで、`tab`が変更されたため、ユーザーの新しい選択を画面に反映する必要があります。

次に、テーマを切り替えてみてください。**`useMemo`と[`memo`](/reference/react/memo)のおかげで、人工的な遅延にもかかわらず高速です！** `List`は再レンダリングをスキップしました。なぜなら、`visibleTodos`配列が前回のレンダリングから変更されていないからです。`visibleTodos`配列が変更されなかったのは、`useMemo`に渡した依存関係である`todos`と`tab`が前回のレンダリングから変更されていないからです。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() to setTab('all')}>
        All
      </button>
      <button onClick={() to setTab('active')}>
        Active
      </button>
      <button onClick={() to setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>注意: <code>List</code>は人工的に遅くされています！</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 非常に遅いコードをエミュレートするために500ms間何もしない
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 常にコンポーネントを再レンダリングする {/*always-re-rendering-a-component*/}

この例では、`List`の実装も**人工的に遅く**されているため、レンダリングしているReactコンポーネントが本当に遅い場合に何が起こるかを見ることができます。タブを切り替えたり、テーマを切り替えたりしてみてください。

前の例とは異なり、テーマの切り替えも遅くなります！これは、このバージョンには`useMemo`呼び出しがないため、`visibleTodos`が常に異なる配列であり、遅くされた`List`コンポーネントが再レンダリングをスキップできないためです。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() to setTab('all')}>
        All
      </button>
      <button onClick={() to setTab('active')}>
        Active
      </button>
      <button onClick={() to setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>注意: <code>List</code>は人工的に遅くされています！</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 非常に遅いコードをエミュレートするために500ms間何もしない
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

しかし、ここでは**人工的な遅延を取り除いた**同じコードです。`useMemo`がないことが目立つかどうかを確認してください。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() to setTab('all')}>
        All
      </button>
      <button onClick={() to setTab('active')}>
        Active
      </button>
      <button onClick={() to setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        ダークモード
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js src/List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js src/utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

多くの場合、メモ化なしのコードは問題なく動作します。操作が十分に速い場合、メモ化は必要ありません。

Reactを本番モードで実行し、[React Developer Tools](/learn/react-developer-tools)を無効にし、アプリのユーザーが持っているようなデバイスを使用して現実的な感覚を得ることを忘れないでください。

<Solution />

</Recipes>

---

### 別のHookの依存関係をメモ化する {/*memoizing-a-dependency-of-another-hook*/}

コンポーネント本体で直接作成されたオブジェクトに依存する計算があるとします：

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 注意: コンポーネント本体で作成されたオブジェクトに依存
  // ...
```

このようなオブジェクトに依存することは、メモ化のポイントを無意味にします。コンポーネントが再レンダリングされると、コンポーネント本体内のすべてのコードが再実行されます。**`searchOptions`オブジェクトを作成する行も毎回再実行されます。** `searchOptions`が`useMemo`呼び出しの依存関係であり、毎回異なるため、Reactは依存関係が異なることを認識し、`searchItems`を毎回再計算します。

これを修正するには、`searchOptions`オブジェクト自体を依存関係として渡す前にメモ化できます：

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ textが変更された場合のみ変更

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ allItemsまたはsearchOptionsが変更された場合のみ変更
  // ...
```

上記の例では、`text`が変更されない限り、`searchOptions`オブジェクトも変更されません。しかし、さらに良い修正は、`searchOptions`オブジェクトの宣言を`useMemo`計算関数内に移動することです：

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ allItemsまたはtextが変更された場合のみ変更
  // ...
```

これで計算は直接`text`に依存します（文字列であり、「偶然に」異なることはありません）。

---

### 関数をメモ化する {/*memoizing-a-function*/}

`Form`コンポーネントが[`memo`](/reference/react/memo)でラップされているとします。propとして関数を渡したいとします：

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

`{}`が異なるオブジェクトを作成するのと同様に、`function() {}`や`() => {}`のような関数宣言や式は、毎回*異なる*関数を生成します。新しい関数を作成すること自体は問題ではありません。これは避けるべきことではありません！しかし、`Form`コンポーネントがメモ化されている場合、propが変更されていないときに再レンダリングをスキップしたいと考えています。常に*異なる*propはメモ化のポイントを無意味にします。

関数を`useMemo`でメモ化するには、計算関数が別の関数を返す必要があります：

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

これは不格好に見えます！**関数のメモ化は一般的であるため、Reactにはそれ専用の組み込みHookがあります。関数を[`useCallback`](/reference/react/useCallback)でラップして、余分なネストされた関数を書く必要を避けることができます：**

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

上記の2つの例は完全に同等です。`useCallback`の唯一の利点は、内部に余分なネストされた関数を書く必要がないことです。それ以外には何も行いません。[`useCallback`について詳しく読む。](/reference/react/useCallback)

---

## トラブルシューティング {/*troubleshooting*/}

### 再レンダリングごとに計算が2回実行される {/*my-calculation-runs-twice-on-every-re-render*/}

[Strict Mode](/reference/react/StrictMode)では、Reactはいくつかの関数を1回ではなく2回呼び出します：

```js {2,5,6}
function TodoList({ todos, tab }) {
  // このコンポーネント関数は、各レンダリングごとに2回実行されます。

  const visibleTodos = useMemo(() => {
    // 依存関係が変更された場合、この計算は2回実行されます。
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

これは予想されることであり、コードを壊すべきではありません。

この**開発時のみ**の動作は、[コンポーネントを純粋に保つ](https://ja.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)のに役立ちます。Reactは呼び出しの1つの結果を使用し、他の呼び出しの結果を無視します。コンポーネントと計算関数が純粋である限り、これはロジックに影響を与えません。しかし、誤って不純である場合、この動作は間違いを見つけて修正するのに役立ちます。

例えば、この不純な計算関数は、propsとして受け取った配列を変更します：

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 間違い: propsを変更しています
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

Reactは関数を2回呼び出すため、todoが2回追加されることに気づくでしょう。計算は既存のオブジェクトを変更すべきではありませんが、計算中に作成した*新しい*オブジェクトを変更することは問題ありません。例えば、`filterTodos`関数が常に*異なる*配列を返す場合、その配列を変更することは問題ありません：

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ 正しい: 計算中に作成したオブジェクトを変更しています
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

[コンポーネントを純粋に保つ](https://ja.reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)について詳しく読む。

また、[オブジェクトの更新](https://ja.reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data)と[配列の更新](https://ja.reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data)についてのガイドも確認してください。

---

### `useMemo`呼び出しがオブジェクトを返すはずなのに、undefinedを返す {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

このコードは動作しません：

```js {1-2,5}
  // 🔴 アロー関数でオブジェクトを返すことはできません
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

JavaScriptでは、`() => {`はアロー関数の本体を開始するため、`{`ブレースはオブジェクトの一部ではありません。これがオブジェクトを返さない理由であり、間違いを引き起こします。`({`と`})`のように括弧を追加することで修正できます：

```js {1-2,5}
  // これは動作しますが、誰かが再び壊すのは簡単です
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

しかし、これはまだ混乱を招きやすく、誰かが括弧を削除して再び壊すのは簡単です。

この間違いを避けるために、明示的に`return`文を書きます：

```js {1-3,6-7}
  // ✅ これは動作し、明示的です
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### コンポーネントがレンダリングされるたびに、`useMemo`の計算が再実行される {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

依存関係の配列を第二引数として指定したことを確認してください！

依存関係の配列を忘れると、`useMemo`は毎回計算を再実行します：

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 依存関係の配列がないため、毎回再計算されます
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

これは、依存関係の配列を第二引数として渡す修正バージョンです：

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ 不要な再計算を行いません
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

これでも問題が解決しない場合、少なくとも1つの依存関係が前回のレンダリングと異なることが問題です。この問題をデバッグするために、依存関係を手動でコンソールにログ出力できます：

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

異なるレンダリングからの配列を右クリックして「グローバル変数として保存」を選択できます。最初のものが`temp1`として保存され、2番目のものが`temp2`として保存されたと仮定すると、ブラウザのコンソールを使用して各依存関係が同じかどうかを確認できます：

```js
Object.is(temp1[0], temp2[0]); // 配列間の最初の依存関係は同じですか？
Object.is(temp1[1], temp2[1]); // 配列間の2番目の依存関係は同じですか？
Object.is(temp1[2], temp2[2]); // ... すべての依存関係について同様に ...
```

メモ化を破る依存関係を見つけたら、それを削除するか、[それもメモ化します。](#memoizing-a-dependency-of-another-hook)

---

### ループ内で各リストアイテムに対して`useMemo`を呼び出す必要があるが、それは許可されていない {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart`コンポーネントが[`memo`](/reference/react/memo)でラップされているとします。`ReportList`コンポーネントが再レンダリングされるときに、すべての`Chart`の再レンダリングをスキップしたいとします。しかし、ループ内で`useMemo`を呼び出すことはできません：

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 ループ内でuseMemoを呼び出すことはできません：
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

代わりに、各アイテムのコンポーネントを抽出し、個々のアイテムのデータをメモ化します：

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ トップレベルでuseMemoを呼び出します：
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

または、`useMemo`を削除し、代わりに`Report`自体を[`memo`](/reference/react/memo)でラップすることもできます。`item` propが変更されない場合、`Report`は再レンダリングをスキップし、`Chart`も再レンダリングをスキップします：

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```