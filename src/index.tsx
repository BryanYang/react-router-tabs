import TabsRouter from "./TabsRouter";
import createHistory from "./createHistory";
import TabsCom from "./Tabs";
import { _HISTORY_CACHE_ } from "./cache";
import { Panes } from './types';
import Switch from './Switch';
import Route from "./Route";
import MemoSwitch from "./MemoSwitch";


export { createHistory, TabsRouter, _HISTORY_CACHE_, TabsCom, Panes, Switch, Route, MemoSwitch };
export * from './hooks';