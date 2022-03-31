import React, { useState, useEffect } from 'react';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons

import './App.css';

import ApiManager from './api/ApiManager';

import TitleCard from './cards/TitleCard';
import ControlCard from './cards/ControlCard';
import TableCard from './cards/TableCard';

function App() {
  const [selectedTable, setSelectedTable] = useState('');
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [queryData, setQueryData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const tablesData = (await ApiManager.getTables()).map((table) => ({ name: table }));
        setTables(tablesData);
        setSelectedTable(tablesData[7]);
        const fieldsData = await ApiManager.getTableFields(tablesData[7].name);
        setFields(fieldsData);
      } catch (err) {
        console.error('ControlCard.getData() failed! Error =', err);
        setTables([]);
        setSelectedTable('');
      }
    };

    getData();
  }, []);

  const controlProps = { selectedTable, setSelectedTable, tables, fields, setQueryData };
  const tableProps = { data: queryData, fields };

  return (
    <div className="body">
      <TitleCard />
      <div className="spacer" />
      <ControlCard {...controlProps} />
      <div className="spacer" />
      {queryData.length ? (
        <TableCard {...tableProps} />
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
    </div>
  );
}

export default App;
