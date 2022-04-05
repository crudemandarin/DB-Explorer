import React, { useState, useEffect } from 'react';

import '../styles/App.css';

import ApiManager from '../api/ApiManager';

import ControlCard from '../cards/ControlCard';
import TableCard from '../cards/TableCard';

function HomeGroup() {
  const [tables, setTables] = useState([]); // string[]
  const [table, setTable] = useState(''); // string
  const [fields, setFields] = useState([]); // Field[]
  const [results, setResults] = useState([]); // Result[]

  // Load Tables
  useEffect(() => {
    const getTables = async () => {
      try {
        const tablesData = await ApiManager.getTables();
        setTables(tablesData);
      } catch (err) {
        console.error('HomeGroup.getTables() failed! Error =', err);
        setTables([]);
      }
    };

    getTables();
  }, []);

  // Listen to Table, Load Table Fields
  useEffect(() => {
    const getFields = async () => {
      try {
        const fieldsData = await ApiManager.getTableFields(table);
        setFields(fieldsData);
      } catch (err) {
        console.error('HomeGroup.getFields() failed! Error =', err);
        setFields([]);
      }
    };

    if (table) getFields();
  }, [table]);

  const onSelectQuery = (result) => {
    setResults([result, ...results]);
  };

  const onTableCardRemove = (id) => {
    const temp = results.filter((el) => el.id !== id);
    setResults(temp);
  };

  const controlProps = { table, setTable, tables, fields, results, onSelectQuery };

  return (
    <>
      <ControlCard {...controlProps} />
      {Array.isArray(results) ? (
        results.map((result) => (
          <TableCard key={result.id} result={result} onRemove={onTableCardRemove} />
        ))
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      )}
    </>
  );
}

export default HomeGroup;
