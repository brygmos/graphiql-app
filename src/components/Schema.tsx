import React, { FC, useState } from 'react';
import { CircularProgress } from '@mui/material';

type Props = {
  data?: object;
};

const Schema: FC<Props> = ({ data }) => {
  const [expanded, setExpanded] = useState({});
  const toggleExpanded = (key) => {
    setExpanded({
      ...expanded,
      [key]: !expanded[key],
    });
  };

  if (!data) {
    return (
      <>
        <h1>fetching data...</h1>
        <CircularProgress color="success" />
      </>
    );
  }

  const queryNames = data.data.__schema.types[0].fields;

  function renderData(data: object) {
    if (typeof data !== 'object') {
      return <span>{data}</span>;
    }
    return (
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            {value.args && <h2 onClick={() => toggleExpanded(key)}>{value.name}</h2>}
            {!value.args && <span onClick={() => toggleExpanded(key)}>{value.name}</span>}
            {expanded[key] && value.description && renderData(value.description)}
            {expanded[key] && value.args && renderData(value.args)}
            {typeof value === 'object' && expanded[key] && renderData(value)}
            {typeof value !== 'object' && expanded[key] && <span>{value}</span>}
          </div>
        ))}
      </ul>
    );
  }

  return (
    <div style={{ color: 'white' }}>
      <h1>Available queries</h1>
      <div>{renderData(queryNames)}</div>
    </div>
  );
};

export default Schema;
