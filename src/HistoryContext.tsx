import React from 'react';
import type { History } from 'history'

const HistoryContext = React.createContext<History>({} as any);


export default HistoryContext;