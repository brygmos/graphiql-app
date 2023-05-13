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
    return Object.entries(data).map(([key, value]) => (
      <>
        {key == 'name' && (
          <TreeItem nodeId={value} label={value}>
            {renderExpandedQuery(data as Query)}
          </TreeItem>
        )}
      </>
    ));
  }

  function renderExpandedQuery(data: Query) {
    return (
      <>
        <TreeItem nodeId="4" label={data.description} />
        <TreeItem nodeId={data.description} label="arguments">
          {data.args.map((argObj: ArgObj, idx) => {
            const argName = argObj.name;
            return (
              <TreeItem
                nodeId={argName}
                label={argName + ': ' + argObj.type.name}
                key={data.description}
              ></TreeItem>
            );
          })}
        </TreeItem>
      </>
    );
  }

  function renderData(data: object | string | number): ReactNode {
    if (!data) {
      return <TreeItem nodeId="2" label="*empty*"></TreeItem>;
    }
    if (typeof data == 'string' || typeof data == 'number') {
      return <TreeItem nodeId="2" label={data} />;
    }
    if (Array.isArray(data)) {
      const render: ReactNode[] = data.map((el) => {
        if (el.name && el.description && el.args) return renderQuery(el);
        return renderData(el);
      });
      return render as ReactNode;
    }

    if (typeof data == 'object' && !Array.isArray(data)) {
      return Object.entries(data).map(([key, value]) => (
        <TreeItem nodeId={key} key={key}>
          {key}: {renderData(value)}
        </TreeItem>
      ));
    }
  }

  return (
    <div style={{ color: 'white' }}>
      <h1>Available graphQL requests</h1>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 400, flexGrow: 1, maxWidth: 800, overflowY: 'auto' }}
      >
        <TreeItem nodeId="1" label="Queries">
          {renderData(queryNames)}
        </TreeItem>
        <TreeItem nodeId="types" label="Types">
          {renderData(data.data.__schema.types)}
        </TreeItem>
      </TreeView>
    </div>
  );
};

export default Schema;
