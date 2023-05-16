import React, { useState } from 'react';
const ObjectExplorer = ({ data }) => {
  const [expanded, setExpanded] = useState({});
  const toggleExpanded = (key) => {
    setExpanded({
      ...expanded,
      [key]: !expanded[key],
    });
  };
  const renderData = (data) => {
    if (typeof data !== 'object') {
      return <span>{data}</span>;
    }
    return (
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <span onClick={() => toggleExpanded(key)}>
              {key}: {typeof value === 'object' && expanded[key] ? '-' : '+'}
            </span>
            {typeof value === 'object' && expanded[key] && renderData(value)}
            {typeof value !== 'object' && expanded[key] && <span>{value}</span>}
          </li>
        ))}
      </ul>
    );
  };
  return <div>{renderData(data)}</div>;
};
export default ObjectExplorer;
