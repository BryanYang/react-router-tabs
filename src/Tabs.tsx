import React from "react";
import { Tabs } from "antd";
import "antd/dist/antd.css";
import { useHistory } from "./hooks";
import { _HISTORY_CACHE_ } from "./cache";

const { TabPane } = Tabs;

export interface Panes {
  title: string;
  key: string;
  content: React.ReactNode;
}


interface ITabsComProps {
  tabPanes: Panes[];
}

function TabsCom(props: ITabsComProps) {
  const { tabPanes } = props;
  const history = useHistory();
  const [activeKey, setActiveKey] = React.useState<string>("1");
  const [panes, setPanes] = React.useState<Panes[]>([]);

  const onChange = (k: string) => {
    history.push("/" + k);
  };

  const onEdit = (e: any, action: string) => {
    const path = "/" + e;
    if (action === "remove") {
      setPanes((prev) => {
        const index = prev.findIndex((p) => p.key === e);
        prev.splice(index, 1);
        return [...prev];
      });
      // 关闭的是当前, 则回退一下
      if (history.location.pathname === path) {
        let { cache, deleted, current } = _HISTORY_CACHE_;
        const remain = cache.filter((p) => !deleted.includes(p));
        let next;
        // 往后
        if (remain.indexOf(path) === 0 && remain.length > 1) {
          next = remain[1];
        } else {
          // 向前
          next = remain[remain.indexOf(path) - 1];
        }
        const nextIndex = cache.indexOf(next);
        const step = nextIndex - current;
        if (step !== 0) {
          history.go(step);
        }
      }
      _HISTORY_CACHE_.deleted.push(path);
    }
  };

  React.useEffect(() => {
    // @ts-ignore
    return history.listen(({ location, action }) => {
      if (action === "POP") {
        let { cache } = _HISTORY_CACHE_;
        _HISTORY_CACHE_.current = cache.indexOf(location.pathname);
      }
      const key = location.pathname.substring(1);
      const existed = panes.find((p) => p.key === key);
      if (existed) {
        setActiveKey(key);
      } else {
        setPanes((prev) => {
          const finded = tabPanes.find((p) => p.key === key);
          if (finded) {
            return [...prev, finded];
          } else return prev;
        });
        setActiveKey(key);
      }
    });
  }, [panes]);

  return (
    <Tabs
      hideAdd
      defaultActiveKey="home"
      activeKey={activeKey}
      type="editable-card"
      onChange={onChange}
      size={"small"}
      onEdit={onEdit}
    >
      {panes.map((pane) => (
        <TabPane tab={pane.title} key={pane.key}>
          {pane.content}
        </TabPane>
      ))}
    </Tabs>
  );
}

export default TabsCom;
