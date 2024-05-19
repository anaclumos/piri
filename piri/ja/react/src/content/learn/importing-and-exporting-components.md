---
title: コンポーネントのインポートとエクスポート
---

<Intro>

コンポーネントの魔法は、その再利用性にあります。つまり、他のコンポーネントで構成されたコンポーネントを作成することができます。しかし、コンポーネントをどんどんネストしていくと、それらを別々のファイルに分割し始めるのが理にかなっていることが多いです。これにより、ファイルを簡単にスキャンでき、より多くの場所でコンポーネントを再利用することができます。

</Intro>

<YouWillLearn>

* ルートコンポーネントファイルとは何か
* コンポーネントのインポートとエクスポートの方法
* デフォルトインポートと名前付きインポートの使い分け
* 1つのファイルから複数のコンポーネントをインポートおよびエクスポートする方法
* コンポーネントを複数のファイルに分割する方法

</YouWillLearn>

## ルートコンポーネントファイル {/*the-root-component-file*/}

[Your First Component](/learn/your-first-component)では、`Profile`コンポーネントとそれをレンダリングする`Gallery`コンポーネントを作成しました：

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

これらは現在、`App.js`という名前の**ルートコンポーネントファイル**に存在しています。ただし、設定によっては、ルートコンポーネントが別のファイルにある場合もあります。Next.jsのようなファイルベースのルーティングを持つフレームワークを使用している場合、ルートコンポーネントはページごとに異なります。

## コンポーネントのエクスポートとインポート {/*exporting-and-importing-a-component*/}

将来的にランディングスクリーンを変更して、そこに科学書のリストを置きたい場合や、すべてのプロフィールを別の場所に配置したい場合はどうしますか？`Gallery`と`Profile`をルートコンポーネントファイルから移動するのが理にかなっています。これにより、他のファイルでもっとモジュール化され、再利用可能になります。コンポーネントを移動するには、次の3つのステップを実行します：

1. コンポーネントを配置する新しいJSファイルを**作成**します。
2. そのファイルから関数コンポーネントを**エクスポート**します（[デフォルト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export)または[名前付き](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)エクスポートのいずれかを使用）。
3. コンポーネントを使用するファイルでそれを**インポート**します（[デフォルト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults)または[名前付き](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)エクスポートの対応する技術を使用）。

ここでは、`Profile`と`Gallery`の両方が`App.js`から新しいファイル`Gallery.js`に移動されました。これで、`App.js`を変更して`Gallery.js`から`Gallery`をインポートできます：

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

この例では、現在2つのコンポーネントファイルに分かれています：

1. `Gallery.js`:
     - 同じファイル内でのみ使用され、エクスポートされない`Profile`コンポーネントを定義します。
     - `Gallery`コンポーネントを**デフォルトエクスポート**としてエクスポートします。
2. `App.js`:
     - `Gallery.js`から**デフォルトインポート**として`Gallery`をインポートします。
     - ルート`App`コンポーネントを**デフォルトエクスポート**としてエクスポートします。

<Note>

次のように`.js`ファイル拡張子を省略するファイルに遭遇するかもしれません：

```js 
import Gallery from './Gallery';
```

`'./Gallery.js'`または`'./Gallery'`のどちらもReactで動作しますが、前者は[ネイティブESモジュール](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)の動作に近いです。

</Note>

<DeepDive>

#### デフォルトエクスポートと名前付きエクスポート {/*default-vs-named-exports*/}

JavaScriptで値をエクスポートする主な方法は2つあります：デフォルトエクスポートと名前付きエクスポートです。これまでの例ではデフォルトエクスポートのみを使用してきましたが、同じファイルで1つまたは両方を使用することができます。**ファイルには1つのデフォルトエクスポートしか持てませんが、好きなだけ名前付きエクスポートを持つことができます。**

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

コンポーネントのエクスポート方法は、インポート方法を決定します。デフォルトエクスポートを名前付きエクスポートと同じ方法でインポートしようとするとエラーが発生します！このチャートは、追跡するのに役立ちます：

| 構文           | エクスポート文                           | インポート文                          |
| -----------      | -----------                                | -----------                               |
| デフォルト  | `export default function Button() {}` | `import Button from './Button.js';`     |
| 名前付き    | `export function Button() {}`         | `import { Button } from './Button.js';` |

_デフォルト_インポートを書くときは、`import`の後に任意の名前を付けることができます。たとえば、`import Banana from './Button.js'`と書いても、同じデフォルトエクスポートが提供されます。対照的に、名前付きインポートでは、名前が両側で一致する必要があります。これが_名前付き_インポートと呼ばれる理由です！

**ファイルが1つのコンポーネントのみをエクスポートする場合はデフォルトエクスポートを使用し、複数のコンポーネントや値をエクスポートする場合は名前付きエクスポートを使用することが多いです。**どのコーディングスタイルを好むかに関係なく、常にコンポーネント関数とそれを含むファイルに意味のある名前を付けてください。`export default () => {}`のような名前のないコンポーネントは、デバッグを難しくするため推奨されません。

</DeepDive>

## 同じファイルから複数のコンポーネントをエクスポートおよびインポートする方法 {/*exporting-and-importing-multiple-components-from-the-same-file*/}

ギャラリーの代わりに1つの`Profile`だけを表示したい場合はどうしますか？`Profile`コンポーネントもエクスポートできます。しかし、`Gallery.js`にはすでに*デフォルト*エクスポートがあり、_2つ_のデフォルトエクスポートを持つことはできません。新しいファイルを作成してデフォルトエクスポートを持たせるか、`Profile`の*名前付き*エクスポートを追加することができます。**ファイルには1つのデフォルトエクスポートしか持てませんが、名前付きエクスポートは多数持つことができます！**

<Note>

デフォルトエクスポートと名前付きエクスポートの混乱を減らすために、一部のチームは1つのスタイル（デフォルトまたは名前付き）のみを使用するか、1つのファイルでそれらを混在させないように選択します。自分に最適な方法を選んでください！

</Note>

まず、`Gallery.js`から名前付きエクスポート（`default`キーワードなし）を使用して`Profile`を**エクスポート**します：

```js
export function Profile() {
  // ...
}
```

次に、`Gallery.js`から`App.js`に名前付きインポート（中括弧付き）を使用して`Profile`を**インポート**します：

```js
import { Profile } from './Gallery.js';
```

最後に、`App`コンポーネントから`<Profile />`を**レンダリング**します：

```js
export default function App() {
  return <Profile />;
}
```

これで、`Gallery.js`にはデフォルトの`Gallery`エクスポートと名前付きの`Profile`エクスポートの2つのエクスポートが含まれています。`App.js`はその両方をインポートします。この例で`<Profile />`を`<Gallery />`に変更したり、元に戻したりしてみてください：

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
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
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

これで、デフォルトエクスポートと名前付きエクスポートの混在を使用しています：

* `Gallery.js`:
  - `Profile`コンポーネントを**名前付きエクスポートとして`Profile`**としてエクスポートします。
  - `Gallery`コンポーネントを**デフォルトエクスポート**としてエクスポートします。
* `App.js`:
  - `Gallery.js`から**名前付きインポートとして`Profile`**をインポートします。
  - `Gallery.js`から**デフォルトインポート**として`Gallery`をインポートします。
  - ルート`App`コンポーネントを**デフォルトエクスポート**としてエクスポートします。

<Recap>

このページで学んだこと：

* ルートコンポーネントファイルとは何か
* コンポーネントのインポートとエクスポートの方法
* デフォルトインポートと名前付きインポートの使い分け
* 同じファイルから複数のコンポーネントをエクスポートする方法

</Recap>

<Challenges>

#### コンポーネントをさらに分割する {/*split-the-components-further*/}

現在、`Gallery.js`は`Profile`と`Gallery`の両方をエクスポートしており、少し混乱しています。

`Profile`コンポーネントを独自の`Profile.js`に移動し、その後`App`コンポーネントを変更して`<Profile />`と`<Gallery />`の両方を順番にレンダリングします。

`Profile`にはデフォルトエクスポートまたは名前付きエクスポートのいずれかを使用できますが、`App.js`と`Gallery.js`の両方で対応するインポート構文を使用してください！上記のディープダイブからの表を参照できます：

| 構文           | エクスポート文                           | インポート文                          |
| -----------      | -----------                                | -----------                               |
| デフォルト  | `export default function Button() {}` | `import Button from './Button.js';`     |
| 名前付き    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

呼び出される場所でコンポーネントをインポートするのを忘れないでください。`Gallery`も`Profile`を使用していませんか？

</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Move me to Profile.js!
export function Profile() {
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

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

1つのエクスポートの種類で動作させた後、他の種類でも動作させてみてください。

<Solution>

これは名前付きエクスポートの解決策です：

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

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

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

これはデフォルトエクスポートの解決策です：

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

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

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>