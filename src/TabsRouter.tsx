import React, { useState } from "react";
import { History } from "history";
import HistoryContext from "./HistoryContext";
import RouterContext from "./RouterContext";
import { matchPanePathWithPanes, Match } from './matchPath';
import { rewirteHistory } from "./hooks";

interface IRouterProps {
  history: History<any>;
  children: React.ReactElement;
}

function  computeRootMatch(pathname: string) {
  return { path: "/", url: "/", params: {}, isExact: pathname === "/", search: '', key: ''};
}

const Router: React.FC<IRouterProps> = (props: IRouterProps) => {

  const { history, children } = props;
  const [match, setMatch] = useState<Match>({} as Match);

  const updateMatch = React.useCallback(() => {
    const m = matchPanePathWithPanes ? matchPanePathWithPanes(history.location) : computeRootMatch(history.location.pathname);
    setMatch(m);
  }, [matchPanePathWithPanes, history])

  React.useEffect(() => {
    // 为 history 注册 block 事件
    rewirteHistory(history);
  }, [history]);

  React.useEffect(() => {
    return history.listen((location, action) => {
      updateMatch();
    });
  }, [history, updateMatch]);


  return (
    <RouterContext.Provider
      value={{
        history: history,
        location: history.location,
        match,
        updateMatch,
      }}
    >
      <HistoryContext.Provider
        children={ children || null}
        value={history}
      />
    </RouterContext.Provider>
  );
}


export default Router;