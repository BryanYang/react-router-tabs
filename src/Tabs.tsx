import React from "react";
// @ts-ignore
import { Tabs } from "antd";
import { useHistory, tabEventCache, updateActiveKey } from "./hooks";
// import { _HISTORY_CACHE_ } from "./cache";
import { matchPanePath } from "./matchPath";
import { Location } from "history";
import { Panes } from "./types";
import TabContext from "./TabContext";

const { TabPane } = Tabs;

interface ITabsComProps {
  tabPanes: Panes[];
  defaultActiveKey?: string;
}

function TabsCom(props: ITabsComProps) {
  const { tabPanes: ttabPanes, defaultActiveKey } = props;
  const tabPanes = [...ttabPanes];
  const history = useHistory();
  const [activeKey, setActiveKey] = React.useState<string>(defaultActiveKey);
  const [panes, setPanes] = React.useState<Panes[]>([]);
  const matchedCache = React.useRef<
    Record<string, ReturnType<typeof matchPanePath>>
  >({});

  const onChange = (k: string) => {
    history.push(matchedCache.current[k].url + matchedCache.current[k].search);
  };

  React.useEffect(() => {
    createNewPane(history.location);
  }, []);

  const closeTab = React.useCallback(
    (key: string) => {
      const current = panes.findIndex((p) => p.key === key);
      const remainPanes = [...panes];
      remainPanes.splice(current, 1);
      setPanes(remainPanes);
      if (tabEventCache[key]) {
        tabEventCache[key].leave?.();
      }
    },
    [panes, setPanes]
  );

  const onEdit = (key: any, action: string) => {
    if (action === "remove") {
      const current = panes.findIndex((p) => p.key === key);
      // 关闭的是当前, 则回退一下
      if (key === activeKey) {
        let next: Panes;
        // 往后
        if (current === 0 && panes.length > 1) {
          next = panes[1];
        } else if (current > 0 && panes.length > 1) {
          // 向前
          next = panes[current - 1];
        } else {
          history.push("/");
        }
        next &&
          history.push(
            matchedCache.current[next.key].url +
              matchedCache.current[next.key].search
          );
      }
      closeTab(key);
    }
  };

  const createNewPane = React.useCallback(
    (location: Location) => {
      const mat = matchPanePath(location, tabPanes);
      if (mat) {
        const newPane = { ...tabPanes.find((p) => p.path === mat.path) };
        newPane.key = mat.key;
        setPanes((prev) => {
          return [...prev, newPane];
        });
        setActiveKey(newPane.key);
        updateActiveKey(newPane.key)
        matchedCache.current[mat.key] = mat;
        matchedCache.current[mat.key].url = location.pathname;
      }
    },
    [tabPanes, setPanes, setActiveKey]
  );

  React.useEffect(() => {
    return history.listen((location, action) => {
      // 关掉当前tab.
      if (action === "REPLACE") {
        closeTab(activeKey);
        return;
      }
      const matched = matchPanePath(location, panes);

      // 如果当前页签内的路由变化。更新页签缓存的url
      if (matched) {
        matchedCache.current[matched.key] = matched;
        matchedCache.current[matched.key].url = location.pathname;
        if (activeKey === matched.key) {
          return;
        }
      }
      
      // 匹配上不是当前页签
      if (tabEventCache[activeKey]) {
        tabEventCache[activeKey].leave?.();
      }

      if (matched) {
        if (tabEventCache[matched.key]) {
          tabEventCache[matched.key].leave = tabEventCache[matched.key].enter();
        }
        updateActiveKey(matched.key)
        setActiveKey(matched.key);
      } else {
        createNewPane(location);
      }
    });
  }, [history, panes, activeKey]);

  return (
    <Tabs
      hideAdd
      defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      type={panes.length > 1 ? "editable-card" : "card"}
      onChange={onChange}
      size={"small"}
      onEdit={onEdit}
      style={{ height: "100%" }}
    >
      {panes.map((pane) => {
        const Com = pane.component;
        return (
          <TabPane tab={pane.title} key={pane.key}>
            <TabContext.Provider value={{ key: pane.key }}>
              <React.Suspense fallback="Loading...">
                <Com />
              </React.Suspense>
            </TabContext.Provider>
          </TabPane>
        );
      })}
    </Tabs>
  );
}

export default TabsCom;
