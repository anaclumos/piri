---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect`はパフォーマンスに悪影響を与える可能性があります。可能な場合は[`useEffect`](/reference/react/useEffect)を使用することをお勧めします。

</Pitfall>

<Intro>

`useLayoutEffect`は、ブラウザが画面を再描画する前に発火する[`useEffect`](/reference/react/useEffect)のバージョンです。

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

ブラウザが画面を再描画する前にレイアウトの測定を行うために`useLayoutEffect`を呼び出します：

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[以下の例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `setup`: Effectのロジックを含む関数。setup関数はオプションで*クリーンアップ*関数を返すこともできます。コンポーネントがDOMに追加される前に、Reactはsetup関数を実行します。依存関係が変更された再レンダリングのたびに、Reactは最初に古い値でクリーンアップ関数（提供されている場合）を実行し、その後新しい値でsetup関数を実行します。コンポーネントがDOMから削除される前に、Reactはクリーンアップ関数を実行します。
 
* **オプション** `dependencies`: `setup`コード内で参照されるすべてのリアクティブ値のリスト。リアクティブ値にはprops、state、およびコンポーネント本体内で直接宣言されたすべての変数と関数が含まれます。リンターが[React用に設定されている](/learn/editor-setup#linting)場合、すべてのリアクティブ値が依存関係として正しく指定されていることを確認します。依存関係のリストは一定数の項目を持ち、`[dep1, dep2, dep3]`のようにインラインで書かれる必要があります。Reactは[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較を使用して各依存関係を以前の値と比較します。この引数を省略すると、Effectはコンポーネントの再レンダリングごとに再実行されます。

#### 戻り値 {/*returns*/}

`useLayoutEffect`は`undefined`を返します。

#### 注意点 {/*caveats*/}

* `useLayoutEffect`はフックなので、**コンポーネントのトップレベル**または独自のフックでのみ呼び出すことができます。ループや条件内で呼び出すことはできません。その場合は、コンポーネントを抽出してEffectをそこに移動します。

* ストリクトモードがオンの場合、Reactは**最初の実際のセットアップの前に開発専用の追加のセットアップ+クリーンアップサイクル**を実行します。これは、クリーンアップロジックがセットアップロジックを「ミラーリング」し、セットアップが行っていることを停止または元に戻すことを確認するためのストレステストです。これが問題を引き起こす場合は、[クリーンアップ関数を実装します。](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* 依存関係の一部がコンポーネント内で定義されたオブジェクトや関数である場合、それらが**必要以上にEffectを再実行させるリスク**があります。これを修正するには、不要な[オブジェクト](/reference/react/useEffect#removing-unnecessary-object-dependencies)および[関数](/reference/react/useEffect#removing-unnecessary-function-dependencies)の依存関係を削除します。また、Effectの外で[状態の更新](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect)や[非リアクティブなロジック](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect)を抽出することもできます。

* Effectは**クライアントでのみ実行されます。** サーバーレンダリング中には実行されません。

* `useLayoutEffect`内のコードとそこからスケジュールされたすべての状態更新は**ブラウザが画面を再描画するのをブロックします。** 過度に使用すると、アプリが遅くなります。可能な場合は[`useEffect`](/reference/react/useEffect)を使用することをお勧めします。

---

## 使用法 {/*usage*/}

### ブラウザが画面を再描画する前にレイアウトを測定する {/*measuring-layout-before-the-browser-repaints-the-screen*/}

ほとんどのコンポーネントは、レンダリングする内容を決定するために画面上の位置やサイズを知る必要はありません。単にいくつかのJSXを返すだけです。その後、ブラウザが*レイアウト*（位置とサイズ）を計算し、画面を再描画します。

時々、それだけでは不十分です。ホバー時に要素の横に表示されるツールチップを想像してください。十分なスペースがある場合、ツールチップは要素の上に表示されるべきですが、スペースが足りない場合は下に表示されるべきです。ツールチップを正しい最終位置にレンダリングするためには、その高さ（つまり、上に収まるかどうか）を知る必要があります。

これを行うには、2回のパスでレンダリングする必要があります：

1. ツールチップをどこにでも（間違った位置でも）レンダリングします。
2. その高さを測定し、ツールチップを配置する場所を決定します。
3. ツールチップを*再度*正しい場所にレンダリングします。

**これらすべてはブラウザが画面を再描画する前に行う必要があります。** ユーザーにツールチップが動くのを見せたくありません。`useLayoutEffect`を呼び出して、ブラウザが画面を再描画する前にレイアウトの測定を行います：

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // 実際の高さはまだわかりません

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // 実際の高さがわかったので再レンダリングします
  }, []);

  // ...以下のレンダリングロジックでtooltipHeightを使用します...
}
```

これがステップバイステップでどのように機能するかを説明します：

1. `Tooltip`は初期の`tooltipHeight = 0`でレンダリングされます（したがって、ツールチップは間違った位置にあるかもしれません）。
2. ReactはそれをDOMに配置し、`useLayoutEffect`内のコードを実行します。
3. `useLayoutEffect`はツールチップの内容の高さを測定し、即座に再レンダリングをトリガーします。
4. `Tooltip`は実際の`tooltipHeight`で再度レンダリングされます（したがって、ツールチップは正しい位置にあります）。
5. ReactはそれをDOMに更新し、ブラウザは最終的にツールチップを表示します。

以下のボタンにホバーして、ツールチップがフィットするかどうかに応じて位置を調整する様子を確認してください：

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            このツールチップはボタンの上に収まりません。
            <br />
            そのため、代わりに下に表示されます！
          </div>
        }
      >
        ホバーしてください（ツールチップは上）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )}
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 上に収まらないので、下に配置します。
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

`Tooltip`コンポーネントは2回のパスでレンダリングする必要がありますが（最初は`tooltipHeight`が`0`に初期化され、次に実際の測定された高さで）、最終結果だけが表示されることに注意してください。このため、この例では[`useEffect`](/reference/react/useEffect)ではなく`useLayoutEffect`が必要です。以下で詳細を見てみましょう。

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect`はブラウザの再描画をブロックします {/*uselayouteffect-blocks-the-browser-from-repainting*/}

Reactは、`useLayoutEffect`内のコードとその中でスケジュールされた状態更新が**ブラウザが画面を再描画する前に**処理されることを保証します。これにより、ツールチップをレンダリングし、それを測定し、再度ツールチップをレンダリングしても、ユーザーには最初の余分なレンダリングが見えません。言い換えれば、`useLayoutEffect`はブラウザの描画をブロックします。

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            このツールチップはボタンの上に収まりません。
            <br />
            そのため、代わりに下に表示されます！
          </div>
        }
      >
        ホバーしてください（ツールチップは上）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )}
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 上に収まらないので、下に配置します。
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect`はブラウザをブロックしません {/*useeffect-does-not-block-the-browser*/}

ここでは、`useLayoutEffect`の代わりに[`useEffect`](/reference/react/useEffect)を使用した同じ例です。遅いデバイスを使用している場合、ツールチップが「ちらつく」ことがあり、初期位置が一瞬表示されることがあります。

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            このツールチップはボタンの上に収まりません。
            <br />
            そのため、代わりに下に表示されます！
          </div>
        }
      >
        ホバーしてください（ツールチップは上）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )}
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 上に収まらないので、下に配置します。
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

バグを再現しやすくするために、このバージョンではレンダリング中に人工的な遅延を追加しています。Reactは`useEffect`内の状態更新を処理する前にブラウザが画面を描画することを許可します。その結果、ツールチップがちらつきます：

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            このツールチップはボタンの上に収まりません。
            <br />
            そのため、代わりに下に表示されます！
          </div>
        }
      >
        ホバーしてください（ツールチップは上）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>このツールチップはボタンの上に収まります</div>
        }
      >
        ホバーしてください（ツールチップは下）
      </ButtonWithTooltip>
    </div>
  );
}
```

```js src/ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )}
    </>
  );
}
```

```js src/Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // これはレンダリングを人工的に遅くします
  let now = performance.now();
  while (performance.now() - now < 100) {
    // 少しの間何もしません...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // 上に収まらないので、下に配置します。
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js src/TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

この例を`useLayoutEffect`に編集し、レンダリングが遅くなっても描画をブロックすることを確認してください。

<Solution />

</Recipes>

<Note>

2回のパスでレンダリングし、ブラウザをブロックすることはパフォーマンスに悪影響を与えます。可能な場合はこれを避けるようにしてください。

</Note>

---

## トラブルシューティング {/*troubleshooting*/}

### エラーが発生しています："`useLayoutEffect`はサーバーでは何もしません" {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

`useLayoutEffect`の目的は、コンポーネントがレンダリングにレイアウト情報を使用できるようにすることです：

1. 初期コンテンツをレンダリングします。
2. *ブラウザが画面を再描画する前に*レイアウトを測定します。
3. 読み取ったレイアウト情報を使用して最終コンテンツをレンダリングします。

あなたやフレームワークが[サーバーレンダリング](/reference/react-dom/server)を使用する場合、Reactアプリは初期レンダリングのためにサーバー上でHTMLにレンダリングされます。これにより、JavaScriptコードが読み込まれる前に初期HTMLを表示できます。

問題は、サーバー上にはレイアウト情報がないことです。

[前の例](#measuring-layout-before-the-browser-repaints-the-screen)では、`Tooltip`コンポーネント内の`useLayoutEffect`呼び出しにより、コンテンツの高さに応じて正しく位置を決定できます（上または下）。初期サーバーHTMLの一部として`Tooltip`をレンダリングしようとすると、これを決定することは不可能です。サーバー上にはまだレイアウトがないからです！したがって、サーバーでレンダリングしても、JavaScriptが読み込まれて実行された後にその位置が「ジャンプ」します。

通常、レイアウト情報に依存するコンポーネントはサーバーでレンダリングする必要はありません。たとえば、初期レンダリング中に`Tooltip`を表示することはおそらく意味がありません。これはクライアントの操作によってトリガーされます。

ただし、この問題に直面している場合、いくつかの異なるオプションがあります：

- `useLayoutEffect`を[`useEffect`](/reference/react/useEffect)に置き換えます。これにより、初期レンダリング結果をブロックせずに表示しても問題ないことをReactに伝えます（元のHTMLはEffectが実行される前に表示されます）。

- 代わりに、[コンポーネントをクライアント専用としてマークします。](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) これにより、サーバーレンダリング中に最も近い[`<Suspense>`](/reference/react/Suspense)境界までのコンテンツをローディングフォールバック（たとえば、スピナーやグリマー）に置き換えるようにReactに指示します。

- 代わりに、ハイドレーション後にのみ`useLayoutEffect`を持つコンポーネントをレンダリングします。`false`に初期化されたブール値の`isMounted`状態を保持し、`useEffect`呼び出し内で`true`に設定します。レンダリングロジックは`return isMounted ? <RealContent /> : <FallbackContent />`のようにすることができます。サーバーおよびハイドレーション中には、`useLayoutEffect`を呼び出さない`FallbackContent`が表示されます。その後、Reactはクライアントのみで実行される`RealContent`に置き換え、`useLayoutEffect`呼び出しを含めることができます。

- 外部データストアとコンポーネントを同期し、レイアウト測定以外の理由で`useLayoutEffect`に依存している場合は、[サーバーレンダリングをサポートする](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)[`useSyncExternalStore`](/reference/react/useSyncExternalStore)を検討してください。