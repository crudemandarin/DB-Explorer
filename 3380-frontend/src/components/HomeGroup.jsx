/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
  const [table, setTable] = useState(''); // string
  const [fields, setFields] = useState([]); // Field[]
  const [results, setResults] = useState([]); // Result[]

  useEffect(() => {
    const getFields = async () => {
      const fieldsData = await ApiManager.getTableFields(table);
      setFields(fieldsData);
    };
    if (table) getFields();
  }, [table]);

  const onNewResult = (result) => {
    setResults([result, ...results]);
  };

  const onResultCardRemove = (id) => {
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
      const controlProps = { table, setTable, fields, results, onNewResult };
      return <QueryControlCard {...controlProps} />;
    }

    if (navigation === 1) {
      const controlProps = { table, setTable, fields, results };
      return <AddControlCard {...controlProps} />;
    }

    const controlProps = { onNewResult };
    return <ReportControlCard {...controlProps} />;
  };

  const renderResults = () => {
    if (!Array.isArray(results)) return null;
    return results.map((result) => {
      if (result.type === 'table') return <TableCard key={result.id} result={result} onRemove={onResultCardRemove} />;
      if (result.type === 'report') return <ReportSummaryCard key={result.id} result={result} onRemove={onResultCardRemove} />;
      console.error('HomeGroup.renderResults: result.type not recognized. result.type =', result.type)
      return null;
    });
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
