import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';

import ApiManager from '../api/ApiManager';

const Context = createContext({});

export default function GlobalContext({ children }) {
  const [user, setUser] = useState(undefined);
  const [tables, setTables] = useState([]);
  const [userWorkspaces, setUserWorkspaces] = useState([]);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const tablesData = await ApiManager.getTables();
      const [workspaces] = await ApiManager.select({ userId: user.ID, table: 'Workspace' });
      const [projects] = await ApiManager.select({ userId: user.ID, table: 'Project' });
      setTables(tablesData);
      setUserWorkspaces(workspaces);
      setUserProjects(projects);
    }
    if (user) getData();
  }, [user]);

  const value = useMemo(() => ({ user, setUser, tables, setTables, userWorkspaces, userProjects }), [user, tables, userWorkspaces, userProjects]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useGlobal = () => useContext(Context);
