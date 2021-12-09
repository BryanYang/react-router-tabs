import React from 'react';
import { Location, History } from 'history';

interface Match {
  path: string;
  url: string;
  params: Record<string, any>;
  isExact: boolean;
}

export interface IRouterContext {
  location: Location;
  history: History;
  match?: Match;
  updateMatch?: () => void;
}

const RouterContext = React.createContext<IRouterContext>({
  location: {} as any,
  history: {} as any,
});


export default RouterContext;