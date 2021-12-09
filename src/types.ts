import type { Location } from 'history';
import React from 'react';

export interface Panes {
  title: string;
  path: string;
  component: React.ComponentType<any>,
  exact?: boolean, 
  strict?: boolean, 
  sensitive?:boolean,
  // 如果有key, 就忽略路径匹配，直接比较key
  keyFun?: (location: Location) => string;
  key?: string;
  // search?: string;
}
