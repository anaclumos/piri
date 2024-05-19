---
title: Directives
canary: true
---

<Canary>

이 지시문들은 [React Server Components를 사용하는 경우](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)나 그와 호환되는 라이브러리를 구축하는 경우에만 필요합니다.

</Canary>

<Intro>

지시문은 [React Server Components와 호환되는 번들러](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)에게 지침을 제공합니다.

</Intro>

---

## 소스 코드 지시문 {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client)는 클라이언트에서 실행되는 코드를 표시합니다.
* [`'use server'`](/reference/rsc/use-server)는 클라이언트 측 코드에서 호출할 수 있는 서버 측 함수를 표시합니다.