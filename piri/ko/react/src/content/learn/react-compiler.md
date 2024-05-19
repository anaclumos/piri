---
title: React 컴파일러
---

<Intro>
이 페이지는 새로운 실험적인 React Compiler와 이를 성공적으로 시도하는 방법에 대한 소개를 제공합니다.
</Intro>

<Wip>
이 문서는 아직 작업 중입니다. 더 많은 문서는 [React Compiler Working Group repo](https://github.com/reactwg/react-compiler/discussions)에서 확인할 수 있으며, 안정화되면 이 문서에 반영될 예정입니다.
</Wip>

<YouWillLearn>

* 컴파일러 시작하기
* 컴파일러 및 eslint 플러그인 설치
* 문제 해결

</YouWillLearn>

<Note>
React Compiler는 커뮤니티의 초기 피드백을 받기 위해 오픈 소스화된 새로운 실험적인 컴파일러입니다. 아직 거친 부분이 있으며, 프로덕션에 완전히 준비되지 않았습니다.

React Compiler는 React 19 Beta가 필요합니다.
</Note>

React Compiler는 커뮤니티의 초기 피드백을 받기 위해 오픈 소스화된 새로운 실험적인 컴파일러입니다. 이는 빌드 타임 전용 도구로, 자동으로 React 앱을 최적화합니다. 일반 JavaScript와 함께 작동하며, [React의 규칙](/reference/rules)을 이해하므로 코드를 다시 작성할 필요가 없습니다.

컴파일러는 또한 컴파일러의 분석 결과를 편집기에서 바로 보여주는 [eslint 플러그인](#installing-eslint-plugin-react-compiler)을 포함합니다. 이 플러그인은 컴파일러와 독립적으로 실행되며, 앱에서 컴파일러를 사용하지 않더라도 사용할 수 있습니다. 모든 React 개발자에게 이 eslint 플러그인을 사용하여 코드베이스의 품질을 향상시키는 것을 권장합니다.

### 컴파일러는 무엇을 하나요? {/*what-does-the-compiler-do*/}

컴파일러는 일반 JavaScript 의미론과 [React의 규칙](/reference/rules)을 깊이 이해하여 코드를 자동으로 최적화할 수 있습니다.

오늘날 [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), [`React.memo`](/reference/react/memo)를 통한 수동 메모이제이션에 익숙할 수 있습니다. 컴파일러는 코드가 [React의 규칙](/reference/rules)을 따르는 경우 이를 자동으로 수행할 수 있습니다. 규칙 위반을 감지하면 해당 컴포넌트나 훅을 건너뛰고 다른 코드를 안전하게 컴파일합니다.

코드베이스가 이미 잘 메모이제이션되어 있다면 컴파일러로 큰 성능 향상을 기대하지 않을 수 있습니다. 그러나 성능 문제를 일으키는 올바른 종속성을 메모이제이션하는 것은 수작업으로 정확하게 하기 어렵습니다.

### 컴파일러를 시도해봐야 할까요? {/*should-i-try-out-the-compiler*/}

컴파일러는 여전히 실험적이며 거친 부분이 많다는 점을 유의하세요. Meta와 같은 회사에서 프로덕션에서 사용되었지만, 앱의 코드베이스 상태와 [React의 규칙](/reference/rules)을 얼마나 잘 따랐는지에 따라 프로덕션에 컴파일러를 도입할 수 있습니다.

**지금 당장 컴파일러를 사용해야 할 필요는 없습니다. 안정적인 릴리스가 될 때까지 기다려도 괜찮습니다.** 그러나 앱에서 작은 실험으로 시도해보고 [피드백을 제공](#reporting-issues)하여 컴파일러를 개선하는 데 도움을 주시면 감사하겠습니다.

## 시작하기 {/*getting-started*/}

이 문서 외에도 [React Compiler Working Group](https://github.com/reactwg/react-compiler)에서 컴파일러에 대한 추가 정보와 토론을 확인하는 것을 권장합니다.

### 코드베이스에 컴파일러 도입하기 {/*using-the-compiler-effectively*/}

#### 기존 프로젝트 {/*existing-projects*/}
컴파일러는 [React의 규칙](/reference/rules)을 따르는 함수형 컴포넌트와 훅을 컴파일하도록 설계되었습니다. 규칙을 위반하는 코드를 건너뛰어 처리할 수도 있습니다. 그러나 JavaScript의 유연한 특성으로 인해 컴파일러는 모든 가능한 위반을 잡아내지 못할 수 있으며, 규칙을 위반하는 컴포넌트/훅을 실수로 컴파일할 수 있습니다. 이는 정의되지 않은 동작을 초래할 수 있습니다.

이러한 이유로, 기존 프로젝트에 컴파일러를 성공적으로 도입하려면 제품 코드의 작은 디렉토리에서 먼저 실행해보는 것을 권장합니다. 특정 디렉토리 집합에서만 컴파일러가 실행되도록 구성할 수 있습니다:

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

드물게, `compilationMode: "annotation"` 옵션을 사용하여 "opt-in" 모드로 컴파일러를 구성할 수도 있습니다. 이는 `"use memo"` 지시어로 주석이 달린 컴포넌트와 훅만 컴파일하도록 합니다. `annotation` 모드는 초기 도입자를 돕기 위한 임시 모드이며, `"use memo"` 지시어를 장기적으로 사용할 계획은 없습니다.

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

컴파일러 도입에 더 자신감이 생기면 다른 디렉토리로 범위를 확장하고 전체 앱에 천천히 도입할 수 있습니다.

#### 새로운 프로젝트 {/*new-projects*/}

새 프로젝트를 시작하는 경우, 기본적으로 코드베이스 전체에 컴파일러를 활성화할 수 있습니다.

## 설치 {/*installation*/}

### 호환성 확인 {/*checking-compatibility*/}

컴파일러를 설치하기 전에 코드베이스가 호환되는지 확인할 수 있습니다:

<TerminalBlock>
npx react-compiler-healthcheck
</TerminalBlock>

이 스크립트는 다음을 확인합니다:

- 최적화할 수 있는 컴포넌트 수: 높을수록 좋습니다
- `<StrictMode>` 사용 여부: 이를 활성화하고 따르면 [React의 규칙](/reference/rules)을 따를 가능성이 높습니다
- 호환되지 않는 라이브러리 사용 여부: 컴파일러와 호환되지 않는 알려진 라이브러리

예를 들어:

<TerminalBlock>
Successfully compiled 8 out of 9 components.
StrictMode usage not found.
Found no usage of incompatible libraries.
</TerminalBlock>

### eslint-plugin-react-compiler 설치 {/*installing-eslint-plugin-react-compiler*/}

React Compiler는 eslint 플러그인도 지원합니다. eslint 플러그인은 컴파일러와 **독립적으로** 사용할 수 있으며, 컴파일러를 사용하지 않더라도 사용할 수 있습니다.

<TerminalBlock>
npm install eslint-plugin-react-compiler
</TerminalBlock>

그런 다음 eslint 설정에 추가합니다:

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

### Babel과 함께 사용하기 {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler
</TerminalBlock>

컴파일러는 빌드 파이프라인에서 컴파일러를 실행하기 위한 Babel 플러그인을 포함합니다.

설치 후 Babel 설정에 추가합니다. 컴파일러가 파이프라인에서 **먼저** 실행되는 것이 중요합니다:

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

`babel-plugin-react-compiler`는 컴파일러가 정확한 분석을 위해 입력 소스 정보를 필요로 하기 때문에 다른 Babel 플러그인보다 먼저 실행되어야 합니다.

### Vite와 함께 사용하기 {/*usage-with-vite*/}

Vite를 사용하는 경우, vite-plugin-react에 플러그인을 추가할 수 있습니다:

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

### Next.js와 함께 사용하기 {/*usage-with-nextjs*/}

Next.js는 React Compiler를 활성화하는 실험적 구성을 가지고 있습니다. 이는 자동으로 `babel-plugin-react-compiler`가 설정되도록 합니다.

- React 19 Release Candidate를 사용하는 Next.js canary 설치
- `babel-plugin-react-compiler` 설치

<TerminalBlock>
npm install next@canary babel-plugin-react-compiler
</TerminalBlock>

그런 다음 `next.config.js`에서 실험적 옵션을 구성합니다:

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

실험적 옵션을 사용하면 다음에서 React Compiler를 지원합니다:

- App Router
- Pages Router
- Webpack (기본)
- Turbopack (`--turbo`를 통해 opt-in)

### Remix와 함께 사용하기 {/*usage-with-remix*/}
`vite-plugin-babel`을 설치하고, 컴파일러의 Babel 플러그인을 추가합니다:

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

### Webpack과 함께 사용하기 {/*usage-with-webpack*/}

React Compiler를 위한 로더를 다음과 같이 만들 수 있습니다:

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

### Expo와 함께 사용하기 {/*usage-with-expo*/}

Expo는 Metro를 통해 Babel을 사용하므로, 설치 지침은 [Babel과 함께 사용하기](#usage-with-babel) 섹션을 참조하세요.

### React Native (Metro)와 함께 사용하기 {/*usage-with-react-native-metro*/}

React Native는 Metro를 통해 Babel을 사용하므로, 설치 지침은 [Babel과 함께 사용하기](#usage-with-babel) 섹션을 참조하세요.

## 문제 해결 {/*troubleshooting*/}

### 문제 보고 {/*reporting-issues*/}

문제를 보고하려면 먼저 [React Compiler Playground](https://playground.react.dev/)에서 최소 재현을 만들고 버그 보고서에 포함하세요.

[facebook/react](https://github.com/facebook/react/issues) repo에서 이슈를 열 수 있습니다.

또한 React Compiler Working Group에 멤버로 신청하여 피드백을 제공할 수 있습니다. 가입에 대한 자세한 내용은 [README](https://github.com/reactwg/react-compiler)를 참조하세요.

### 일반적인 문제 {/*common-issues*/}

#### `(0 , _c) is not a function` 오류 {/*0--_c-is-not-a-function-error*/}

이 오류는 React 19 Beta 이상을 사용하지 않을 때 JavaScript 모듈 평가 중에 발생합니다. 이를 해결하려면 [앱을 React 19 Beta로 업그레이드](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)하세요.

### 디버깅 {/*debugging*/}

#### 컴포넌트가 최적화되었는지 확인하기 {/*checking-if-components-have-been-optimized*/}
##### React DevTools {/*react-devtools*/}

React Devtools (v5.0+)는 React Compiler를 지원하며, 컴파일러에 의해 최적화된 컴포넌트 옆에 "Memo ✨" 배지를 표시합니다.

##### 기타 문제 {/*other-issues*/}

자세한 내용은 https://github.com/reactwg/react-compiler/discussions/7을 참조하세요.