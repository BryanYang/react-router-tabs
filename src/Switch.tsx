import React from "react";
import { Panes, TabsCom } from ".";
import { bindPanes } from './matchPath';
import RouterContext from "./RouterContext";

const Switch: React.FC<{}> = (props) => {
  const tabPanes: Panes[] = [];

  const firstRender = React.useRef(true);
  const { updateMatch } = React.useContext(RouterContext);

  React.Children.forEach(props.children, (child) => {
    if (React.isValidElement(child)) {
      tabPanes.push(child.props as any);
    }
  });


  if (firstRender.current) {
    firstRender.current = false;
    bindPanes(tabPanes);
    updateMatch?.();
    return null;
  }

  return <TabsCom tabPanes={tabPanes}></TabsCom>;
}

export default Switch;