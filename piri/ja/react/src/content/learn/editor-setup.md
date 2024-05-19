---
title: エディタのセットアップ
---

<Intro>

適切に設定されたエディタは、コードを読みやすくし、書く速度を速めることができます。さらには、コードを書いている最中にバグを見つける手助けもしてくれます！これが初めてのエディタ設定である場合や、現在のエディタを調整したい場合には、いくつかの推奨事項があります。

</Intro>

<YouWillLearn>

* 最も人気のあるエディタは何か
* コードを自動的にフォーマットする方法

</YouWillLearn>

## あなたのエディタ {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) は、今日最も人気のあるエディタの一つです。大規模な拡張機能のマーケットプレイスがあり、GitHubのような人気のサービスともうまく統合されています。以下に挙げるほとんどの機能は、VS Codeに拡張機能として追加することができるため、非常にカスタマイズ可能です！

Reactコミュニティで使用されている他の人気のテキストエディタには以下のものがあります：

* [WebStorm](https://www.jetbrains.com/webstorm/) は、JavaScript専用に設計された統合開発環境です。
* [Sublime Text](https://www.sublimetext.com/) は、JSXとTypeScriptをサポートし、[シンタックスハイライト](https://stackoverflow.com/a/70960574/458193)とオートコンプリートが組み込まれています。
* [Vim](https://www.vim.org/) は、あらゆる種類のテキストを効率的に作成および変更するために設計された高度にカスタマイズ可能なテキストエディタです。ほとんどのUNIXシステムおよびApple OS Xには「vi」として含まれています。

## 推奨されるテキストエディタの機能 {/*recommended-text-editor-features*/}

一部のエディタにはこれらの機能が組み込まれていますが、他のエディタでは拡張機能を追加する必要があるかもしれません。選んだエディタがどのようなサポートを提供しているかを確認してみてください！

### リンティング {/*linting*/}

コードリンターは、コードを書いている最中に問題を見つけ、早期に修正する手助けをします。[ESLint](https://eslint.org/) は、JavaScript用の人気のあるオープンソースのリンターです。

* [React用の推奨設定でESLintをインストール](https://www.npmjs.com/package/eslint-config-react-app)（[Nodeをインストールしていることを確認してください！](https://nodejs.org/en/download/current/)）
* [公式拡張機能を使用してVSCodeにESLintを統合](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**プロジェクトに対してすべての[`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)ルールを有効にしていることを確認してください。** これらは重要で、最も重大なバグを早期にキャッチします。推奨される[`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app)プリセットにはすでに含まれています。

### フォーマット {/*formatting*/}

他のコントリビューターとコードを共有する際に、[タブとスペース](https://www.google.com/search?q=tabs+vs+spaces)について議論するのは避けたいものです。幸いなことに、[Prettier](https://prettier.io/) は、事前設定されたルールに従ってコードを再フォーマットすることで、コードをきれいにしてくれます。Prettierを実行すると、すべてのタブがスペースに変換され、インデントや引用符なども設定に従って変更されます。理想的な設定では、ファイルを保存する際にPrettierが実行され、これらの編集が迅速に行われます。

以下の手順に従って、[VSCodeにPrettier拡張機能をインストール](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)できます：

1. VS Codeを起動
2. クイックオープンを使用（Ctrl/Cmd+Pを押す）
3. `ext install esbenp.prettier-vscode`を貼り付ける
4. Enterを押す

#### 保存時のフォーマット {/*formatting-on-save*/}

理想的には、コードを保存するたびにフォーマットするべきです。VS Codeにはこのための設定があります！

1. VS Codeで、`CTRL/CMD + SHIFT + P`を押す
2. 「設定」と入力
3. Enterを押す
4. 検索バーに「保存時にフォーマット」と入力
5. 「保存時にフォーマット」オプションがチェックされていることを確認

> ESLintプリセットにフォーマットルールが含まれている場合、Prettierと競合する可能性があります。ESLintが論理的なミスをキャッチするためだけに使用されるように、[`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)を使用してESLintプリセットのすべてのフォーマットルールを無効にすることをお勧めします。プルリクエストがマージされる前にファイルがフォーマットされていることを強制するには、継続的インテグレーションのために[`prettier --check`](https://prettier.io/docs/en/cli.html#--check)を使用してください。