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
  ArgNameTypeObj,
  Type,
  ArgTypeObj,
  DataType,
  Query,
  DataVariant,
  inputField,
  Field,
  Props,
  SchemaServerResponse,
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
                    key={idx + argName}
                    label={
                      <span>
                        {argName} ::{' '}
                        <Link
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTypeClick(argObj.type.name as string);
                          }}
                        >
                          {argObj.type.name}
                        </Link>
                      </span>
                    }
                  >
                    {renderData(argObj.type.name, 'string')}
                  </TreeItem>
                );
              }
              if (argObj.type.kind) {
                return (
                  <div key={idx}>
                    {argObj.type.ofType.name && renderData(argObj.type.ofType.name, 'string')}
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

  function renderData(data: DataType, dataVariant: DataVariant): ReactNode {
    if (!data) {
      return <TreeItem nodeId="nodata" label="*empty data*"></TreeItem>;
    }
    // if (typeof data == 'string') {
    //   return <TreeItem nodeId={data + 'STRING'} label={data} key={data} />;
    // }

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
        if (dataVariant == ('queryArr' || 'fieldArr')) {
          el = el as Query;
          return renderData(el, 'field');
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
        <div key={key}>
          {key == 'name' && (
            <TreeItem nodeId={value} label={value}>
              {renderExpandedQuery(data as Query)}
            </TreeItem>
          )}
        </div>
      ));
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
            <hr />
          </>
        );
    }
    if (dataVariant == 'type') {
      const type = data as Type;
      if (type.type.name) {
        return (
          <TreeItem
            nodeId={type.type.name}
            key={type.type.name + type.name}
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
          ></TreeItem>
        );
      }
      return (
        <TreeItem nodeId={type.name} label={type.name + ' :,,: ' + type.type.name}>
          {type.description && renderData(type.description, 'string')}
          {type.kind && <Chip label={type.kind} color="success" />}
          {type.fields && (
            <TreeItem label="Fields" nodeId={type.name + 'FIELDS'}>
              {renderData(type.fields, 'fieldArr')}
            </TreeItem>
          )}
          <hr />
        </TreeItem>
      );
    }
  }

  return (
    <div style={{ color: 'white' }}>
      <Typography variant="h2" textAlign="center">
        Documentation
      </Typography>
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
