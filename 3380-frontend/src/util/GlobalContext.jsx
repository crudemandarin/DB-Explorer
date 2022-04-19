import React, { useState, useMemo, createContext, useContext } from 'react';

// initialize the context with an empty object
const Context = createContext({});

// Context:
// { user: User, setUser: fn, isLoading: boolean, setIsLoading: fn }

export default function GlobalContext({ children }) {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const value = useMemo(() => ({ user, setUser, isLoading, setIsLoading }), [user, isLoading]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useGlobal = () => useContext(Context);
