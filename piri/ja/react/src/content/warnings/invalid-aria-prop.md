---
title: 無効なARIAプロップ警告
---

この警告は、Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [仕様](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)に存在しない `aria-*` プロパティを使用してDOM要素をレンダリングしようとした場合に発生します。

1. 有効なプロパティを使用していると感じる場合は、スペルを慎重に確認してください。`aria-labelledby` や `aria-activedescendant` はよくスペルミスされます。

2. `aria-role` と書いた場合、`role` を意味している可能性があります。

3. それ以外の場合、最新バージョンのReact DOMを使用しており、ARIA仕様に記載されている有効なプロパティ名を使用していることを確認した場合は、[バグを報告](https://github.com/facebook/react/issues/new/choose)してください。