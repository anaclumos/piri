---
title: <Profiler>
---

<Intro>

`<Profiler>`는 React 트리의 렌더링 성능을 프로그래밍 방식으로 측정할 수 있게 해줍니다.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## 참고 {/*reference*/}

### `<Profiler>` {/*profiler*/}

컴포넌트 트리를 `<Profiler>`로 감싸서 렌더링 성능을 측정합니다.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}

* `id`: 측정하려는 UI 부분을 식별하는 문자열입니다.
* `onRender`: React가 프로파일된 트리 내의 컴포넌트가 업데이트될 때마다 호출하는 [`onRender` 콜백](#onrender-callback)입니다. 렌더링된 내용과 소요된 시간에 대한 정보를 받습니다.

#### 주의사항 {/*caveats*/}

* 프로파일링은 추가적인 오버헤드를 발생시키므로 **기본적으로 프로덕션 빌드에서는 비활성화됩니다.** 프로덕션 프로파일링을 사용하려면 프로파일링이 활성화된 [특별한 프로덕션 빌드를 활성화](https://fb.me/react-profiling)해야 합니다.

---

### `onRender` 콜백 {/*onrender-callback*/}

React는 렌더링된 내용에 대한 정보를 가지고 `onRender` 콜백을 호출합니다.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // 렌더링 시간 집계 또는 로그...
}
```

#### 매개변수 {/*onrender-parameters*/}

* `id`: 방금 커밋된 `<Profiler>` 트리의 문자열 `id` prop입니다. 여러 프로파일러를 사용하는 경우 커밋된 트리의 어느 부분인지 식별할 수 있습니다.
* `phase`: `"mount"`, `"update"` 또는 `"nested-update"`. 트리가 처음으로 마운트되었는지, props, state 또는 Hooks의 변경으로 인해 다시 렌더링되었는지 알 수 있습니다.
* `actualDuration`: 현재 업데이트에 대해 `<Profiler>`와 그 하위 요소를 렌더링하는 데 소요된 밀리초 단위의 시간입니다. 이는 서브트리가 메모이제이션을 얼마나 잘 활용하는지 나타냅니다 (예: [`memo`](/reference/react/memo) 및 [`useMemo`](/reference/react/useMemo)). 이상적으로 이 값은 초기 마운트 후 크게 감소해야 하며, 많은 하위 요소는 특정 props가 변경될 때만 다시 렌더링되어야 합니다.
* `baseDuration`: 최적화 없이 전체 `<Profiler>` 서브트리를 다시 렌더링하는 데 걸리는 시간을 밀리초 단위로 추정한 값입니다. 트리의 각 컴포넌트의 가장 최근 렌더링 시간을 합산하여 계산됩니다. 이 값은 렌더링의 최악의 경우 비용을 추정합니다 (예: 초기 마운트 또는 메모이제이션이 없는 트리). `actualDuration`과 비교하여 메모이제이션이 작동하는지 확인할 수 있습니다.
* `startTime`: React가 현재 업데이트를 렌더링하기 시작한 시간의 숫자형 타임스탬프입니다.
* `commitTime`: React가 현재 업데이트를 커밋한 시간의 숫자형 타임스탬프입니다. 이 값은 커밋의 모든 프로파일러 간에 공유되어, 필요할 경우 그룹화할 수 있습니다.

---

## 사용법 {/*usage*/}

### 렌더링 성능을 프로그래밍 방식으로 측정하기 {/*measuring-rendering-performance-programmatically*/}

React 트리 주위에 `<Profiler>` 컴포넌트를 감싸서 렌더링 성능을 측정합니다.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

두 가지 props가 필요합니다: `id` (문자열)와 `onRender` 콜백 (함수). React는 트리 내의 컴포넌트가 업데이트를 "커밋"할 때마다 이 콜백을 호출합니다.

<Pitfall>

프로파일링은 추가적인 오버헤드를 발생시키므로 **기본적으로 프로덕션 빌드에서는 비활성화됩니다.** 프로덕션 프로파일링을 사용하려면 프로파일링이 활성화된 [특별한 프로덕션 빌드를 활성화](https://fb.me/react-profiling)해야 합니다.

</Pitfall>

<Note>

`<Profiler>`는 프로그래밍 방식으로 측정을 수집할 수 있게 해줍니다. 인터랙티브한 프로파일러를 찾고 있다면, [React Developer Tools](/learn/react-developer-tools)의 Profiler 탭을 사용해 보세요. 브라우저 확장 프로그램으로 유사한 기능을 제공합니다.

</Note>

---

### 애플리케이션의 다른 부분 측정하기 {/*measuring-different-parts-of-the-application*/}

애플리케이션의 다른 부분을 측정하기 위해 여러 `<Profiler>` 컴포넌트를 사용할 수 있습니다:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

또한 `<Profiler>` 컴포넌트를 중첩할 수도 있습니다:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

`<Profiler>`는 가벼운 컴포넌트이지만, 필요할 때만 사용해야 합니다. 각 사용은 애플리케이션에 약간의 CPU 및 메모리 오버헤드를 추가합니다.

---

