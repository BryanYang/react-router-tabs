import React from 'react';

const TabContext = React.createContext<{
  key: string;
}>({} as any);


export default TabContext;