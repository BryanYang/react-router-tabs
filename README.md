使用上和 react-router 类似，只是渲染出来是多页签，也就是页签切换不会重新渲染页面

- 和 react-router 可以嵌套使用 都是基于 history
- 页签使用的是 antd 的页签，因此内部依赖 antd 组件库

```tsx
import { Switch, Route, TabsRouter, createHistory } from "react-router-tabs";

const history = createHistory();

export default () => {

  return (
    <TabsRouter history={history}>
      <Switch>
        <Route
          title="home"
          path="/home"
          component={() => <input defaultValue={"home"} />}
        ></Route>
        <Route
          title="Registration"
          path="/Registration"
          component={() => <input defaultValue={"Registration"} />}
        >
        </Route>
      </Switch>
    </TabsRouter>
  )
}

```

-1.0.13
增加 MemoSwitch, 替代react-router的Switch 缓存匹配到的最后一个Route. 不至于每次从别的页签切换回来就重新渲染页面。
```tsx
<MemoSwitch>
  <Route />
  <Route />
</MemoSwitch>
```

- 1.0.8
支持hook : `useBlockRoute` ，入参为一个函数，返回 `true` 或者 `false`.
每当用户切换页签或者菜单时候，会触发执行。
当为true的时候，会阻断路由跳转。可以用来提醒用户做一下保存提交等操作。
```tsx
useBlockRoute(() => {
  if (userInput) {
    alert('离开前请先提交数据');
    return true;
  }
  return false;
})
```

- 1.0.4
支持hook : `useTabEffect` ，当页签激活时候执行逻辑, [可选]返回一个function, 为页签离开时触发.
```tsx
useTabEffect(() => {
  console.log('我进来拉');
  // 下面可选，可以不return,离开时啥都不做
  return () => {
    console.log('我又出去了')
  }
}, [dependence])
```

