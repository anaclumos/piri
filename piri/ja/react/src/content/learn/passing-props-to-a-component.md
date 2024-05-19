---
title: コンポーネントにプロップスを渡す
---

<Intro>

Reactコンポーネントは*props*を使用して互いに通信します。親コンポーネントは、propsを与えることで子コンポーネントに情報を渡すことができます。PropsはHTML属性を思い出させるかもしれませんが、オブジェクト、配列、関数など、任意のJavaScript値を通過させることができます。

</Intro>

<YouWillLearn>

* コンポーネントにpropsを渡す方法
* コンポーネントからpropsを読み取る方法
* propsのデフォルト値を指定する方法
* JSXをコンポーネントに渡す方法
* 時間の経過とともにpropsがどのように変化するか

</YouWillLearn>

## おなじみのprops {/*familiar-props*/}

Propsは、JSXタグに渡す情報です。例えば、`className`、`src`、`alt`、`width`、`height`は、`<img>`に渡すことができるpropsの一部です：

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

`<img>`タグに渡すことができるpropsは事前に定義されています（ReactDOMは[HTML標準](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)に準拠しています）。しかし、*自分の*コンポーネント、例えば`<Avatar>`に任意のpropsを渡してカスタマイズすることができます。以下にその方法を示します！

## コンポーネントにpropsを渡す {/*passing-props-to-a-component*/}

このコードでは、`Profile`コンポーネントは子コンポーネント`Avatar`にpropsを渡していません：

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

`Avatar`にpropsを渡すには、2つのステップがあります。

### ステップ1: 子コンポーネントにpropsを渡す {/*step-1-pass-props-to-the-child-component*/}

まず、`Avatar`にいくつかのpropsを渡します。例えば、`person`（オブジェクト）と`size`（数値）の2つのpropsを渡してみましょう：

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

`person=`の後の二重中括弧が混乱する場合は、それが[単にオブジェクト](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)であることを思い出してください。

</Note>

これで、`Avatar`コンポーネント内でこれらのpropsを読み取ることができます。

### ステップ2: 子コンポーネント内でpropsを読み取る {/*step-2-read-props-inside-the-child-component*/}

これらのpropsを読み取るには、`function Avatar`の直後に`({`と`})`の中にカンマで区切って`person, size`の名前をリストします。これにより、変数のように`Avatar`のコード内で使用できます。

```js
function Avatar({ person, size }) {
  // personとsizeがここで利用可能
}
```

`Avatar`に`person`と`size`のpropsを使用するロジックを追加し、完了です。

これで、異なるpropsで`Avatar`をさまざまな方法でレンダリングすることができます。値を調整してみてください！

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js src/utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Propsを使用すると、親コンポーネントと子コンポーネントを独立して考えることができます。例えば、`Profile`内の`person`や`size`のpropsを変更しても、`Avatar`がそれらをどのように使用するかを考える必要はありません。同様に、`Avatar`がこれらのpropsをどのように使用するかを変更しても、`Profile`を見る必要はありません。

Propsは「ノブ」のようなもので、調整することができます。関数の引数と同じ役割を果たします。実際、propsはコンポーネントの唯一の引数です！Reactコンポーネント関数は単一の引数、`props`オブジェクトを受け取ります：

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

通常、`props`オブジェクト全体は必要ないので、個々のpropsに分解します。

<Pitfall>

**propsを宣言する際の`(`と`)`の中の`{`と`}`のペアを見逃さないでください**：

```js
function Avatar({ person, size }) {
  // ...
}
```

この構文は["分割代入"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)と呼ばれ、関数パラメータからプロパティを読み取ることと同等です：

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Propのデフォルト値を指定する {/*specifying-a-default-value-for-a-prop*/}

指定された値がない場合にフォールバックするためにpropにデフォルト値を与えたい場合は、パラメータの直後に`=`とデフォルト値を置くことで分割代入を使用して行うことができます：

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

これで、`<Avatar person={...} />`が`size` propなしでレンダリングされると、`size`は`100`に設定されます。

デフォルト値は`size` propが欠落している場合や`size={undefined}`を渡した場合にのみ使用されます。しかし、`size={null}`や`size={0}`を渡した場合、デフォルト値は**使用されません**。

## JSXスプレッド構文でpropsを転送する {/*forwarding-props-with-the-jsx-spread-syntax*/}

時々、propsを渡すことが非常に反復的になります：

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

反復的なコードには何の問題もありません。それはより読みやすくなることがあります。しかし、時には簡潔さを重視することもあります。いくつかのコンポーネントは、`Profile`が`Avatar`に対して行うように、すべてのpropsを子に転送します。これらのpropsを直接使用しないため、より簡潔な「スプレッド」構文を使用することが理にかなっています：

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

これにより、`Profile`のすべてのpropsが名前をリストすることなく`Avatar`に転送されます。

**スプレッド構文は控えめに使用してください。** もしそれを他のコンポーネントで頻繁に使用している場合、何かが間違っています。多くの場合、それはコンポーネントを分割し、子をJSXとして渡すべきであることを示しています。次に詳しく説明します！

## JSXを子として渡す {/*passing-jsx-as-children*/}

組み込みのブラウザタグをネストすることは一般的です：

```js
<div>
  <img />
</div>
```

時々、自分のコンポーネントを同じようにネストしたくなることがあります：

```js
<Card>
  <Avatar />
</Card>
```

JSXタグの中にコンテンツをネストすると、親コンポーネントはそのコンテンツを`children`というpropで受け取ります。例えば、以下の`Card`コンポーネントは`children` propに設定された`<Avatar />`を受け取り、ラッパーdivの中でレンダリングします：

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

```js src/Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

```js src/utils.js
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
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

`<Card>`の中の`<Avatar>`をテキストに置き換えて、`Card`コンポーネントが任意のネストされたコンテンツをラップできることを確認してください。それが何をレンダリングしているかを「知る」必要はありません。この柔軟なパターンは多くの場所で見られます。

`children` propを持つコンポーネントは、親コンポーネントが任意のJSXで「埋める」ことができる「穴」を持っていると考えることができます。`children` propは、パネルやグリッドなどの視覚的なラッパーによく使用されます。

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## 時間の経過とともにpropsがどのように変化するか {/*how-props-change-over-time*/}

以下の`Clock`コンポーネントは、親コンポーネントから2つのpropsを受け取ります：`color`と`time`。（親コンポーネントのコードは[状態](/learn/state-a-components-memory)を使用しているため省略されていますが、ここではまだ詳しく説明しません。）

以下のセレクトボックスで色を変更してみてください：

<Sandpack>

```js src/Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
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
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

この例は、**コンポーネントが時間の経過とともに異なるpropsを受け取ることがある**ことを示しています。Propsは常に静的ではありません！ここでは、`time` propは毎秒変化し、`color` propは別の色を選択すると変化します。Propsは、特定の時点でのコンポーネントのデータを反映します。

ただし、propsは[不変](https://en.wikipedia.org/wiki/Immutable_object)です。これはコンピュータサイエンスの用語で「変更不可能」を意味します。コンポーネントがpropsを変更する必要がある場合（例えば、ユーザーの操作や新しいデータに応じて）、親コンポーネントに_異なるprops_を渡すように「依頼」する必要があります。古いpropsは破棄され、最終的にはJavaScriptエンジンがそれらのメモリを回収します。

**propsを「変更しよう」としないでください。** ユーザー入力に応答する必要がある場合（例えば、選択された色を変更する場合）、[状態](/learn/state-a-components-memory)を設定する必要があります。

<Recap>

* propsを渡すには、HTML属性と同じようにJSXに追加します。
* propsを読み取るには、`function Avatar({ person, size })`の分割代入構文を使用します。
* `size = 100`のようにデフォルト値を指定できます。これは欠落しているpropsや`undefined`のpropsに使用されます。
* `<Avatar {...props} />`のJSXスプレッド構文で全てのpropsを転送できますが、過度に使用しないでください！
* `<Card><Avatar /></Card>`のようなネストされたJSXは、`Card`コンポーネントの`children` propとして表示されます。
* Propsは時間のスナップショットです。各レンダーは新しいバージョンのpropsを受け取ります。
* propsを変更することはできません。インタラクティブ性が必要な場合は、状態を設定する必要があります。

</Recap>



<Challenges>

#### コンポーネントを抽出する {/*extract-a-component*/}

この`Gallery`コンポーネントには、2つのプロファイルのための非常に似たマークアップが含まれています。重複を減らすために`Profile`コンポーネントを抽出してください。渡すpropsを選択する必要があります。

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (chemical element)
          </li>
        </ul>
      </section>
<section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

まず、科学者の1人のマークアップを抽出します。次に、2番目の例で一致しない部分を見つけ、それらをpropsで設定可能にします。

</Hint>

<Solution>

この解決策では、`Profile`コンポーネントは複数のpropsを受け取ります：`imageId`（文字列）、`name`（文字列）、`profession`（文字列）、`awards`（文字列の配列）、`discovery`（文字列）、および`imageSize`（数値）。

`imageSize` propにはデフォルト値があるため、コンポーネントに渡す必要はありません。

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

`awards`が配列である場合、`awardCount` propを別にする必要はないことに注意してください。その後、`awards.length`を使用して賞の数を数えることができます。propsは任意の値を取ることができ、配列も含まれます！

このページの以前の例にもっと似ている別の解決策は、すべての情報を1つのオブジェクトにグループ化し、そのオブジェクトを1つのpropとして渡すことです：

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
    </div>
  );
}
```

```js src/utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

構文はJSX属性のコレクションではなくJavaScriptオブジェクトのプロパティを記述しているため、見た目は少し異なりますが、これらの例はほとんど同等であり、どちらのアプローチも選択できます。

</Solution>

#### Propに基づいて画像サイズを調整する {/*adjust-the-image-size-based-on-a-prop*/}

この例では、`Avatar`は数値の`size` propを受け取り、`<img>`の幅と高さを決定します。この例では`size` propは`40`に設定されています。しかし、画像を新しいタブで開くと、画像自体が大きいことがわかります（`160`ピクセル）。実際の画像サイズは、どのサムネイルサイズを要求しているかによって決まります。

`Avatar`コンポーネントを変更して、`size` propに基づいて最も近い画像サイズを要求するようにします。具体的には、`size`が`90`未満の場合、`getImageUrl`関数に`'b'`（「大」）ではなく`'s'`（「小」）を渡します。`size` propの異なる値でアバターをレンダリングし、画像を新しいタブで開いて変更が機能することを確認します。

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

以下のように進めることができます：

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

高DPIスクリーンの場合、[`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)を考慮して、よりシャープな画像を表示することもできます：

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js src/utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Propsを使用すると、このようなロジックを`Avatar`コンポーネント内にカプセル化し（必要に応じて後で変更することもできます）、誰もが画像のリクエストとリサイズについて考えることなく`<Avatar>`コンポーネントを使用できるようになります。

</Solution>

#### `children` propにJSXを渡す {/*passing-jsx-in-a-children-prop*/}

以下のマークアップから`Card`コンポーネントを抽出し、`children` propを使用して異なるJSXを渡します：

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

コンポーネントのタグの中に置いた任意のJSXは、そのコンポーネントの`children` propとして渡されます。

</Hint>

<Solution>

以下のように、両方の場所で`Card`コンポーネントを使用できます：

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

すべての`Card`に常にタイトルを持たせたい場合は、`title`を別のpropにすることもできます：

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>