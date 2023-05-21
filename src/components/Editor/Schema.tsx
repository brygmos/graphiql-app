import React, { FC, ReactNode } from 'react';
import { Chip, CircularProgress } from '@mui/material';
import TreeView from '@mui/lab/TreeView';
import { TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export type SchemaServerResponse = {
  data: {
    __schema: {
      types: Type[];
    };
  };
};
type Props = {
  data: SchemaServerResponse;
};
type Query = {
  description: string;
  args: [];
};
type ArgObj = {
  name: string;
  description: string;
  type: ArgTypeObj;
};
type ArgTypeObj = {
  name: string | null;
  kind: string | [];
  ofType: ArgNameTypeObj;
};
type ArgNameTypeObj = {
  name: string | null;
  kind: string | null | [];
};
type Type = {
  name: string;
  description: string;
  kind: string | [];
  fields: Field[];
};
type Field = {
  name: string;
  description: string;
  args: ArgObj[];
};

const Schema: FC<Props> = ({ data }) => {
  if (!data) {
    return (
      <>
        <h1>Fetching data...</h1>
        <CircularProgress color="success" />
      </>
    );
  }

  const queryNames: Field[] = data.data.__schema.types[0].fields;
  const graphQLTypes: Type[] = data.data.__schema.types;

  function renderQuery(data: object) {
    return Object.entries(data).map(([key, value]) => (
      <div key={key}>
        {key == 'name' && (
          <TreeItem nodeId={value} label={value}>
            {renderExpandedQuery(data as Query)}
          </TreeItem>
        )}
      </div>
    ));
  }

  function renderExpandedQuery(data: Query) {
    return (
      <div key={data.description}>
        <TreeItem
          nodeId={data.description}
          label={'*' + data.description + '*'}
          key={data.description + 'descr'}
        />
        {data.args.length > 0 && (
          <TreeItem nodeId={data.description} label="arguments" key={data.description}>
            {data.args.map((argObj: ArgObj, idx) => {
              const argName = argObj.name;
              if (argObj.type.name) {
                return (
                  <TreeItem
                    nodeId={argObj.type.name}
                    key={idx + 'ghgggg'}
                    label={argName + ':: ' + argObj.type.name}
                  >
                    {renderType(argObj.type.name)}
                  </TreeItem>
                );
              }
              if (argObj.type.ofType.name) {
                renderType(argObj.type.ofType.name);
                return (
                  <TreeItem
                    nodeId={argObj.type.ofType.name}
                    key={argObj.type.ofType.name}
                    label={argName + ': ' + argObj.type.ofType.name}
                  >
                    {renderType(argObj.type.ofType.name)}
                  </TreeItem>
                );
              }
              if (argObj.type.kind) {
                return (
                  <div key={idx}>
                    {argObj.type.kind && <Chip label={argObj.type.kind} color="success" />}
                    <br />
                    {argObj.type.ofType.kind && (
                      <Chip label={argObj.type.ofType.kind} color="success" />
                    )}
                  </div>
                );
              }
            })}
          </TreeItem>
        )}
      </div>
    );
  }

  function findType(typeName: string) {
    return graphQLTypes.find((type) => {
      return typeName == type.name;
    });
  }

  function renderType(type: Type | string) {
    if (typeof type == 'string') {
      const typeObj: Type | undefined = findType(type as string);
      if (typeObj)
        return (
          <>
            <TreeItem
              nodeId={typeObj.description}
              label={typeObj.description}
              key={typeObj.description}
            />
            {typeObj.kind && <Chip label={typeObj.kind} color="success" />}
            <hr />
          </>
        );
    }
    if (typeof type == 'object') {
      return (
        <TreeItem nodeId={type.name} label={type.name}>
          {type.description && renderData(type.description)}
          {type.kind && <Chip label={type.kind} color="success" />}
          {type.fields && (
            <TreeItem label="Fields" nodeId={type.name + 'FIELDS'}>
              {renderData(type.fields)}
            </TreeItem>
          )}
          <hr />
        </TreeItem>
      );
    }
    return <span>*exception*</span>;
  }

  function renderData(
    data: string | ArgObj | Type | Type[] | ArgNameTypeObj | Field | Field[]
  ): ReactNode {
    if (!data) {
      return <TreeItem nodeId="nodata" label="*data empty*"></TreeItem>;
    }
    if (typeof data == 'string') {
      return <TreeItem nodeId={data + 'STRING'} label={data} key={data} />;
    }

    if (Array.isArray(data)) {
      const render: ReactNode[] = data.map((el) => {
        if ('args' in el) {
          if (el.name && el.description && el.args && el.args.length > 0) return renderQuery(el);
          if (el.name && el.description == '' && el.args && el.args.length == 0)
            return <TreeItem nodeId={el.name} key={el.name} />;
          if (el.name && el.description && el.args) return renderQuery(el);
        }
        if ('kind' in el) {
          if (el.name.includes('__')) return;
          if (el.name && el.kind) return <div key={el.name}>{renderType(el)}</div>;
          return renderData(el);
        }
      });
      return render as ReactNode;
    }

    if (typeof data == 'object' && !Array.isArray(data)) {
      if ('kind' in data && 'description' in data) {
        if (data.name && data.description && data.kind && data.kind.length > 0)
          return renderQuery(data);
      }
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
        defaultCollapseIcon={<ExpandMoreIcon color="action" />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 400, flexGrow: 1, width: 800, overflowY: 'auto' }}
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
