import React from "react";
import invariant from "tiny-invariant";

import RouterContext from "./RouterContext";
import HistoryContext from "./HistoryContext";
import matchPath from "./matchPath";

const useContext = React.useContext;
const __DEV__ = true;

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
