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

import React, { FC, ReactNode } from 'react';
import { CircularProgress } from '@mui/material';

type Props = {
  data: ReactNode;
};

const Schema: FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <>
        <h1>fetching data...</h1>
        <CircularProgress color="success" />
      </>
    );
  }

  // const queryNames: Array<object> = data.data.__schema.types[0].fields;

  function renderData(data: ReactNode): ReactNode {
    if (!data) {
      return <span>*empty*</span>;
    }
    if (typeof data == 'string' || typeof data == 'number') {
      return <span>{data}</span>;
    }
    if (Array.isArray(data)) {
      const render: ReactNode[] = data.map((el) => {
        return renderData(el);
      });
      return render as ReactNode;
    }

    if (typeof data == 'object' && !Array.isArray(data)) {
      return (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              {key}: {renderData(value)}
            </li>
          ))}
        </ul>
      );
    }
  }

  return (
    <div style={{ color: 'white' }}>
      <h1>Available queries</h1>
      <div>{renderData(data)}</div>
    </div>
  );
};

export default Schema;

// const Schema: FC<Props> = ({ data }) => {
//   const getType = (data) => {
//     if (Array.isArray(data)) {
//       return 'array';
//     } else if (typeof data === 'object') {
//       return 'object';
//     } else {
//       return 'primitive';
//     }
//   };
//   const type = getType(data);
//   let content;
//   if (type === 'primitive') {
//     content = data;
//   } else if (type === 'array') {
//     content = data.map((item, index) => <Schema key={index} data={item} />);
//   } else {
//     content = Object.keys(data).map((key) => (
//       <div key={key}>
//         <h3>{key}</h3>
//         <Schema data={data[key]} />
//       </div>
//     ));
//   }
//   return <div>{content}</div>;
// };
//
// export default Schema;
