import React, { useMemo } from "react";
import invariant from "tiny-invariant";

import RouterContext from "./RouterContext";
import HistoryContext from "./HistoryContext";
import matchPath from "./matchPath";
import TabContext from "./TabContext";

const useContext = React.useContext;
const __DEV__ = true;

let activeKey = '';

export function updateActiveKey(key: string) {
  activeKey = key;
}

export function useHistory() {
  if (__DEV__) {
    invariant(
      typeof useContext === "function",
      "You must use React >= 16.8 in order to use useHistory()"
    );
  }

  return useContext(HistoryContext);
}

export function useLocation() {
  if (__DEV__) {
    invariant(
      typeof useContext === "function",
      "You must use React >= 16.8 in order to use useLocation()"
    );
  }

  return useContext(RouterContext).location;
}

export function useParams() {
  if (__DEV__) {
    invariant(
      typeof useContext === "function",
      "You must use React >= 16.8 in order to use useParams()"
    );
  }

  const match = useContext(RouterContext).match;
  return match ? match.params : {};
}

export function useRouteMatch(path: string) {
  if (__DEV__) {
    invariant(
      typeof useContext === "function",
      "You must use React >= 16.8 in order to use useRouteMatch()"
    );
  }

  const location = useLocation();
  const match = useContext(RouterContext).match;
  return path ? matchPath(location.pathname, path) : match;
}

export const tabEventCache: Record<string, {
  enter: Function,
  leave: Function;
}> = {};

export const tabBlockRoute: Record<string, () => Promise<boolean>> = {}

export function useTabEffect(fn: () => void | Function, dependence?: any[]) {
  const tabContext = useContext(TabContext);
  const { key } = tabContext;

  tabEventCache[key] = useMemo(() => {
    return {
      enter: fn,
      leave: function() { },
    };
  }, dependence)
}

/**
 * 是否需要阻断路由跳转
 * @param fn 是否阻断路由跳转，返回true阻断，返回false不阻断
 */
export function useBlockRoute(fn: () => Promise<boolean>) {
  const tabContext = useContext(TabContext);
  const { key } = tabContext;
  tabBlockRoute[key] = fn;
}


export function rewirteHistory(history: any) {
  const oldPush = history.push;
    history.push = (...args: any) => {
    if (tabBlockRoute[activeKey]) {
      tabBlockRoute[activeKey]().then((result: boolean) => {
        result && console.log('block route');
        !result && oldPush(...args);
      })
    } else {
      oldPush(...args);
    }
  };
  return history;
}
