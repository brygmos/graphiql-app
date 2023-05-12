import React, { FC, ReactNode, useState } from 'react';
import { CircularProgress } from '@mui/material';
import TreeView from '@mui/lab/TreeView';
import { TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type Props = {
  data: SchemaServerResponce;
};

type Expanded = {
  [key: string]: boolean;
};

type Query = {
  [key: string]: string | object | ReactNode;
  description: string;
  args: [];
};

type ArgObj = {
  [key: string]: string | object | ReactNode;
  name: string;
  type: { name: string };
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
                <ul>{expanded[value] && renderExpandedQuery(data as Query)}</ul>
              </li>
            )}
          </>
        ))}
      </ul>
    );
  }

  function renderExpandedQuery(data: Query) {
    return (
      <>
        <p>
          <em>{data.description}</em>
        </p>
        <span>Arguments: (</span>
        {data.args.map((argObj: ArgObj, idx) => {
          const argName = argObj.name;
          // if (argObj.length > 1 && idx ) return renderData(argName);
          return (
            <>
              {' '}
              <span key={idx}>
                {renderData(argName)}: {renderData(argObj.type.name)}
              </span>
              <span>, </span>
            </>
          );
        })}
        <span>)</span>
      </>
      // <ul>
      //   {Object.entries(data).map(([key, value]) => (
      //     <>
      //       {key == 'name' && (
      //         <li key={key}>
      //           <div onClick={() => toggleExpanded(value)}>{renderData(value)}</div>
      //           <ul>{expanded[value] && renderData(data)}</ul>
      //         </li>
      //       )}
      //     </>
      //   ))}
      // </ul>
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

  return (
    // <div style={{ color: 'white' }}>
    //   <h1>Available queries</h1>
    //   <div>{renderData(queryNames)}</div>
    // </div>
    <>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        <TreeItem nodeId="1" label="Queries">
          <TreeItem nodeId="2" label="Calendar" />
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS" />
          <TreeItem nodeId="6" label="MUI">
            <TreeItem nodeId="8" label="index.js" />
          </TreeItem>
        </TreeItem>
      </TreeView>
    </>
  );
};

export default Schema;
