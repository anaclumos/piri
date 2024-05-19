---
title: react-test-renderer 非推奨警告
---

## ReactTestRenderer.create() 警告 {/*reacttestrenderercreate-warning*/}

react-test-rendererは非推奨です。ReactTestRenderer.create()またはReactShallowRender.render()を呼び出すたびに警告が発生します。react-test-rendererパッケージはNPMで利用可能なままですが、メンテナンスされず、新しいReactの機能やReactの内部変更により壊れる可能性があります。

Reactチームは、モダンでサポートされているテスト体験のために、テストを[@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)または[@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started)に移行することを推奨しています。


## new ShallowRenderer() 警告 {/*new-shallowrenderer-warning*/}

react-test-rendererパッケージは、もはや`react-test-renderer/shallow`でシャロウレンダラーをエクスポートしません。これは、以前に分離された別のパッケージである`react-shallow-renderer`の単なる再パッケージ化でした。したがって、直接インストールすることで同じ方法でシャロウレンダラーを使用し続けることができます。詳細は[Github](https://github.com/enzymejs/react-shallow-renderer) / [NPM](https://www.npmjs.com/package/react-shallow-renderer)を参照してください。