// import React, { FC, useState } from 'react';
// import { CircularProgress } from '@mui/material';
//
// type Props = {
//   data?: object;
// };
//
// const Schema: FC<Props> = ({ data }) => {
//   const [expanded, setExpanded] = useState<object>({});
//   const toggleExpanded = (key: string) => {
//     setExpanded({
//       ...expanded,
//       [key]: !expanded[key],
//     });
//   };
//
//   if (!data) {
//     return (
//       <>
//         <h1>fetching data...</h1>
//         <CircularProgress color="success" />
//       </>
//     );
//   }
//
//   const queryNames = data.data.__schema.types[0].fields;
//
//   function renderData(data: object) {
//     if (typeof data !== 'object') {
//       return <span>{data}</span>;
//     }
//     return (
//       <ul>
//         {Object.entries(data).map(([key, value]) => (
//           <div key={key}>
//             {value.args && <h2 onClick={() => toggleExpanded(key)}>{value.name}</h2>}
//             {!value.args && <span onClick={() => toggleExpanded(key)}>{value.name}</span>}
//             {expanded[key] && value.description && renderData(value.description)}
//             {expanded[key] && value.args && renderData(value.args)}
//             {typeof value === 'object' && expanded[key] && renderData(value)}
//             {typeof value !== 'object' && expanded[key] && <span>{value}</span>}
//           </div>
//         ))}
//       </ul>
//     );
//   }
//
//   return (
//     <div style={{ color: 'white' }}>
//       <h1>Available queries</h1>
//       <div>{renderData(queryNames)}</div>
//     </div>
//   );
// };
//
// export default Schema;

import React, { FC, ReactNode, useState } from 'react';
import { CircularProgress } from '@mui/material';

type Props = {
  data: SchemaServerResponce;
};

type Expanded = {
  [key: string]: boolean;
};

export type SchemaServerResponce = {
  data: {
    __schema: {
      types: [{ fields: object }];
    };
  };
};

const Schema: FC<Props> = ({ data }) => {
  const [expanded, setExpanded] = useState<Expanded>({});
  const toggleExpanded = (key: string) => {
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

  const queryNames: object = data.data.__schema.types[0].fields;

  function renderQuery(data: object) {
    return (
      <ul>
        {Object.entries(data).map(([key, value]) => (
          <>
            {key == 'name' && (
              <li key={key}>
                <div onClick={() => toggleExpanded(value)}>{renderData(value)}</div>
                <ul>{expanded[value] && renderData(data)}</ul>
              </li>
            )}
          </>
        ))}
      </ul>
    );
  }

  function renderData(data: object | string | number): ReactNode {
    if (!data) {
      return <span>*empty*</span>;
    }
    if (typeof data == 'string' || typeof data == 'number') {
      return <span>{data}</span>;
    }
    if (Array.isArray(data)) {
      const render: ReactNode[] = data.map((el) => {
        if (el.name && el.description && el.args) return renderQuery(el);
        return renderData(el);
      });
      return render as ReactNode;
    }

    if (typeof data == 'object' && !Array.isArray(data)) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <>
              {
                <li key={key} onClick={() => toggleExpanded(key)}>
                  {key}: {renderData(value)}
                </li>
              }
            </>
          ))}
        </ul>
      );
    }
  }

  console.log(queryNames);

  return (
    <div style={{ color: 'white' }}>
      <h1>Available queries</h1>
      <div>{renderData(queryNames)}</div>
    </div>
  );
};

export default Schema;
