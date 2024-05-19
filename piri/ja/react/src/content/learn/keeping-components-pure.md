---
title: コンポーネントを純粋に保つ
---

<Intro>

いくつかのJavaScript関数は*純粋*です。純粋な関数は計算のみを行い、それ以外のことはしません。コンポーネントを純粋な関数としてのみ記述することで、コードベースが成長するにつれて発生する不可解なバグや予測不可能な動作を回避できます。しかし、これらの利点を得るためには、いくつかのルールに従う必要があります。

</Intro>

<YouWillLearn>

* 純粋性とは何か、そしてそれがバグを回避するのにどのように役立つか
* レンダーフェーズでの変更を避けることでコンポーネントを純粋に保つ方法
* Strict Modeを使用してコンポーネントのミスを見つける方法

</YouWillLearn>

## 純粋性: 数式としてのコンポーネント {/*purity-components-as-formulas*/}

コンピュータサイエンス（特に関数型プログラミングの世界）では、[純粋関数](https://wikipedia.org/wiki/Pure_function)は次の特徴を持つ関数です：

* **自分の仕事に専念する。** 呼び出される前に存在していたオブジェクトや変数を変更しません。
* **同じ入力、同じ出力。** 同じ入力を与えられた場合、純粋関数は常に同じ結果を返すべきです。

数学の公式は純粋関数の一例として既に馴染みがあるかもしれません。

この数学の公式を考えてみましょう：<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>。

もし <Math><MathI>x</MathI> = 2</Math> なら、<Math><MathI>y</MathI> = 4</Math>。常に。

もし <Math><MathI>x</MathI> = 3</Math> なら、<Math><MathI>y</MathI> = 6</Math>。常に。

もし <Math><MathI>x</MathI> = 3</Math> なら、<MathI>y</MathI> は <Math>9</Math> や <Math>–1</Math> や <Math>2.5</Math> にはなりません。時間帯や株式市場の状態に関係なく。

もし <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> で <Math><MathI>x</MathI> = 3</Math> なら、<MathI>y</MathI> は _常に_ <Math>6</Math> です。

これをJavaScript関数にすると、次のようになります：

```js
function double(number) {
  return 2 * number;
}
```

上記の例では、`double` は **純粋関数** です。`3` を渡すと、`6` を返します。常に。

Reactはこの概念に基づいて設計されています。**Reactは、あなたが書くすべてのコンポーネントが純粋関数であると仮定しています。** これは、Reactコンポーネントが同じ入力を与えられた場合、常に同じJSXを返す必要があることを意味します：

<Sandpack>

```js src/App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>{drinkers}カップの水を沸かします。</li>
      <li>{drinkers}スプーンの茶葉と{0.5 * drinkers}スプーンのスパイスを加えます。</li>
      <li>{0.5 * drinkers}カップのミルクを沸かし、砂糖をお好みで加えます。</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>スパイスチャイのレシピ</h1>
      <h2>2人分</h2>
      <Recipe drinkers={2} />
      <h2>集まり用</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

`drinkers={2}` を `Recipe` に渡すと、`2カップの水` を含むJSXを返します。常に。

`drinkers={4}` を渡すと、`4カップの水` を含むJSXを返します。常に。

まるで数学の公式のように。

コンポーネントをレシピのように考えることができます：それらをフォローし、調理プロセス中に新しい材料を追加しなければ、毎回同じ料理が得られます。その「料理」は、コンポーネントがReactに提供するJSXです。[レンダリングするために。](/learn/render-and-commit)

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="x人分の紅茶のレシピ：xカップの水を取り、xスプーンの茶葉と0.5xスプーンのスパイスを加え、0.5xカップのミルクを加える" />

## 副作用: 意図しない結果 {/*side-effects-unintended-consequences*/}

Reactのレンダリングプロセスは常に純粋でなければなりません。コンポーネントはJSXを*返す*だけで、レンダリング前に存在していたオブジェクトや変数を*変更*してはいけません—それは不純にしてしまいます！

ここにこのルールを破るコンポーネントがあります：

<Sandpack>

```js
let guest = 0;

function Cup() {
  // 悪い例: 既存の変数を変更しています！
  guest = guest + 1;
  return <h2>ゲスト#{guest}のためのティーカップ</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

このコンポーネントは、外部で宣言された`guest`変数を読み書きしています。これは、**このコンポーネントを複数回呼び出すと異なるJSXが生成されることを意味します！** さらに、_他の_コンポーネントが`guest`を読み取ると、レンダリングされたタイミングによって異なるJSXが生成されます！これは予測不可能です。

数式に戻ると、<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>、今や <Math><MathI>x</MathI> = 2</Math> でも、<Math><MathI>y</MathI> = 4</Math> を信頼できません。テストが失敗し、ユーザーが困惑し、飛行機が空から落ちる—このようにして混乱を招くバグが発生することがわかります！

このコンポーネントを修正するには、[`guest`をプロップとして渡す](/learn/passing-props-to-a-component)必要があります：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>ゲスト#{guest}のためのティーカップ</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

これでコンポーネントは純粋になり、返されるJSXは`guest`プロップにのみ依存します。

一般的に、コンポーネントが特定の順序でレンダリングされることを期待すべきではありません。<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>を<Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>の前後どちらで呼び出しても関係ありません：両方の数式は互いに独立して解決されます。同様に、各コンポーネントは「自分自身のことだけを考え」、レンダリング中に他のコンポーネントと調整したり依存したりしないようにする必要があります。レンダリングは学校の試験のようなもので、各コンポーネントは自分自身でJSXを計算する必要があります！

<DeepDive>

#### StrictModeで不純な計算を検出する {/*detecting-impure-calculations-with-strict-mode*/}

まだすべてを使用していないかもしれませんが、Reactにはレンダリング中に読み取ることができる3種類の入力があります：[props](/learn/passing-props-to-a-component)、[state](/learn/state-a-components-memory)、および[context](/learn/passing-data-deeply-with-context)。これらの入力は常に読み取り専用として扱うべきです。

ユーザー入力に応じて何かを*変更*したい場合は、変数に書き込むのではなく、[stateを設定](/learn/state-a-components-memory)する必要があります。コンポーネントがレンダリングされている間に既存の変数やオブジェクトを変更してはいけません。

Reactは開発中に各コンポーネントの関数を2回呼び出す「Strict Mode」を提供しています。**Strict Modeはコンポーネント関数を2回呼び出すことで、これらのルールを破るコンポーネントを見つけるのに役立ちます。**

元の例が「ゲスト#2」、「ゲスト#4」、「ゲスト#6」と表示され、「ゲスト#1」、「ゲスト#2」、「ゲスト#3」と表示されなかったことに注意してください。元の関数は不純であったため、2回呼び出すと壊れました。しかし、修正された純粋なバージョンは、関数が毎回2回呼び出されても機能します。**純粋関数は計算のみを行うため、2回呼び出しても何も変わりません**—`double(2)`を2回呼び出しても返されるものは変わらず、<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>を2回解いても<MathI>y</MathI>が変わることはありません。同じ入力、同じ出力。常に。

Strict Modeは本番環境では効果がないため、ユーザーのアプリの速度を低下させることはありません。Strict Modeにオプトインするには、ルートコンポーネントを`<React.StrictMode>`でラップします。一部のフレームワークではこれがデフォルトで行われます。

</DeepDive>

### ローカルミューテーション: コンポーネントの小さな秘密 {/*local-mutation-your-components-little-secret*/}

上記の例では、問題はコンポーネントがレンダリング中に*既存の*変数を変更したことでした。これはしばしば**「ミューテーション」**と呼ばれ、少し怖く聞こえます。純粋関数は関数のスコープ外の変数や呼び出し前に作成されたオブジェクトを変更しません—それが不純にするのです！

しかし、**レンダリング中に*新しく*作成した変数やオブジェクトを変更することは完全に問題ありません。** この例では、`[]`配列を作成し、それを`cups`変数に割り当て、次に12個のカップを`push`します：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>ゲスト#{guest}のためのティーカップ</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

もし`cups`変数や`[]`配列が`TeaGathering`関数の外部で作成されていたら、これは大問題です！その配列にアイテムを追加することで*既存の*オブジェクトを変更していることになります。

しかし、`TeaGathering`内で*同じレンダリング中に*それらを作成したため、問題ありません。`TeaGathering`の外部のコードはこれが起こったことを知ることはありません。これは**「ローカルミューテーション」**と呼ばれ、コンポーネントの小さな秘密のようなものです。

## 副作用を引き起こす場所 {/*where-you-_can_-cause-side-effects*/}

関数型プログラミングは純粋性に大きく依存していますが、どこかで_何か_が変わらなければなりません。それがプログラミングのポイントです！これらの変更—画面の更新、アニメーションの開始、データの変更—は**副作用**と呼ばれます。それらはレンダリング中ではなく、_「副次的に」_発生するものです。

Reactでは、**副作用は通常[イベントハンドラ](/learn/responding-to-events)内に属します。** イベントハンドラは、ボタンをクリックするなどのアクションを実行したときにReactが実行する関数です。イベントハンドラはコンポーネント*内*で定義されているにもかかわらず、*レンダリング中には*実行されません！ **したがって、イベントハンドラは純粋である必要はありません。**

他のすべてのオプションを使い果たし、副作用に適したイベントハンドラが見つからない場合は、コンポーネント内で[`useEffect`](/reference/react/useEffect)呼び出しを使用して返されたJSXに副作用を添付することができます。これにより、Reactはレンダリング後に副作用が許可されるときにそれを実行するように指示します。**ただし、このアプローチは最後の手段とすべきです。**

可能な限り、レンダリングだけでロジックを表現するようにしてください。これがどれだけ役立つかに驚くことでしょう！

<DeepDive>

#### Reactが純粋性を気にする理由 {/*why-does-react-care-about-purity*/}

純粋な関数を書くには習慣と規律が必要です。しかし、それはまた素晴らしい機会を解放します：

* コンポーネントは異なる環境で実行される可能性があります—例えば、サーバー上で！同じ入力に対して同じ結果を返すため、1つのコンポーネントが多くのユーザーリクエストに対応できます。
* 入力が変更されていないコンポーネントのレンダリングを[スキップする](/reference/react/memo)ことでパフォーマンスを向上させることができます。これは純粋関数が常に同じ結果を返すため、安全にキャッシュできるからです。
* 深いコンポーネントツリーのレンダリング中にデータが変更された場合、Reactは古いレンダリングを完了する時間を無駄にせずにレンダリングを再開できます。純粋性はいつでも計算を停止することを安全にします。

私たちが構築しているすべての新しいReact機能は純粋性を活用しています。データフェッチングからアニメーション、パフォーマンスまで、コンポーネントを純粋に保つことはReactのパラダイムの力を解放します。

</DeepDive>

<Recap>

* コンポーネントは純粋でなければならず、つまり：
  * **自分の仕事に専念する。** レンダリング前に存在していたオブジェクトや変数を変更してはいけません。
  * **同じ入力、同じ出力。** 同じ入力を与えられた場合、コンポーネントは常に同じJSXを返すべきです。
* レンダリングはいつでも発生する可能性があるため、コンポーネントは他のコンポーネントのレンダリング順序に依存してはいけません。
* コンポーネントがレンダリングに使用する入力（props、state、context）を変更してはいけません。画面を更新するには、既存のオブジェクトを変更するのではなく、["stateを設定"](/learn/state-a-components-memory)します。
* コンポーネントのロジックを返すJSXで表現するように努めてください。何かを「変更」する必要がある場合は、通常、イベントハンドラで行うことをお勧めします。最後の手段として、`useEffect`を使用できます。
* 純粋な関数を書くには少し練習が必要ですが、それはReactのパラダイムの力を解放します</Recap>

<Challenges>

#### 壊れた時計を修正する {/*fix-a-broken-clock*/}

このコンポーネントは、午前0時から午前6時までの間に`<h1>`のCSSクラスを`"night"`に設定し、それ以外の時間帯では`"day"`に設定しようとしています。しかし、うまく機能していません。このコンポーネントを修正できますか？

コンピュータのタイムゾーンを一時的に変更して、解決策が機能するかどうかを確認できます。現在の時間が午前0時から午前6時の間である場合、時計は反転した色を持つべきです！

<Hint>

レンダリングは*計算*であり、何かを「行う」ことを試みるべきではありません。同じアイデアを別の方法で表現できますか？

</Hint>

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

このコンポーネントを修正するには、`className`を計算し、それをレンダリング出力に含める必要があります：

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

この例では、副作用（DOMの変更）はまったく必要ありませんでした。JSXを返すだけで十分でした。

</Solution>

#### 壊れたプロフィールを修正する {/*fix-a-broken-profile*/}

2つの`Profile`コンポーネントが異なるデータで並べてレンダリングされています。最初のプロフィールで「Collapse」を押してから「Expand」します。すると、両方のプロフィールが同じ人物を表示することに気づくでしょう。これはバグです。

バグの原因を見つけて修正してください。

<Hint>

バグのあるコードは`Profile.js`にあります。上から下までしっかり読んでください！

</Hint>

<Sandpack>

```js src/Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

問題は、`Profile`コンポーネントが`currentPerson`という既存の変数に書き込み、`Header`と`Avatar`コンポーネントがそれを読み取ることです。これにより、*3つすべて*が不純で予測が難しくなります。

バグを修正するには、`currentPerson`変数を削除します。代わりに、すべての情報を`Profile`から`Header`と`Avatar`にプロップとして渡します。`person`プロップを両方のコンポーネントに追加し、それをすべて渡す必要があります。

<Sandpack>

```js src/Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js src/Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js src/App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js src/utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Reactはコンポーネント関数が特定の順序で実行されることを保証しないため、変数を設定してそれらの間で通信することはできません。すべての通信はプロップを通じて行う必要があります。

</Solution>

#### 壊れたストーリートレイを修正する {/*fix-a-broken-story-tray*/}

あなたの会社のCEOがオンライン時計アプリに「ストーリー」を追加するように頼んできました。断ることはできません。`StoryTray`コンポーネントを作成し、`stories`のリストを受け取り、その後に「Create Story」プレースホルダーを追加しました。

「Create Story」プレースホルダーを実装するために、受け取った`stories`配列の最後にもう1つのフェイクストーリーを追加しました。しかし、なぜか「Create Story」が複数回表示されます。問題を修正してください。

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>現在の時刻は{time.toLocaleTimeString()}です。</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

時計が更新されるたびに「Create Story」が*2回*追加されることに気づきましたか？これは、レンダリング中にミューテーションが発生していることを示しています—Strict Modeはこれらの問題をより目立たせるためにコンポーネントを2回呼び出します。

`StoryTray`関数は純粋ではありません。受け取った`stories`配列（プロップ！）に`push`を呼び出すことで、`StoryTray`がレンダリングを開始する*前に*作成されたオブジェクトを変更しています。これにより、バグが発生し、予測が非常に難しくなります。

最も簡単な修正は、配列に触れずに「Create Story」を別々にレンダリングすることです：

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>現在の時刻は{time.toLocaleTimeString()}です。</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

または、アイテムを追加する前に*新しい*配列を作成する（既存の配列をコピーする）こともできます：

<Sandpack>

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  // 配列をコピー！
  let storiesToDisplay = stories.slice();

  // 元の配列には影響しません：
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>現在の時刻は{time.toLocaleTimeString()}です。</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

これにより、ミューテーションがローカルに保たれ、レンダリング関数が純粋になります。ただし、注意が必要です：例えば、配列の既存のアイテムを変更しようとした場合、それらのアイテムもクローンする必要があります。

配列に対する操作がそれをミューテートするかどうかを覚えておくと便利です。例えば、`push`、`pop`、`reverse`、`sort`は元の配列をミューテートしますが、`slice`、`filter`、`map`は新しい配列を作成します。

</Solution>

</Challenges>