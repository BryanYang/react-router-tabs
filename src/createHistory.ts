import { createBrowserHistory, parsePath } from 'history';
import { BrowserHistoryBuildOptions, } from 'history/createBrowserHistory';
import { _HISTORY_CACHE_ } from "./cache";
import { matchPanePath } from './matchPath';

// function createHistory(opts?: BrowserHistoryBuildOptions) {
//   const history = createBrowserHistory(opts);
//   const oriPush = history.push;

//   history.push = (path: string) => {
//     let { cache, current } = _HISTORY_CACHE_;
//     const matched = matchPanePath(parsePath(path), _HISTORY_CACHE_.tabPanes);

//     _HISTORY_CACHE_.deleted = _HISTORY_CACHE_.deleted.filter((d) => d !== (matched?.key || path));

//     if (_HISTORY_CACHE_.cache[_HISTORY_CACHE_.current] === matched.key) {
//       // do nothing
//       console.log('push的路由和当前一样，什么都不做')
//       return;
//     }

//     if (matched && cache.indexOf(matched.key) >= 0) {
//       const step = cache.indexOf(matched.key) - current;
//       if (step === 0) {
//         return;
//       }
//       console.log(`history.go(${step})`)
//       history.go(step);
//     } else {
//       console.log(`oriPush(${path})`)
//       oriPush(path);
//       // 目前页面在回退状态。push 后，current 后的都会消失，因此要手动清理掉cache
//       if (current < cache.length - 1) {
//         cache.splice(current + 1);
//       }
//       cache.push(matched?.key || path);
//       _HISTORY_CACHE_.current = cache.length - 1;
//     }
//     console.log('路由Push后')
//     console.log(_HISTORY_CACHE_.cache, _HISTORY_CACHE_.current)
//   };
//   return history;
// }


export default createBrowserHistory;