import { pathToRegexp } from "path-to-regexp";
import type { Location } from 'history';
import { Panes } from "./types";

const cache: any = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path: string, options: any) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys: any[] = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

type Match = ReturnType<typeof matchPanePath>;

/**
 * Public API for matching a URL pathname to a path.
 */
// @ts-ignore
function matchPath(pathname, options = {}) {
  if (typeof options === "string" || Array.isArray(options)) {
    options = { path: options };
  }

  // @ts-ignore
  const { path, exact = false, strict = false, sensitive = false } = options;

  const paths = [].concat(path);

  // @ts-ignore
  return paths.reduce((matched, path) => {
    if (!path && path !== "") return null;
    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      // @ts-ignore
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

function matchPanePath(location: Location, panes: Panes[]) {
  const { pathname } = location;
  return panes.reduce((matched, pane) => {
    const { path, exact = false, strict = false, sensitive = false, keyFun } = pane;
    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);
    // console.log(regexp, keys, match)
    if (!path && path !== "") return null;
    if (matched) return matched;
    if (!match) return null;
    const [url, ...values] = match;
    const isExact = pathname === url;
    if (exact && !isExact) return null;
    if (keyFun && pane.key && (keyFun(location) !== pane.key)) return null;
    return {
      key: pane.key ? pane.key : keyFun ? keyFun(location) : path,
      path, // the path used to match
      search: location.search,
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      // @ts-ignore
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null) as {
    key: string;
    path: string;
    search: string;
    url: string;
    isExact: boolean;
    params: any;
  };
}

let matchPanePathWithPanes: undefined | ((l: Location) => Match);

function bindPanes(panes: Panes[]) {
  matchPanePathWithPanes = (location: Location) => matchPanePath(location, panes);
  return matchPanePathWithPanes;
}


export default matchPath;
export {
  matchPanePath,
  bindPanes,
  matchPanePathWithPanes,
  Match,
}
