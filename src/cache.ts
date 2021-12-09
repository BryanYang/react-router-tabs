import { Panes } from "."

const _HISTORY_CACHE_ : {
  cache: string[];
  current: number;
  deleted: string[];
  tabPanes: Panes[];
} = {
  cache: [],
  current: 0,
  deleted: [],
  tabPanes: [],
}


export {
  _HISTORY_CACHE_,
}