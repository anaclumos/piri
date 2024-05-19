---
title: エフェクトとの同期
---

<Intro>

いくつかのコンポーネントは外部システムと同期する必要があります。例えば、Reactの状態に基づいて非Reactコンポーネントを制御したり、サーバー接続を設定したり、コンポーネントが画面に表示されたときに分析ログを送信したりすることが考えられます。*Effects*を使用すると、レンダリング後にコードを実行して、コンポーネントをReactの外部システムと同期させることができます。

</Intro>

<YouWillLearn>

- Effectsとは何か
- Effectsがイベントとどう違うのか
- コンポーネントでEffectを宣言する方法
- 不必要にEffectを再実行しない方法
- 開発中にEffectsが2回実行される理由とその修正方法

</YouWillLearn>

## Effectsとは何か、そしてイベントとどう違うのか {/*what-are-effects-and-how-are-they-different-from-events*/}

Effectsに入る前に、Reactコンポーネント内の2種類のロジックに慣れておく必要があります：

- **レンダリングコード**（[UIの記述](/learn/describing-the-ui)で紹介）は、コンポーネントのトップレベルにあります。ここでは、propsとstateを取り、それらを変換して、画面に表示したいJSXを返します。[レンダリングコードは純粋でなければなりません。](/learn/keeping-components-pure) 数学の公式のように、結果を_計算_するだけで、他のことはしないようにします。

- **イベントハンドラ**（[インタラクティビティの追加](/learn/adding-interactivity)で紹介）は、計算するだけでなく、何かを行うネストされた関数です。イベントハンドラは、入力フィールドを更新したり、製品を購入するためのHTTP POSTリクエストを送信したり、ユーザーを別の画面にナビゲートしたりすることがあります。イベントハンドラには、特定のユーザーアクション（例えば、ボタンクリックや入力）によって引き起こされる["副作用"](https://en.wikipedia.org/wiki/Side_effect_(computer_science))（プログラムの状態を変更する）が含まれます。

これだけでは不十分な場合もあります。例えば、`ChatRoom`コンポーネントが画面に表示されるたびにチャットサーバーに接続する必要があるとします。サーバーへの接続は純粋な計算ではなく（副作用です）、レンダリング中に行うことはできません。しかし、`ChatRoom`が表示される原因となる特定のイベント（クリックなど）はありません。

***Effects*を使用すると、特定のイベントではなく、レンダリング自体によって引き起こされる副作用を指定できます。** チャットでメッセージを送信することは、特定のボタンをクリックすることによって直接引き起こされるため、*イベント*です。しかし、サーバー接続の設定は、どのインタラクションがコンポーネントを表示させたかに関係なく行われるべきなので、*Effect*です。Effectsは、画面の更新後に[コミット](/learn/render-and-commit)の最後に実行されます。これは、Reactコンポーネントをネットワークやサードパーティライブラリなどの外部システムと同期させるのに適したタイミングです。

<Note>

ここおよびこのテキストの後半で、大文字の"Effect"は、上記のReact固有の定義、すなわちレンダリングによって引き起こされる副作用を指します。より広範なプログラミングの概念を指す場合は、「副作用」と言います。

</Note>


## Effectが必要ないかもしれません {/*you-might-not-need-an-effect*/}

**コンポーネントにEffectsを急いで追加しないでください。** Effectsは通常、Reactコードから「外に出て」、*外部*システムと同期するために使用されることを覚えておいてください。これには、ブラウザAPI、サードパーティウィジェット、ネットワークなどが含まれます。Effectが他の状態に基づいて状態を調整するだけの場合、[Effectが必要ないかもしれません。](/learn/you-might-not-need-an-effect)

## Effectを書く方法 {/*how-to-write-an-effect*/}

Effectを書くには、次の3つのステップに従います：

1. **Effectを宣言する。** デフォルトでは、Effectはすべての[コミット](/learn/render-and-commit)後に実行されます。
2. **Effectの依存関係を指定する。** ほとんどのEffectsは、すべてのレンダリング後ではなく、*必要なときにのみ*再実行されるべきです。例えば、フェードインアニメーションはコンポーネントが表示されたときにのみトリガーされるべきです。チャットルームへの接続と切断は、コンポーネントが表示されたり消えたり、またはチャットルームが変更されたときにのみ行われるべきです。*依存関係*を指定することでこれを制御する方法を学びます。
3. **必要に応じてクリーンアップを追加する。** 一部のEffectsは、行っていたことを停止、元に戻す、またはクリーンアップする方法を指定する必要があります。例えば、「接続」には「切断」、「購読」には「購読解除」、「取得」には「キャンセル」または「無視」が必要です。*クリーンアップ関数*を返すことでこれを行う方法を学びます。

これらのステップを詳細に見ていきましょう。

### ステップ1: Effectを宣言する {/*step-1-declare-an-effect*/}

コンポーネントでEffectを宣言するには、Reactから[`useEffect`フック](/reference/react/useEffect)をインポートします：

```js
import { useEffect } from 'react';
```

次に、コンポーネントのトップレベルで呼び出し、Effect内にコードを入れます：

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // ここにあるコードはすべてのレンダリング後に実行されます
  });
  return <div />;
}
```

コンポーネントがレンダリングされるたびに、Reactは画面を更新し、*その後* `useEffect`内のコードを実行します。言い換えれば、**`useEffect`はそのレンダリングが画面に反映されるまでコードの実行を「遅らせる」**のです。

Effectを使用して外部システムと同期する方法を見てみましょう。`<VideoPlayer>` Reactコンポーネントを考えてみましょう。`isPlaying`プロップを渡すことで、再生中か一時停止中かを制御できると便利です：

```js
<VideoPlayer isPlaying={isPlaying} />;
```

カスタムの`VideoPlayer`コンポーネントは、組み込みのブラウザ[`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)タグをレンダリングします：

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: isPlayingで何かをする
  return <video src={src} />;
}
```

しかし、ブラウザの`<video>`タグには`isPlaying`プロップはありません。唯一の制御方法は、DOM要素に対して[`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)および[`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)メソッドを手動で呼び出すことです。**現在ビデオが再生されるべきかどうかを示す`isPlaying`プロップの値を、`play()`や`pause()`の呼び出しと同期させる必要があります。**

まず、`<video>` DOMノードへの[refを取得](/learn/manipulating-the-dom-with-refs)する必要があります。

レンダリング中に`play()`や`pause()`を呼び出そうとするかもしれませんが、それは正しくありません：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // レンダリング中にこれを呼び出すことは許可されていません。
  } else {
    ref.current.pause(); // これもクラッシュします。
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

このコードが正しくない理由は、レンダリング中にDOMノードで何かをしようとしているからです。Reactでは、[レンダリングはJSXの純粋な計算](/learn/keeping-components-pure)であり、DOMを変更するような副作用を含むべきではありません。

さらに、`VideoPlayer`が最初に呼び出されたとき、そのDOMはまだ存在しません！ まだDOMノードが存在しないため、`play()`や`pause()`を呼び出すことはできません。ReactはJSXを返すまでどのDOMを作成するかを知らないからです。

ここでの解決策は、**副作用を`useEffect`でラップして、レンダリング計算から外すことです：**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOMの更新をEffectでラップすることで、Reactは最初に画面を更新します。その後、Effectが実行されます。

`VideoPlayer`コンポーネントがレンダリングされるたびに（最初のレンダリング時または再レンダリング時）、いくつかのことが起こります。まず、Reactは画面を更新し、`<video>`タグが正しいプロップでDOMにあることを確認します。その後、ReactはEffectを実行します。最後に、Effectは`isPlaying`の値に応じて`play()`または`pause()`を呼び出します。

再生/一時停止を何度も押して、ビデオプレーヤーが`isPlaying`の値に同期しているか確認してください：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

この例では、Reactの状態に同期した「外部システム」はブラウザのメディアAPIでした。同様のアプローチを使用して、レガシーの非Reactコード（例えばjQueryプラグイン）を宣言的なReactコンポーネントにラップすることができます。

ビデオプレーヤーの制御は実際にはもっと複雑です。`play()`の呼び出しが失敗することもあり、ユーザーが組み込みのブラウザコントロールを使用して再生や一時停止を行うこともあります。この例は非常に簡略化されており、不完全です。

<Pitfall>

デフォルトでは、Effectsは*すべての*レンダリング後に実行されます。このため、次のようなコードは**無限ループを引き起こします：**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Effectsはレンダリングの*結果*として実行されます。状態の設定は*レンダリングをトリガー*します。Effect内で状態を即座に設定することは、電源コンセントを自分自身に差し込むようなものです。Effectが実行され、状態を設定し、それが再レンダリングを引き起こし、Effectが再び実行され、再び状態を設定し、これが繰り返されます。

Effectsは通常、コンポーネントを*外部*システムと同期させるために使用されます。外部システムがなく、他の状態に基づいて状態を調整したいだけの場合、[Effectが必要ないかもしれません。](/learn/you-might-not-need-an-effect)

</Pitfall>

### ステップ2: Effectの依存関係を指定する {/*step-2-specify-the-effect-dependencies*/}

デフォルトでは、Effectsは*すべての*レンダリング後に実行されます。これは**望ましくない**ことが多いです：

- 時には遅いことがあります。外部システムとの同期は常に即座に行われるわけではないため、必要でない限りそれをスキップしたい場合があります。例えば、チャットサーバーへの再接続をすべてのキー入力で行いたくはありません。
- 時には間違っています。例えば、コンポーネントのフェードインアニメーションをすべてのキー入力でトリガーしたくはありません。アニメーションはコンポーネントが初めて表示されたときにのみ再生されるべきです。

問題を示すために、いくつかの`console.log`呼び出しと親コンポーネントの状態を更新するテキスト入力を追加した前の例を見てみましょう。入力するとEffectが再実行されることに注意してください：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Reactに**不必要なEffectの再実行をスキップ**するように指示するには、`useEffect`呼び出しの第2引数として*依存関係*の配列を指定します。まず、上記の例の14行目に空の`[]`配列を追加します：

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

`React Hook useEffect has a missing dependency: 'isPlaying'`というエラーが表示されるはずです：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // これがエラーを引き起こします

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App()
```js
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

問題は、Effect内のコードが`isPlaying`プロップに依存しているため、何をするかを決定するためにこの依存関係が明示的に宣言されていないことです。この問題を修正するには、依存関係の配列に`isPlaying`を追加します：

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // ここで使用されています...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ここで宣言する必要があります！
```

これで、すべての依存関係が宣言されているため、エラーは発生しません。`[isPlaying]`を依存関係の配列として指定することで、`isPlaying`が前回のレンダリング時と同じであれば、ReactはEffectの再実行をスキップするようになります。この変更により、入力に入力してもEffectは再実行されませんが、再生/一時停止ボタンを押すと再実行されます：

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

依存関係の配列には複数の依存関係を含めることができます。Reactは、指定したすべての依存関係が前回のレンダリング時とまったく同じ値を持っている場合にのみ、Effectの再実行をスキップします。Reactは依存関係の値を[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比較を使用して比較します。詳細については[`useEffect`のリファレンス](/reference/react/useEffect#reference)を参照してください。

**依存関係を「選択」することはできません。** 指定した依存関係がEffect内のコードに基づいてReactが期待するものと一致しない場合、リントエラーが発生します。これにより、コード内の多くのバグをキャッチすることができます。再実行したくないコードがある場合は、[依存関係を「必要としない」ようにEffectコード自体を編集します。](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

依存関係の配列がない場合と*空の*`[]`依存関係の配列がある場合の動作は異なります：

```js {3,7,11}
useEffect(() => {
  // これはすべてのレンダリング後に実行されます
});

useEffect(() => {
  // これはマウント時（コンポーネントが表示されるとき）にのみ実行されます
}, []);

useEffect(() => {
  // これはマウント時*および* a または b が前回のレンダリング以降に変更された場合に実行されます
}, [a, b]);
```

次のステップで「マウント」が何を意味するかを詳しく見ていきます。

</Pitfall>

<DeepDive>

#### なぜrefは依存関係の配列から省略されたのか？ {/*why-was-the-ref-omitted-from-the-dependency-array*/}

このEffectは`ref`と`isPlaying`の両方を使用していますが、`isPlaying`のみが依存関係として宣言されています：

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

これは、`ref`オブジェクトが*安定したアイデンティティ*を持っているためです：Reactは、同じ`useRef`呼び出しから毎回同じオブジェクトを返すことを保証します。それは決して変わらないため、それ自体でEffectの再実行を引き起こすことはありません。したがって、含めるかどうかは関係ありません。含めることも問題ありません：

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

[`useState`から返される`set`関数](/reference/react/useState#setstate)も安定したアイデンティティを持っているため、依存関係から省略されることがよくあります。リントが依存関係を省略してもエラーが発生しない場合、それは安全です。

常に安定した依存関係を省略することは、リントがそのオブジェクトが安定していることを「見る」ことができる場合にのみ機能します。例えば、`ref`が親コンポーネントから渡された場合、それを依存関係の配列に指定する必要があります。しかし、これは良いことです。親コンポーネントが常に同じrefを渡すか、条件付きで複数のrefのいずれかを渡すかを知ることはできないためです。したがって、Effectは渡されるrefに依存します。

</DeepDive>

### ステップ3: 必要に応じてクリーンアップを追加する {/*step-3-add-cleanup-if-needed*/}

別の例を考えてみましょう。`ChatRoom`コンポーネントを作成しており、表示されるときにチャットサーバーに接続する必要があります。`connect()`および`disconnect()`メソッドを持つオブジェクトを返す`createConnection()` APIが提供されています。コンポーネントがユーザーに表示されている間、接続を維持するにはどうすればよいでしょうか？

まず、Effectロジックを書きます：

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

すべての再レンダリング後にチャットに接続するのは遅いので、依存関係の配列を追加します：

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Effect内のコードはpropsやstateを使用していないため、依存関係の配列は`[]`（空）です。これは、コンポーネントが「マウント」されたとき、つまり画面に初めて表示されたときにのみこのコードを実行するようにReactに指示します。**

このコードを実行してみましょう：

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 実際の実装では実際にサーバーに接続します
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

このEffectはマウント時にのみ実行されるため、コンソールに`"✅ Connecting..."`が一度だけ表示されると予想するかもしれません。**しかし、コンソールを確認すると、`"✅ Connecting..."`が2回表示されます。なぜでしょうか？**

`ChatRoom`コンポーネントが多くの異なる画面を持つ大きなアプリの一部であると想像してください。ユーザーは`ChatRoom`ページから始めます。コンポーネントがマウントされ、`connection.connect()`が呼び出されます。次に、ユーザーが別の画面（例えば、設定ページ）に移動するとします。`ChatRoom`コンポーネントがアンマウントされます。最後に、ユーザーが戻るをクリックして`ChatRoom`が再びマウントされます。これにより2番目の接続が設定されますが、最初の接続は破棄されていません！ユーザーがアプリを移動するたびに、接続が積み重なっていきます。

このようなバグは、広範な手動テストを行わないと見逃しやすいです。これを迅速に見つけるために、開発中にReactは初回マウント後にすべてのコンポーネントを一度再マウントします。

`"✅ Connecting..."`ログが2回表示されることで、実際の問題に気付くことができます：コンポーネントがアンマウントされたときに接続が閉じられていないのです。

この問題を修正するには、Effectから*クリーンアップ関数*を返します：

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

Reactは、Effectが再実行される前に毎回、そしてコンポーネントがアンマウントされる（削除される）ときに、クリーンアップ関数を呼び出します。クリーンアップ関数が実装されたときに何が起こるか見てみましょう：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 実際の実装では実際にサーバーに接続します
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected。');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

これで開発中に3つのコンソールログが表示されます：

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**これは開発中の正しい動作です。** コンポーネントを再マウントすることで、ナビゲートして戻ることがコードを壊さないことを確認します。切断して再接続することは、まさに起こるべきことです！クリーンアップがうまく実装されている場合、Effectが一度実行されるのと、実行→クリーンアップ→再実行のシーケンスの間にユーザーに見える違いはありません。開発中にReactがバグを探すために追加の接続/切断呼び出しペアがあるのは正常です。これを取り除こうとしないでください！

**本番環境では、`"✅ Connecting..."`が一度だけ表示されます。** コンポーネントの再マウントは、クリーンアップが必要なEffectを見つけるために開発中にのみ行われます。[Strict Mode](/reference/react/StrictMode)をオフにして開発中の動作をオプトアウトすることもできますが、オンにしておくことをお勧めします。これにより、上記のような多くのバグを見つけることができます。

## 開発中にEffectが2回実行される場合の対処方法 {/*how-to-handle-the-effect-firing-twice-in-development*/}

Reactは意図的に開発中にコンポーネントを再マウントして、前の例のようなバグを見つけます。**「Effectを一度だけ実行する方法」ではなく、「Effectが再マウント後に機能するように修正する方法」を尋ねるのが正しい質問です。**

通常、答えはクリーンアップ関数を実装することです。クリーンアップ関数は、Effectが行っていたことを停止または元に戻すべきです。目安として、Effectが一度実行される（本番環境のように）場合と、_セットアップ→クリーンアップ→セットアップ_のシーケンス（開発中に見られるように）の間にユーザーが区別できないようにするべきです。

書くEffectのほとんどは、以下の一般的なパターンのいずれかに適合します。

<Pitfall>

#### Effectの実行を防ぐためにrefsを使用しないでください {/*dont-use-refs-to-prevent-effects-from-firing*/}

開発中にEffectが2回実行されるのを防ぐための一般的な落とし穴は、`ref`を使用してEffectが一度しか実行されないようにすることです。例えば、上記のバグを`useRef`で「修正」することができます：

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 これはバグを修正しません!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

これにより、開発中に`"✅ Connecting..."`が一度だけ表示されますが、バグは修正されません。

ユーザーが別のページに移動すると、接続はまだ閉じられておらず、戻ると新しい接続が作成されます。ユーザーがアプリを移動するたびに、接続が積み重なっていきます。これは「修正」前と同じです。

バグを修正するには、Effectを一度だけ実行するだけでは不十分です。Effectは再マウント後に機能する必要があり、接続は上記の解決策のようにクリーンアップする必要があります。

以下の例を参照して、一般的なパターンの処理方法を確認してください。

</Pitfall>

### 非Reactウィジェットの制御 {/*controlling-non-react-widgets*/}

時には、Reactで書かれていないUIウィジェットを追加する必要があります。例えば、ページに地図コンポーネントを追加するとします。それには`setZoomLevel()`メソッドがあり、Reactコード内の`zoomLevel`状態変数と同期させたいとします。Effectは次のようになります：

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

この場合、クリーンアップは必要ありません。開発中、ReactはEffectを2回呼び出しますが、これは問題ではありません。同じ値で`setZoomLevel`を2回呼び出しても何も起こりません。少し遅くなるかもしれませんが、これは本番環境で無駄に再マウントされないため、問題ありません。

一部のAPIは連続して呼び出すことを許可しない場合があります。例えば、組み込みの[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement)要素の[`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)メソッドは、2回呼び出すとエラーをスローします。クリーンアップ関数を実装してダイアログを閉じる
ようにします：

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

開発中、Effectは`showModal()`を呼び出し、すぐに`close()`を呼び出し、再び`showModal()`を呼び出します。これは、本番環境で`showModal()`を一度だけ呼び出すのと同じユーザー可視の動作を持ちます。

### イベントの購読 {/*subscribing-to-events*/}

Effectが何かに購読する場合、クリーンアップ関数は購読を解除する必要があります：

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

開発中、Effectは`addEventListener()`を呼び出し、すぐに`removeEventListener()`を呼び出し、同じハンドラで再び`addEventListener()`を呼び出します。したがって、一度にアクティブな購読は1つだけです。これは、本番環境で`addEventListener()`を一度だけ呼び出すのと同じユーザー可視の動作を持ちます。

### アニメーションのトリガー {/*triggering-animations*/}

Effectが何かをアニメーション化する場合、クリーンアップ関数はアニメーションを初期値にリセットする必要があります：

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // アニメーションをトリガー
  return () => {
    node.style.opacity = 0; // 初期値にリセット
  };
}, []);
```

開発中、opacityは`1`に設定され、次に`0`に設定され、再び`1`に設定されます。これは、本番環境で直接`1`に設定するのと同じユーザー可視の動作を持ちます。サードパーティのアニメーションライブラリを使用している場合、クリーンアップ関数はタイムラインを初期状態にリセットする必要があります。

### データの取得 {/*fetching-data*/}

Effectが何かを取得する場合、クリーンアップ関数は[フェッチを中止](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)するか、その結果を無視する必要があります：

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

既に発生したネットワークリクエストを「元に戻す」ことはできませんが、クリーンアップ関数はもはや関連性のないフェッチがアプリケーションに影響を与えないようにする必要があります。`userId`が`'Alice'`から`'Bob'`に変更された場合、クリーンアップは`'Alice'`の応答が`'Bob'`の後に到着しても無視されることを保証します。

**開発中、ネットワークタブに2つのフェッチが表示されます。** これは問題ありません。上記のアプローチでは、最初のEffectはすぐにクリーンアップされるため、そのコピーの`ignore`変数は`true`に設定されます。したがって、追加のリクエストがあっても、`if (!ignore)`チェックのおかげで状態に影響を与えることはありません。

**本番環境では、リクエストは1つだけです。** 開発中の2番目のリクエストが気になる場合は、リクエストを重複排除し、コンポーネント間でレスポンスをキャッシュするソリューションを使用するのが最善です：

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

これにより、開発体験が向上するだけでなく、アプリケーションの速度も向上します。例えば、ユーザーが戻るボタンを押しても、データが再度ロードされるのを待つ必要がなくなります。自分でキャッシュを構築することもできますし、Effectsの手動フェッチの代替として多くのオープンソースソリューションを使用することもできます。

<DeepDive>

#### データフェッチの良い代替手段は何ですか？ {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Effects内で`fetch`呼び出しを書くことは、特に完全にクライアントサイドのアプリでは[人気のあるデータフェッチ方法](https://www.robinwieruch.de/react-hooks-fetch-data/)です。しかし、これは非常に手動のアプローチであり、重大な欠点があります：

- **Effectsはサーバー上で実行されません。** これは、初期のサーバーレンダリングされたHTMLがデータなしのローディング状態のみを含むことを意味します。クライアントコンピュータはすべてのJavaScriptをダウンロードし、アプリをレンダリングしてからデータをロードする必要があることを発見します。これは非常に効率的ではありません。
- **Effects内で直接フェッチすると、「ネットワークウォーターフォール」を作成しやすくなります。** 親コンポーネントをレンダリングし、それがデータをフェッチし、子コンポーネントをレンダリングし、それらがデータをフェッチし始めます。ネットワークが非常に速くない場合、これはすべてのデータを並行してフェッチするよりもかなり遅くなります。
- **Effects内で直接フェッチすると、データのプリロードやキャッシュを行わないことが多いです。** 例えば、コンポーネントがアンマウントされて再度マウントされると、再度データをフェッチする必要があります。
- **あまりエルゴノミックではありません。** レースコンディションのようなバグを避けるために`fetch`呼び出しを書くときにかなりのボイラープレートコードが必要です。

この欠点のリストはReactに特有のものではありません。マウント時にデータをフェッチすることは、どのライブラリでも同じです。ルーティングと同様に、データフェッチはうまく行うのが簡単ではないため、次のアプローチをお勧めします：

- **[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)を使用している場合、その組み込みのデータフェッチメカニズムを使用します。** モダンなReactフレームワークには、効率的で上記の欠点を持たないデータフェッチメカニズムが統合されています。
- **それ以外の場合、クライアントサイドキャッシュの使用または構築を検討します。** 人気のあるオープンソースソリューションには[React Query](https://tanstack.com/query/latest)、[useSWR](https://swr.vercel.app/)、および[React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview)があります。自分でソリューションを構築することもできます。その場合、Effectsを内部で使用しますが、リクエストの重複排除、レスポンスのキャッシュ、およびネットワークウォーターフォールの回避（データのプリロードやルートへのデータ要件の引き上げ）を行うロジックを追加します。

これらのアプローチが適さない場合は、Effects内で直接データをフェッチし続けることができます。

</DeepDive>

### 分析の送信 {/*sending-analytics*/}

ページ訪問時に分析イベントを送信するこのコードを考えてみましょう：

```js
useEffect(() => {
  logVisit(url); // POSTリクエストを送信
}, [url]);
```

開発中、`logVisit`はすべてのURLに対して2回呼び出されるため、それを修正しようとするかもしれません。**このコードはそのままにしておくことをお勧めします。** 以前の例と同様に、1回実行するのと2回実行するのとの間に*ユーザー可視の*動作の違いはありません。実用的な観点から、`logVisit`は開発中に何も行うべきではありません。開発マシンからのログが本番環境のメトリクスを歪めることを望まないからです。コンポーネントはファイルを保存するたびに再マウントされるため、開発中に追加の訪問ログが記録されます。

**本番環境では、重複する訪問ログはありません。**

分析イベントをデバッグするには、アプリをステージング環境（本番モードで実行される）にデプロイするか、一時的に[Strict Mode](/reference/react/StrictMode)をオプトアウトして開発専用の再マウントチェックを無効にします。分析をより正確にするために、[インターセクションオブザーバー](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)を使用して、どのコンポーネントがビューポートにあり、どれだけの時間表示されているかを追跡することができます。

### Effectではない: アプリケーションの初期化 {/*not-an-effect-initializing-the-application*/}

一部のロジックはアプリケーションが開始されたときに一度だけ実行されるべきです。コンポーネントの外に置くことができます：

```js {2-3}
if (typeof window !== 'undefined') { // ブラウザで実行されているかどうかを確認します。
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

これにより、そのようなロジックがページが読み込まれた後に一度だけ実行されることが保証されます。

### Effectではない: 製品の購入 {/*not-an-effect-buying-a-product*/}

時には、クリーンアップ関数を実装しても、Effectが2回実行されることによるユーザー可視の結果を防ぐ方法がない場合があります。例えば、Effectが製品を購入するようなPOSTリクエストを送信する場合：

```js {2-3}
useEffect(() => {
  // 🔴 間違い: このEffectは開発中に2回実行され、コードに問題があることを示します。
  fetch('/api/buy', { method: 'POST' });
}, []);
```

製品を2回購入したくはありません。しかし、これはこのロジックをEffectに入れるべきではない理由でもあります。ユーザーが別のページに移動してから戻るとどうなりますか？Effectが再び実行されます。ユーザーがページを*訪れる*ときに製品を購入するのではなく、ユーザーが*購入ボタンをクリック*したときに購入するべきです。

購入はレンダリングによって引き起こされるのではなく、特定のインタラクションによって引き起こされます。ユーザーがボタンを押したときにのみ実行されるべきです。**Effectを削除し、購入ボタンのイベントハンドラに`/api/buy`リクエストを移動します：**

```js {2-3}
  function handleClick() {
    // ✅ 購入は特定のインタラクションによって引き起こされるイベントです。
    fetch('/api/buy', { method: 'POST' });
  }
```

**これは、再マウントがアプリケーションのロジックを壊す場合、通常は既存のバグを明らかにすることを示しています。** ユーザーの視点から見ると、ページを訪れることと、ページを訪れてリンクをクリックし、戻るボタンを押してページを再度表示することの間に違いがあってはなりません。Reactは開発中にコンポーネントを一度再マウントすることで、この原則に従っていることを確認します。

## すべてをまとめる {/*putting-it-all-together*/}

このプレイグラウンドは、実際にEffectsがどのように機能するかを「体感」するのに役立ちます。

この例では、[`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)を使用して、Effectが実行された3秒後に入力テキストをコンソールに表示するようにスケジュールします。クリーンアップ関数は保留中のタイムアウトをキャンセルします。「コンポーネントをマウント」を押して開始します：

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

最初に3つのログが表示されます：`Schedule "a" log`、`Cancel "a" log`、再び`Schedule "a" log`。3秒後に`a`というログも表示されます。前述のように、追加のスケジュール/キャンセルペアは、Reactが開発中にコンポーネントを一度再マウントしてクリーンアップがうまく実装されていることを確認するためです。

次に、入力を`abc`に編集します。十分に速く行うと、`Schedule "ab" log`がすぐに`Cancel "ab" log`と`Schedule "abc" log`に続くのがわかります。**Reactは常に次のレンダリングのEffectの前に前のレンダリングのEffectをクリーンアップします。** これにより、入力に速く入力しても、一度にスケジュールされるタイムアウトは最大1つです。入力を数回編集し、コンソールを見て、Effectsがどのようにクリーンアップされるかを体感してください。

入力に何かを入力してからすぐに「コンポーネントをアンマウント」を押します。アンマウントが最後のレンダリングのEffectをクリーンアップする方法に注意してください。ここでは、最後のタイムアウトが発火する前にクリアされます。

最後に、上記のコンポーネントを編集し、タイムアウトがキャンセルされないようにクリーンアップ関数をコメントアウトします。`abcde`を速く入力してみてください。3秒後に何が起こると思いますか？タイムアウト内の`console.log(text)`は*最新の*`text`を出力し、5つの`abcde`ログを生成しますか？直感を確認するために試してみてください！

3秒後に、`a`、`ab`、`abc`、`abcd`、`abcde`のログのシーケンスが表示されるはずです。**各Effectは対応するレンダリングから`text`値を「キャプチャ」します。** 状態が変更されても関係ありません：`text = 'ab'`のレンダリングからのEffectは常に`'ab'`を参照します。言い換えれば、各レンダリングのEffectは互いに独立しています。これがどのように機能するか興味がある場合は、[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)について読むことができます。

<DeepDive>

#### 各レンダリングには独自のEffectsがあります {/*each-render-has-its-own-effects*/}

`useEffect`はレンダリング出力に動作を「アタッチ」するように考えることができます。このEffectを考えてみましょう：

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

 
return <h1>Welcome to {roomId}!</h1>;
}
```

ユーザーがアプリを移動する際に何が起こるかを見てみましょう。

#### 初回レンダリング {/*initial-render*/}

ユーザーが`<ChatRoom roomId="general" />`を訪れます。`roomId`を`'general'`に[メンタルに置き換えます](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)：

```js
  // 初回レンダリングのJSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**Effectもレンダリング出力の一部です。** 初回レンダリングのEffectは次のようになります：

```js
  // 初回レンダリングのEffect (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 初回レンダリングの依存関係 (roomId = "general")
  ['general']
```

ReactはこのEffectを実行し、`'general'`チャットルームに接続します。

#### 同じ依存関係での再レンダリング {/*re-render-with-same-dependencies*/}

次に、`<ChatRoom roomId="general" />`が再レンダリングされます。JSX出力は同じです：

```js
  // 2回目のレンダリングのJSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

Reactはレンダリング出力が変わっていないことを確認し、DOMを更新しません。

2回目のレンダリングのEffectは次のようになります：

```js
  // 2回目のレンダリングのEffect (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 2回目のレンダリングの依存関係 (roomId = "general")
  ['general']
```

Reactは2回目のレンダリングの`['general']`を初回レンダリングの`['general']`と比較します。**すべての依存関係が同じであるため、Reactは2回目のレンダリングのEffectを*無視*します。** それは決して呼び出されません。

#### 異なる依存関係での再レンダリング {/*re-render-with-different-dependencies*/}

次に、ユーザーが`<ChatRoom roomId="travel" />`を訪れます。今回は、コンポーネントが異なるJSXを返します：

```js
  // 3回目のレンダリングのJSX (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

ReactはDOMを更新し、`"Welcome to general"`を`"Welcome to travel"`に変更します。

3回目のレンダリングのEffectは次のようになります：

```js
  // 3回目のレンダリングのEffect (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // 3回目のレンダリングの依存関係 (roomId = "travel")
  ['travel']
```

Reactは3回目のレンダリングの`['travel']`を2回目のレンダリングの`['general']`と比較します。1つの依存関係が異なります：`Object.is('travel', 'general')`は`false`です。Effectはスキップできません。

**Reactが3回目のレンダリングのEffectを適用する前に、最後に実行されたEffectをクリーンアップする必要があります。** 2回目のレンダリングのEffectはスキップされたため、Reactは初回レンダリングのEffectをクリーンアップする必要があります。初回レンダリングにスクロールすると、そのクリーンアップが`createConnection('general')`で作成された接続を切断することがわかります。これにより、アプリは`'general'`チャットルームから切断されます。

その後、Reactは3回目のレンダリングのEffectを実行します。これにより、`'travel'`チャットルームに接続されます。

#### アンマウント {/*unmount*/}

最後に、ユーザーがナビゲートして`ChatRoom`コンポーネントがアンマウントされるとします。Reactは最後のEffectのクリーンアップ関数を実行します。最後のEffectは3回目のレンダリングからのものでした。3回目のレンダリングのクリーンアップは`createConnection('travel')`接続を破壊します。したがって、アプリは`'travel'`ルームから切断されます。

#### 開発専用の動作 {/*development-only-behaviors*/}

[Strict Mode](/reference/react/StrictMode)がオンの場合、Reactはマウント後にすべてのコンポーネントを一度再マウントします（状態とDOMは保持されます）。これにより、[クリーンアップが必要なEffectを見つける](#step-3-add-cleanup-if-needed)のに役立ち、レースコンディションのようなバグを早期に発見できます。さらに、開発中にファイルを保存するたびにEffectが再マウントされます。これらの動作はすべて開発専用です。

</DeepDive>

<Recap>

- イベントとは異なり、Effectsは特定のインタラクションではなくレンダリング自体によって引き起こされます。
- Effectsを使用すると、コンポーネントを外部システム（サードパーティAPI、ネットワークなど）と同期させることができます。
- デフォルトでは、Effectsはすべてのレンダリング後（初回レンダリングを含む）に実行されます。
- すべての依存関係が前回のレンダリング時と同じ値を持っている場合、ReactはEffectの再実行をスキップします。
- 依存関係を「選択」することはできません。依存関係はEffect内のコードによって決まります。
- 空の依存関係配列（`[]`）は、コンポーネントが「マウント」される、つまり画面に追加されることに対応します。
- Strict Modeでは、Reactは開発中にコンポーネントを2回マウントしてEffectsをストレステストします。
- Effectが再マウントによって壊れる場合、クリーンアップ関数を実装する必要があります。
- Reactは次回Effectが実行される前、およびアンマウント時にクリーンアップ関数を呼び出します。

</Recap>

<Challenges>

#### フィールドにフォーカスを当てる {/*focus-a-field-on-mount*/}

この例では、フォームが`<MyInput />`コンポーネントをレンダリングします。

入力の[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)メソッドを使用して、`MyInput`が画面に表示されたときに自動的にフォーカスされるようにします。既にコメントアウトされた実装がありますが、うまく機能しません。なぜうまく機能しないのかを見つけて修正してください。（`autoFocus`属性に慣れている場合、それが存在しないふりをしてください：同じ機能をゼロから再実装しています。）

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: これはうまく機能しません。修正してください。
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

ソリューションが機能することを確認するには、「Show form」を押して入力がフォーカスされる（ハイライトされ、カーソルが内部に配置される）ことを確認します。「Hide form」を押してから再び「Show form」を押します。入力が再びハイライトされることを確認します。

`MyInput`は*マウント時*にのみフォーカスされるべきであり、すべてのレンダリング後ではありません。動作が正しいことを確認するために、「Show form」を押してから「Make it uppercase」チェックボックスを繰り返し押します。チェックボックスをクリックしても、上の入力がフォーカスされることは*ありません*。

<Solution>

レンダリング中に`ref.current.focus()`を呼び出すことは間違いです。これは*副作用*だからです。副作用はイベントハンドラ内に置くか、`useEffect`で宣言する必要があります。この場合、副作用は特定のインタラクションによって引き起こされるのではなく、コンポーネントが表示されることによって引き起こされるため、Effectに入れるのが理にかなっています。

間違いを修正するには、`ref.current.focus()`呼び出しをEffect宣言にラップします。次に、このEffectがすべてのレンダリング後ではなくマウント時にのみ実行されるようにするために、空の`[]`依存関係を追加します。

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 条件付きでフィールドにフォーカスを当てる {/*focus-a-field-conditionally*/}

このフォームは2つの`<MyInput />`コンポーネントをレンダリングします。

「Show form」を押すと、2番目のフィールドが自動的にフォーカスされることに気付くでしょう。これは、両方の`<MyInput />`コンポーネントが内部のフィールドにフォーカスしようとするためです。2つの入力フィールドに対して`focus()`を連続して呼び出すと、常に最後のものが「勝ちます」。

最初のフィールドにフォーカスを当てたいとします。最初の`MyInput`コンポーネントは現在、`true`に設定されたブール値の`shouldFocus`プロップを受け取ります。`MyInput`が受け取る`shouldFocus`プロップが`true`の場合にのみ`focus()`が呼び出されるようにロジックを変更します。

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: shouldFocusがtrueの場合にのみfocus()を呼び出します。
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

ソリューションを確認するには、「Show form」と「Hide form」を繰り返し押します。フォームが表示されると、*最初の*入力のみがフォーカスされるはずです。これは、親コンポーネントが最初の入力を`shouldFocus={true}`でレンダリングし、2番目の入力を`shouldFocus={false}`でレンダリングするためです。また、両方の入力がまだ機能し、両方に入力できることを確認してください。

<Hint>

Effectを条件付きで宣言することはできませんが、Effect内に条件付きロジックを含めることができます。

</Hint>

<Solution>

条件付きロジックをEffect内に入れます。Effect内で使用しているため、`shouldFocus`を依存関係として指定する必要があります。（これにより、ある入力の`shouldFocus`が`false`から`true`に変わると、マウント後にフォーカスされます。）

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### インターバルが2回実行される問題を修正する {/*fix-an-interval-that-fires-twice*/}

この`Counter`コンポーネントは、カウンターを1秒ごとにインクリメントするはずです。マウント時に[`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)を呼び出します。これにより、`onTick`が1秒ごとに実行されます。`onTick`関数はカウンターをインクリメントします。

しかし、1秒ごとに1回インクリメントされる代わりに、2回インクリメントされます。なぜでしょうか？バグの原因を見つけて修正してください。

<Hint>

`setInterval`はインターバルIDを返し、これを[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)に渡してインターバルを停止できます。

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

[Strict Mode](/reference/react/StrictMode)がオンの場合（このサイトのサンドボックスのように）、Reactは開発中に各コンポーネントを一度再マウントします。これにより、インターバルが2回設定され、カウンターが1秒ごとに2回インクリメントされます。

しかし、Reactの動作はバグの*原因*ではありません：バグは既にコードに存在します。Reactの動作はバグをより目立たせます。実際の原因は、このEffectがプロセスを開始するが、それをクリーンアップする方法を提供していないことです。

このコードを修正するには、`setInterval`によって返されるインターバルIDを保存し、[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)を使用してクリーンアップ関数を実装します：

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

開発中、Reactは依然としてコンポーネントを一度再マウントして、クリーンアップがうまく実装されていることを確認します。したがって、`setInterval`呼び出しがあり、すぐに`clearInterval`が続き、再び`setInterval`が呼び出されます。本番環境では、`setInterval`呼び出しは1回だけです。ユーザー可視の動作はどちらの場合も同じです：カウンターは1秒ごとに1回インクリメントされます。

</Solution>

#### Effect内のフェッチを修正する {/*fix-fetching-inside-an-effect*/}

このコンポーネントは、選択された人物の伝記を表示します。マウント時および`person`が変更されるたびに、非同期関数`fetchBio(person)`を呼び出して伝記をロードします。その非同期関数は最終的に文字列に解決される[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を返します。フェッチが完了すると、その文字列を選択ボックスの下に表示するために`setBio`を呼び出します。

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

このコードにはバグがあります。まず「Alice」を選択します。次に「Bob」を選択し、その直後に「Taylor」を選択します。これを十分に速く行うと、バグが発生します：Taylorが選択されているのに、下の段落には「This is Bob's bio.」と表示されます。

なぜこれが起こるのでしょうか？このEffect内のバグを修正してください。

<Hint>

Effectが非同期に何かをフェッチする場合、通常はクリーンアップが必要です。

</Hint>

<Solution>

バグを引き起こすためには、次の順序で事が進む必要があります：

- `'Bob'`を選択すると`fetchBio('Bob')`がトリガーされます
- `'Taylor'`を選択すると`fetchBio('Taylor')`がトリガーされます
- **`'Taylor'`のフェッチが`'Bob'`のフェッチよりも先に完了します**
- `'Taylor'`のレンダリングからのEffectが`setBio('This is Taylor’s bio')`を呼び出します
- `'Bob'`のフェッチが完了します
- `'Bob'`のレンダリングからのEffectが`setBio('This is Bob’s bio')`を呼び出します

これが、Taylorが選択されているのにBobの伝記が表示される理由です。このようなバグは[レースコンディション](https://en.wikipedia.org/wiki/Race_condition)と呼ばれ、2つの非同期操作が「競争」しており、予期しない順序で到着する可能性があります。

このレースコンディションを修正するには、クリーンアップ関数を追加します：

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

各レンダリングのEffectには独自の`ignore`変数があります。最初は`ignore`変数が`false`に設定されます。しかし、Effectがクリーンアップされると（例えば、別の人物を選択したとき）、その`ignore`変数は`true`になります。したがって、リクエストがどの順序で完了しても関係ありません。最後の人物のEffectだけが`ignore`が`false`に設定されるため、そのEffectが`setBio(result)`を呼び出します。過去のEffectはクリーンアップされているため、`if (!ignore)`チェックによりそれらが`setBio`を呼び出すことはありません：

- `'Bob'`を選択すると`fetchBio('Bob')`がトリガーされます
- `'Taylor'`を選択すると`fetchBio('Taylor')`がトリガーされ、**前の（Bobの）Effectがクリーンアップされます**
- `'Taylor'`のフェッチが`'Bob'`のフェッチよりも先に完了します
- `'Taylor'`のレンダリングからのEffectが`setBio('This is Taylor’s bio')`を呼び出します
- `'Bob'`のフェッチが完了します
- `'Bob'`のレンダリングからのEffectは**`ignore`フラグが`true`に設定されているため何もしません**

古いAPI呼び出しの結果を無視することに加えて、[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)を使用して不要なリクエストをキャンセルすることもできます。しかし、これだけではレースコンディションから保護するのに十分ではありません。フェッチの後にさらに非同期ステップがチェーンされる可能性があるため、`ignore`のような明示的なフラグを使用することがこのタイプの問題を修正する最も信頼性の高い方法です。

</Solution>

</Challenges>