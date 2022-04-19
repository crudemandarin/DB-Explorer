/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';

import ApiManager from '../api/ApiManager';

import UserNotLoggedInCard from '../cards/UserNotLoggedInCard';
import QueryControlCard from '../cards/QueryControlCard';
import AddControlCard from '../cards/AddControlCard';
import ReportControlCard from '../cards/ReportControlCard';
import TableCard from '../cards/TableCard';
import ReportSummaryCard from '../cards/ReportSummaryCard';

import { useGlobal } from '../util/GlobalContext';

function HomeGroup() {
  const { user } = useGlobal();
  const [navigation, setNavigation] = useState(0);
  const [tables, setTables] = useState([]); // string[]
  const [table, setTable] = useState(''); // string
  const [fields, setFields] = useState([]); // Field[]
  const [results, setResults] = useState([]); // Result[]
  const [report, setReport] = useState(undefined);

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

    const getReportSummary = async () => {
      const data = await ApiManager.getReport();
      setReport(data);
      console.log('homegroup.getreportsummary', data);
    }

    getTables();
    getReportSummary();
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

  const onQuery = (result) => {
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
            key={`nav-${title}`}
            className={index === navigation ? 'nav nav-active' : 'nav'}
            onClick={() => onClick(index)}
          >
            {title}
          </div>
        ))}
      </nav>
    );
  };

  const renderController = () => {
    if (!user) {
      return <UserNotLoggedInCard />
    }

    if (navigation === 0) {
      const controlProps = { table, setTable, tables, fields, results, onQuery };
      return <QueryControlCard {...controlProps} />;
    }

    if (navigation === 1) {
      const controlProps = { table, setTable, tables, fields, results };
      return <AddControlCard {...controlProps} />;
    }

    const controlProps = {};
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
      <div className="spacer" />
      <ReportSummaryCard report={report} />
    </>
  );
}

export default HomeGroup;
