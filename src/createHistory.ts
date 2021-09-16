import { createBrowserHistory, BrowserHistoryOptions } from "history";
import { _HISTORY_CACHE_ } from "./cache";

function createHistory(opts?: BrowserHistoryOptions) {
  const history = createBrowserHistory(opts);
  const oriPush = history.push;

  history.push = (path: string) => {
    let { cache, current } = _HISTORY_CACHE_;
    _HISTORY_CACHE_.deleted = _HISTORY_CACHE_.deleted.filter((d) => d !== path);
    if (path === history.location.pathname) {
      // do nothing
      return;
    }

    if (cache.indexOf(path) >= 0) {
      const step = cache.indexOf(path) - current;
      if (step === 0) {
        return;
      }
      history.go(step);
    } else {
      oriPush(path);
      // 目前页面在回退状态。push 后，current 后的都会消失，因此要手动清理掉cache
      if (current < cache.length - 1) {
        cache.splice(current + 1);
      }
      cache.push(path);
      _HISTORY_CACHE_.current = cache.length - 1;
    }
  };
  return history;
}

export default createHistory;