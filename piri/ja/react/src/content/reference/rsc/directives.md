---
title: Directives
canary: true
---

<Canary>

これらの指示は、[React Server Componentsを使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらに対応するライブラリを構築している場合にのみ必要です。

</Canary>

<Intro>

指示は、[React Server Componentsに対応するバンドラー](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)に指示を提供します。

</Intro>

---

## ソースコードの指示 {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) は、クライアントで実行されるコードをマークします。
* [`'use server'`](/reference/rsc/use-server) は、クライアント側のコードから呼び出すことができるサーバー側の関数をマークします。