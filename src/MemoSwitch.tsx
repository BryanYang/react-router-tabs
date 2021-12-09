import React, { useContext, useRef } from "react";
import { __RouterContext as RouterContext } from "react-router";
import matchPath from "./matchPath";

export default (props: any) => {
  const { children } = props;
  const context = useContext(RouterContext);
  const lastMatched = useRef(null);
  const location = props.location || context.location;
  let element: any;
  let match: any;
  React.Children.forEach(children, (child) => {
    if (match == null && React.isValidElement(child)) {
      element = child;
      // @ts-ignore
      const path = child.props.path || child.props.from;

      match = path
        // @ts-ignore
        ? matchPath(location.pathname, { ...child.props, path })
        : context.match;
    }
  });

  if (match) lastMatched.current = match;

  const com = React.useMemo(() => {
    return match
      ? React.cloneElement(element, { location, computedMatch: match })
      : null;
  }, [lastMatched.current]);

  return com;
};
