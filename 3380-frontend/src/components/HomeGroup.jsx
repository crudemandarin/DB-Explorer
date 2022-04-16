/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';

import ApiManager from '../api/ApiManager';
import Utils from '../util/Utils';

import QueryControlCard from '../cards/QueryControlCard';
import AddControlCard from '../cards/AddControlCard';
import ReportControlCard from '../cards/ReportControlCard';
import TableCard from '../cards/TableCard';

function HomeGroup() {
  const [navigation, setNavigation] = useState(0);
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

  const query = async (formParams) => {
    console.log('HomeGroup.query invoked. Form Params =', formParams);
    const params = { table, select: [], where: formParams };
    const rows = await ApiManager.select(params);
    const id = Utils.getNewQueryID();
    const result = { id, table, formParams, fields, rows };
    setResults([result, ...results]);
  };

  const onTableCardRemove = (id) => {
    const temp = results.filter((el) => el.id !== id);
    setResults(temp);
  };

  const renderNavigation = () => {
    const nav = ['SEARCH', 'ENTRY', 'REPORT'];
    const onClick = (index) => setNavigation(index);
    return (
      <nav className="flex-wrap">
        {nav.map((title, index) => (
          <div
            className={index === navigation ? 'nav nav-active' : 'nav'}
            onClick={() => onClick(index)}
          >
            {' '}
            {title}{' '}
          </div>
        ))}
      </nav>
    );
  };

  const renderController = () => {
    if (navigation === 0) {
      const controlProps = { table, setTable, tables, fields, results, query };
      return <QueryControlCard {...controlProps} />;
    }

    if (navigation === 1) {
      const controlProps = { table, setTable, tables, fields, results, query };
      return <AddControlCard {...controlProps} />;
    }

    const controlProps = { table, setTable, tables, fields, results, query };
    return <ReportControlCard {...controlProps} />;
  };

  const renderResults = () => {
    if (!Array.isArray(results)) return null;
    return results.map((result) => (
      <TableCard key={result.id} result={result} onRemove={onTableCardRemove} />
    ));
  };

  return (
    <>
      {renderNavigation()}
      {renderController()}
      {renderResults()}
    </>
  );
}

export default HomeGroup;
