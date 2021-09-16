import React from "react";
import { History } from "history";
import HistoryContext from "./HistoryContext";
import RouterContext from "./RouterContext";


interface IRouterProps {
  history: History<any>;
  children: React.ReactElement;
}

function  computeRootMatch(pathname: string) {
  return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
}

const Router: React.FC<IRouterProps> = (props: IRouterProps) => {

  const { history, children } = props;

  return (
    <RouterContext.Provider
      value={{
        history: history,
        location: history.location,
        match: computeRootMatch(history.location.pathname),
      }}
    >
      <HistoryContext.Provider
        children={children || null}
        value={history}
      />
    </RouterContext.Provider>
  );
}


export default Router;