# react-router-tabs
react 书签路由

# 主要代码

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { TabsRouter, createHistory } from  'react-router-tabs/es';

const history = createHistory();

ReactDOM.render(
  <TabsRouter history={history}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TabsRouter>,
  document.getElementById('root')
);


function App() {
  const history = useHistory();

  const [activeKey, setActiveKey] = React.useState("");

  React.useEffect(() => {
    // @ts-ignore
    return history.listen((location, action ) => {
      setActiveKey(location.pathname.substring(1));
    });
  }, []);

  return (
    <div className="App">
      <menu>
        <li
          className={activeKey === "home" ? "active" : ""}
          onClick={() => {
            history.push("/home");
          }}
        >
          Home
        </li>
        <li
          className={activeKey === "Registration" ? "active" : ""}
          onClick={() => {
            history.push("/Registration");
          }}
        >
          Registration
        </li>
        <li
          className={activeKey === "Contact-us" ? "active" : ""}
          onClick={() => {
            history.push("/Contact-us");
          }}
        >
          Contact-us
        </li>
        <li
          onClick={() => {
            history.push("/About");
          }}
          className={activeKey === "About" ? "active" : ""}
        >
          About
        </li>
      </menu>
      <TabsCom tabPanes={all} />
    </div>
  );
}
