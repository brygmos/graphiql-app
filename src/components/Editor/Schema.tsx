import React, { FC, ReactNode, useState } from 'react';
import { Chip, CircularProgress, Link, Paper } from '@mui/material';
import TreeView from '@mui/lab/TreeView';
import { TreeItem } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  ArgObj,
  Type,
  DataType,
  Query,
  DataVariant,
  inputField,
  Field,
  Props,
} from './Schema.types';

const Schema: FC<Props> = ({ data }) => {
  const [firstTypeVisibility, setFirstTypeVisibility] = useState(false);
  const [secondTypeVisibility, setSecondTypeVisibility] = useState(false);
  const [firstTypeActive, setFirstTypeActive] = useState<string>();
  const [secondTypeActive, setSecondTypeActive] = useState<string>();

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

  function handleTypeClick(typeName: string) {
    if (typeName == firstTypeActive) {
      setFirstTypeVisibility(false);
      setFirstTypeActive(undefined);
    } else if (typeName == secondTypeActive) {
      setSecondTypeVisibility(false);
      setSecondTypeActive(undefined);
    } else {
      if (firstTypeVisibility) {
        setSecondTypeVisibility(true);
        setSecondTypeActive(typeName);
      } else if (secondTypeVisibility) {
        setFirstTypeVisibility(true);
        setFirstTypeActive(typeName);
      } else {
        setFirstTypeVisibility(true);
        setFirstTypeActive(typeName);
      }
    }
  }

  function isNonNullType(argObj: ArgObj) {
    if (argObj.type.kind) return argObj.type.kind == 'NON_NULL';
    if (argObj.type.ofType.kind) return argObj.type.ofType.kind == 'NON_NULL';
    return false;
  }
  function isList(argObj: ArgObj) {
    return (
      argObj.type.kind == 'LIST' ||
      argObj.type.ofType?.kind == 'LIST' ||
      argObj.type.ofType?.ofType?.kind == 'LIST' ||
      argObj.type.ofType?.ofType?.ofType?.kind == 'LIST'
    );
  }

  function renderLinkToType(typeText: string, typeName: string = typeText) {
    return (
      <Link
        color="primary"
        onClick={(e) => {
          e.stopPropagation();
          handleTypeClick(typeName as string);
        }}
      >
        {typeText}
      </Link>
    );
  }

  function renderExpandedQuery(data: Query) {
    let typeName: string;
    if (data.type.name != null) typeName = data.type.name;
    else typeName = data.type.ofType.name || '';
    let typeText: string = typeName;
    if (isNonNullType(data as ArgObj)) typeText = typeName + '!';
    if ((data.type.kind = 'LIST')) typeText = '[' + typeText + ']';

    return (
      <div key={data.description}>
        <TreeItem
          nodeId={data.description + 'descrr'}
          label={'*' + data.description + '*'}
          key={data.description + 'descr'}
        />
        {data.type.name && (
          <TreeItem
            nodeId={data.description + 'type'}
            label={<span>Type :H: {renderLinkToType(data.type.name)}</span>}
            key={data.description}
          />
        )}
        {!data.type.name && data.type.ofType.name && (
          <TreeItem
            nodeId={data.description + 'typelink'}
            // label={<span>Type :HH: {renderLinkToType(data.type.ofType.name as string)}</span>}
            label={<span>Type :HH: {renderLinkToType(typeText, typeName as string)}</span>}
            key={data.description}
          />
        )}
        {data.args && (
          <TreeItem
            nodeId={data.description + 'aargs'}
            label="arguments"
            key={data.description + 'ARGS'}
          >
            {renderData(data.args, 'argObjArr')}
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

  function renderData(data: DataType, dataVariant: DataVariant): ReactNode {
    if (!data) {
      return <TreeItem nodeId="nodata" label="*empty data*"></TreeItem>;
    }

    if (Array.isArray(data)) {
      const render: ReactNode[] = data.map((el) => {
        if (el.name.includes('__')) return;
        if (dataVariant == 'typeArr') {
          el = el as Type;
          return <div key={el.name}>{renderData(el, 'type')}</div>;
        }
        if (dataVariant == 'inputFieldArr') {
          el = el as inputField;
          return renderData(el, 'inputField');
        }
        if (dataVariant == 'queryArr') {
          el = el as Query;
          return renderData(el, 'query');
        }
        if (dataVariant == 'fieldArr') {
          el = el as Query;
          return renderData(el, 'field');
        }
        if (dataVariant == 'argObjArr') {
          el = el as ArgObj;
          return <div key={el.name + 'sss'}>{renderData(el, 'argObj')}</div>;
        }
      });
      return render as ReactNode;
    }

    if (dataVariant == 'inputField') {
      data = data as inputField;
      return renderData(data, 'type');
    }
    if (dataVariant == 'field') {
      return Object.entries(data).map(([key, value]) => (
        <div key={key}>{key == 'name' && <TreeItem nodeId={value} label={value}></TreeItem>}</div>
      ));
    }
    if (dataVariant == 'query') {
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
    if (dataVariant == 'argObj') {
      data = data as ArgObj;

      let typeName: string | null;
      if (data.type.name != null) typeName = data.type.name;
      else if (data.type.ofType.name != null) typeName = data.type.ofType.name;
      else if (data.type.ofType.ofType.name != null) typeName = data.type.ofType.ofType.name;
      else typeName = data.type.ofType.ofType.ofType?.name;

      let typeText: string | null = typeName;
      if (isNonNullType(data as ArgObj)) typeText = typeName + '!';
      if (isList(data as ArgObj)) typeText = '[' + typeText + ']';
      return (
        <TreeItem
          label={
            <span>
              {data.name} :I:{' '}
              {typeText && <span>{renderLinkToType(typeText, typeName as string)}</span>}
            </span>
          }
          nodeId={data.name + 'FIELDS'}
        />
      );
    }
    if (dataVariant == 'typeByString') {
      const typeObj: Type | undefined = findType(data as string);
      if (typeObj)
        return (
          <>
            <TreeItem
              nodeId={typeObj.description}
              label={typeObj.description}
              key={typeObj.description}
            />
            {typeObj.kind && <Chip label={typeObj.kind} color="success" />}
            {typeObj.inputFields && (
              <TreeItem label="Fields" nodeId={typeObj.name + 'FIELDS'}>
                {renderData(typeObj.inputFields, 'inputFieldArr')}
              </TreeItem>
            )}
            {typeObj.fields && (
              <TreeItem label="Fields" nodeId={typeObj.name + 'FIELDSss'}>
                {renderData(typeObj.fields, 'inputFieldArr')}
              </TreeItem>
            )}
            <hr />
          </>
        );
    }
    if (dataVariant == 'type') {
      const type = data as Query;
      if (type.type.name) {
        return (
          <TreeItem
            nodeId={type.description + type.type.name}
            key={type.name + type.type.name}
            label={
              <span>
                {type.name} :--:{' '}
                <Link
                  color="primary"
                  onClick={() => {
                    handleTypeClick(type.type.name as string);
                  }}
                >
                  {type.type.name}
                </Link>
              </span>
            }
          >
            {type.description && <span>{type.description}</span>}
          </TreeItem>
        );
      }
    }
  }

  return (
    <div style={{ color: 'white' }}>
      <h2 style={{ textAlign: 'center' }}>Documentation</h2>
      <Grid container spacing={2} alignItems="center" alignSelf="center">
        <Grid xs={4} minWidth="250px" flexGrow={1}>
          <Paper>
            <Typography variant="h4" textAlign="center">
              Queries
            </Typography>
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon color="action" />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ height: 400, flexGrow: 1, overflowY: 'auto' }}
            >
              {renderData(queryNames, 'queryArr')}
            </TreeView>
          </Paper>
        </Grid>
        <Grid xs={4} minWidth="250px" hidden={!firstTypeVisibility}>
          <Paper>
            <Typography variant="h4" textAlign="center">
              {firstTypeActive}
            </Typography>
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon color="action" />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ height: 400, flexGrow: 1, overflowY: 'auto' }}
            >
              {firstTypeActive && renderData(firstTypeActive, 'typeByString')}
            </TreeView>
          </Paper>
        </Grid>
        <Grid xs={4} minWidth="250px" hidden={!secondTypeActive}>
          <Paper>
            <Typography variant="h4" textAlign="center">
              {secondTypeActive}
            </Typography>
            <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon color="action" />}
              defaultExpandIcon={<ChevronRightIcon />}
              sx={{ height: 400, flexGrow: 1, overflowY: 'auto' }}
            >
              {secondTypeActive && renderData(secondTypeActive, 'typeByString')}
            </TreeView>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Schema;
