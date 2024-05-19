---
title: React コンパイラ
---

<Intro>
このページでは、新しい実験的なReact Compilerの紹介と、それを成功裏に試す方法について説明します。
</Intro>

<Wip>
これらのドキュメントはまだ作業中です。詳細なドキュメントは[React Compiler Working Groupリポジトリ](https://github.com/reactwg/react-compiler/discussions)で利用可能で、安定したらこれらのドキュメントに反映されます。
</Wip>

<YouWillLearn>

* コンパイラの始め方
* コンパイラとeslintプラグインのインストール
* トラブルシューティング

</YouWillLearn>

<Note>
React Compilerは、コミュニティからの早期フィードバックを得るためにオープンソース化された新しい実験的なコンパイラです。まだ粗削りな部分があり、プロダクションでの使用には完全に準備が整っていません。

React CompilerはReact 19 Betaを必要とします。
</Note>

React Compilerは、コミュニティからの早期フィードバックを得るためにオープンソース化された新しい実験的なコンパイラです。これはビルド時のみのツールで、あなたのReactアプリを自動的に最適化します。通常のJavaScriptと[Reactのルール](/reference/rules)を理解しているため、コードを書き直す必要はありません。

コンパイラには、エディタ内でコンパイラの分析結果を表示する[eslintプラグイン](#installing-eslint-plugin-react-compiler)も含まれています。このプラグインはコンパイラとは独立して動作し、アプリでコンパイラを使用していなくても利用できます。すべてのReact開発者に、このeslintプラグインを使用してコードベースの品質向上をお勧めします。

### コンパイラは何をするのか？ {/*what-does-the-compiler-do*/}

コンパイラは、通常のJavaScriptの意味論と[Reactのルール](/reference/rules)を深く理解することで、コードに自動的な最適化を追加します。

今日では、[`useMemo`](/reference/react/useMemo)、[`useCallback`](/reference/react/useCallback)、および[`React.memo`](/reference/react/memo)を使用した手動のメモ化に慣れているかもしれません。コンパイラは、コードが[Reactのルール](/reference/rules)に従っている場合、自動的にこれを行うことができます。ルールの違反を検出した場合、そのコンポーネントやフックをスキップし、他のコードを安全にコンパイルし続けます。

コードベースがすでに非常によくメモ化されている場合、コンパイラによる大きなパフォーマンス向上は期待できないかもしれません。しかし、実際には、パフォーマンス問題を引き起こす正しい依存関係を手動でメモ化するのは難しいです。

### コンパイラを試すべきか？ {/*should-i-try-out-the-compiler*/}

コンパイラはまだ実験的であり、多くの粗削りな部分があることに注意してください。Metaのような企業でプロダクションで使用されていますが、アプリにコンパイラを導入するかどうかは、コードベースの健全性と[Reactのルール](/reference/rules)にどれだけ従っているかに依存します。

**今すぐコンパイラを使用する必要はありません。安定版がリリースされるまで待つのも良いでしょう。** しかし、アプリで小規模な実験を行い、[フィードバックを提供](#reporting-issues)してコンパイラの改善に協力していただけるとありがたいです。

## 始め方 {/*getting-started*/}

これらのドキュメントに加えて、コンパイラに関する追加情報や議論については[React Compiler Working Group](https://github.com/reactwg/react-compiler)を参照することをお勧めします。

### コードベースへのコンパイラの導入 {/*using-the-compiler-effectively*/}

#### 既存のプロジェクト {/*existing-projects*/}
コンパイラは、[Reactのルール](/reference/rules)に従う関数コンポーネントとフックをコンパイルするように設計されています。また、これらのルールを破るコードもスキップ（バイパス）することができます。しかし、JavaScriptの柔軟な性質のため、コンパイラはすべての違反を検出することはできず、誤検出（ルールを破るコンポーネント/フックを誤ってコンパイルする）する可能性があります。

このため、既存のプロジェクトでコンパイラを成功裏に導入するには、まず製品コードの小さなディレクトリで実行することをお勧めします。特定のディレクトリでのみコンパイラを実行するように設定することでこれを行うことができます：

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

稀なケースでは、`compilationMode: "annotation"`オプションを使用してコンパイラを「オプトイン」モードで実行するように設定することもできます。これにより、`"use memo"`ディレクティブで注釈されたコンポーネントとフックのみがコンパイルされます。`annotation`モードは初期採用者を支援するための一時的なものであり、`"use memo"`ディレクティブを長期的に使用することは意図していないことに注意してください。

```js {2,7}
const ReactCompilerConfig = {
  compilationMode: "annotation",
};

// src/app.jsx
export default function App() {
  "use memo";
  // ...
}
```

コンパイラの導入に自信がついたら、他のディレクトリにもカバレッジを拡大し、アプリ全体に徐々に展開することができます。

#### 新しいプロジェクト {/*new-projects*/}

新しいプロジェクトを開始する場合、デフォルトでコードベース全体にコンパイラを有効にすることができます。

## インストール {/*installation*/}

### 互換性の確認 {/*checking-compatibility*/}

コンパイラをインストールする前に、まずコードベースが互換性があるかどうかを確認できます：

<TerminalBlock>
npx react-compiler-healthcheck
</TerminalBlock>

このスクリプトは以下をチェックします：

- どれだけ多くのコンポーネントが最適化されるか：多いほど良い
- `<StrictMode>`の使用：これが有効で従っている場合、[Reactのルール](/reference/rules)が守られている可能性が高い
- 互換性のないライブラリの使用：コンパイラと互換性のない既知のライブラリ

例として：

<TerminalBlock>
Successfully compiled 8 out of 9 components.
StrictMode usage not found.
Found no usage of incompatible libraries.
</TerminalBlock>

### eslint-plugin-react-compilerのインストール {/*installing-eslint-plugin-react-compiler*/}

React Compilerはeslintプラグインも提供しています。このeslintプラグインはコンパイラとは**独立して**使用できるため、コンパイラを使用していなくても利用できます。

<TerminalBlock>
npm install eslint-plugin-react-compiler
</TerminalBlock>

次に、eslint設定に追加します：

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': "error",
  },
}
```

### Babelとの使用 {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler
</TerminalBlock>

コンパイラには、ビルドパイプラインでコンパイラを実行するためのBabelプラグインが含まれています。

インストール後、Babel設定に追加します。コンパイラが**最初**に実行されることが重要です：

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // must run first!
      // ...
    ],
  };
};
```

`babel-plugin-react-compiler`は他のBabelプラグインよりも先に実行される必要があります。コンパイラは正確な解析のために入力ソース情報を必要とします。

### Viteとの使用 {/*usage-with-vite*/}

Viteを使用している場合、vite-plugin-reactにプラグインを追加できます：

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

### Next.jsとの使用 {/*usage-with-nextjs*/}

Next.jsにはReact Compilerを有効にする実験的な設定があります。これにより、Babelが自動的に`babel-plugin-react-compiler`で設定されます。

- React 19 Release Candidateを使用するNext.js canaryをインストール
- `babel-plugin-react-compiler`をインストール

<TerminalBlock>
npm install next@canary babel-plugin-react-compiler
</TerminalBlock>

次に、`next.config.js`で実験的なオプションを設定します：

```js {4,5,6}
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

実験的なオプションを使用すると、以下のサポートが確保されます：

- App Router
- Pages Router
- Webpack（デフォルト）
- Turbopack（`--turbo`オプションでオプトイン）

### Remixとの使用 {/*usage-with-remix*/}
`vite-plugin-babel`をインストールし、コンパイラのBabelプラグインを追加します：

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpackとの使用 {/*usage-with-webpack*/}

React Compiler用の独自のローダーを作成できます：

```js
const ReactCompilerConfig = { /* ... */ };
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');

function reactCompilerLoader(sourceCode, sourceMap) {
  // ...
  const result = transformSync(sourceCode, {
    // ...
    plugins: [
      [BabelPluginReactCompiler, ReactCompilerConfig],
    ],
  // ...
  });

  if (result === null) {
    this.callback(
      Error(
        `Failed to transform "${options.filename}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;
```

### Expoとの使用 {/*usage-with-expo*/}

ExpoはMetro経由でBabelを使用するため、インストール手順については[Usage with Babel](#usage-with-babel)セクションを参照してください。

### React Native (Metro)との使用 {/*usage-with-react-native-metro*/}

React NativeはMetro経由でBabelを使用するため、インストール手順については[Usage with Babel](#usage-with-babel)セクションを参照してください。

## トラブルシューティング {/*troubleshooting*/}

### 問題の報告 {/*reporting-issues*/}

問題を報告するには、まず[React Compiler Playground](https://playground.react.dev/)で最小限の再現を作成し、バグレポートに含めてください。

[facebook/react](https://github.com/facebook/react/issues)リポジトリで問題を報告できます。

また、React Compiler Working Groupにメンバーとして参加してフィードバックを提供することもできます。参加方法の詳細については[README](https://github.com/reactwg/react-compiler)を参照してください。

### よくある問題 {/*common-issues*/}

#### `(0 , _c) is not a function`エラー {/*0--_c-is-not-a-function-error*/}

これは、React 19 Beta以降を使用していない場合にJavaScriptモジュールの評価中に発生します。これを修正するには、まず[React 19 Betaにアップグレード](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)してください。

### デバッグ {/*debugging*/}

#### コンポーネントが最適化されているかの確認 {/*checking-if-components-have-been-optimized*/}
##### React DevTools {/*react-devtools*/}

React Devtools（v5.0+）はReact Compilerをサポートしており、コンパイラによって最適化されたコンポーネントの横に「Memo ✨」バッジを表示します。

##### その他の問題 {/*other-issues*/}

詳細はhttps://github.com/reactwg/react-compiler/discussions/7を参照してください。