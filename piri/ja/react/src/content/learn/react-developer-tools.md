---
title: React デベロッパーツール
---

<Intro>

React Developer Toolsを使用して、React [コンポーネント](/learn/your-first-component)を検査し、[props](/learn/passing-props-to-a-component)や[状態](/learn/state-a-components-memory)を編集し、パフォーマンスの問題を特定します。

</Intro>

<YouWillLearn>

* React Developer Toolsのインストール方法

</YouWillLearn>

## ブラウザー拡張 {/*browser-extension*/}

Reactで構築されたウェブサイトをデバッグする最も簡単な方法は、React Developer Toolsブラウザー拡張をインストールすることです。これはいくつかの人気のあるブラウザーで利用可能です：

* [**Chrome**にインストール](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox**にインストール](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge**にインストール](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

今、**Reactで構築された**ウェブサイトを訪れると、_Components_と_Profiler_パネルが表示されます。

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safariおよびその他のブラウザー {/*safari-and-other-browsers*/}
他のブラウザー（例えば、Safari）の場合は、[`react-devtools`](https://www.npmjs.com/package/react-devtools) npmパッケージをインストールします：
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

次に、ターミナルから開発者ツールを開きます：
```bash
react-devtools
```

次に、ウェブサイトの`<head>`の先頭に次の`<script>`タグを追加して接続します：
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

ブラウザーでウェブサイトをリロードして、開発者ツールで表示します。

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## モバイル（React Native） {/*mobile-react-native*/}
React Developer Toolsは、[React Native](https://reactnative.dev/)で構築されたアプリを検査するためにも使用できます。

React Developer Toolsを使用する最も簡単な方法は、グローバルにインストールすることです：
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

次に、ターミナルから開発者ツールを開きます。
```bash
react-devtools
```

ローカルで実行中の任意のReact Nativeアプリに接続するはずです。

> 数秒後に開発者ツールが接続しない場合は、アプリをリロードしてみてください。

[React Nativeのデバッグについてさらに学ぶ。](https://reactnative.dev/docs/debugging)