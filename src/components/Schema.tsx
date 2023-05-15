import React, { FC, ReactNode, useState } from 'react';
import { Chip, CircularProgress } from '@mui/material';
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
  description: string;
  type: ArgTypeObj;
};

type ArgTypeObj = {
  // [key: string]: string | object | ReactNode;
  // name: string | null;
  name: string;
  kind: string;
  ofType: ArgNameTypeObj;
};

type ArgNameTypeObj = {
  // [key: string]: string | object | ReactNode;
  name: string | null;
  // ofType: null | string;
  kind: string | null;
};

export type SchemaServerResponce = {
  data: {
    __schema: {
      types: SchemaType[];
    };
  };
};

type SchemaType = {
  description: string;
  fields: [];
  kind: string;
  name: string;
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
  const graphQLTypes: SchemaType[] = data.data.__schema.types;

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
        <TreeItem nodeId="4" label={'*' + data.description + '*'} />
        {data.args.length > 0 && (
          <TreeItem nodeId={data.description} label="arguments">
            {data.args.map((argObj: ArgObj, idx) => {
              const argName = argObj.name;
              if (argObj.type.name) {
                return (
                  <TreeItem nodeId={argName} key={idx} label={argName + ': ' + argObj.type.name}>
                    {renderType(argObj.type.name)}
                  </TreeItem>
                );
              }
              if (argObj.type.ofType.name) {
                renderType(argObj.type.ofType.name);
                return (
                  <TreeItem
                    nodeId={argName}
                    key={idx}
                    label={argName + ': ' + argObj.type.ofType.name}
                  >
                    {renderType(argObj.type.ofType.name)}
                  </TreeItem>
                );
              }
              return (
                <TreeItem
                  nodeId={argName}
                  key={idx}
                  label={argName + ': ' + '*second level or array*'}
                >
                  <span>complex type</span>
                </TreeItem>
              );
            })}
          </TreeItem>
        )}
      </>
    );
  }

  function findType(typeName: string) {
    const result = graphQLTypes.find((type) => {
      return typeName == type.name;
    });
    return result;
  }

  function renderType(type: string | object) {
    if (typeof type == 'string') {
      const typeObj = findType(type);
      return (
        <>
          <TreeItem nodeId={typeObj.name} label={typeObj.description} />
          <hr />
          {/*<TreeItem nodeId={typeObj.kind} label={'kind: ' + typeObj.kind} />*/}
          {typeObj.kind && <Chip label={typeObj.kind} color="success" />}
        </>
      );
    }
    if (typeof type == 'object') {
      return (
        <>
          <TreeItem nodeId={type.name} label={type.name}>
            {type.description && renderData(type.description)}
            <hr />
            {type.kind && <Chip label={type.kind} color="success" />}
            {type.fields && (
              <TreeItem label="Fields" nodeId={type.name + 'FIELDS'}>
                {renderData(type.fields)}
              </TreeItem>
            )}
          </TreeItem>
        </>
      );
    }
    return <span>*exception*</span>;
  }

  function renderData(data: object | string | number): ReactNode {
    if (!data) {
      return <TreeItem nodeId="2" label="*data empty*"></TreeItem>;
    }
    if (typeof data == 'string' || typeof data == 'number') {
      return <TreeItem nodeId={data + 'STRING'} label={data} />;
    }
    if (Array.isArray(data)) {
      console.log(data);
      const render: ReactNode[] = data.map((el) => {
        if (el.name && el.description && el.args) return renderQuery(el);
        if (el.name.includes('__')) return null;
        if (el.name && el.kind) return renderType(el);
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
      <h1>Documentation</h1>
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 400, flexGrow: 1, maxWidth: 800, overflowY: 'auto' }}
      >
        <TreeItem nodeId="queries" label="Queries">
          {renderData(queryNames)}
        </TreeItem>
        <TreeItem nodeId="types" label="Types">
          {renderData(graphQLTypes)}
        </TreeItem>
      </TreeView>
    </div>
  );
};

export default Schema;
