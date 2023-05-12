import React, { lazy, useEffect, useState, Suspense, ReactNode } from 'react';
import cl from './Editor.module.css';
import { ImodalTextType } from '../../types/ImodalTextType';
import MyModal from '../MyModal';
import VarsEditor from '../VarsEditor/VarsEditor';
import QueryEditor from '../QueryEditor/QueryEditor';
import { ThemeType } from '../../types/ThemeType';
import ResponseWindow from '../ResponseWindow/ResponseWindow';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import IconButton from '@mui/material/IconButton';
import { SchemaServerResponce } from '../Schema';

export const Editor = () => {
  const [response, setResponse] = useState<string | void | object>();
  const [theme, setTheme] = useState(ThemeType.light);
  const [varsVisibility, setVarsVisibility] = useState(false);
  const [headersVisibility, setHeadersVisibility] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalTextType, setModalTextType] = useState(ImodalTextType.neutral);
  const [vars, setVars] = useState({ page: 1, filter: { name: 'beth' } } as object);
  const [introspectionResponse, setIntrospectionResponse] = useState<unknown>(null);
  // const [introspectionResponse, setIntrospectionResponse] = useState<ReactNode>(null);
  const [varsString, setVarsString] = useState(
    '{\n  "page": 1,\n  "filter": {\n    "name": "beth"\n  }\n}'
  );
  const [query, setQuery] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const prefersDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const schemaQuery =
    'query IntrospectionQuery {    __schema {        queryType {            name        }        types {            name            kind            description            fields {                name                description                args {                    name                    description                    type {                        name                        kind                        ofType {                            name                            kind                        }                    }                }            }        }    }}';

  useEffect(() => {
    prefersDarkMode ? setTheme(ThemeType.dark) : setTheme(ThemeType.light);
  }, [prefersDarkMode]);

  // useEffect(() => {
  //   const ttt = fetchQuery(schemaQuery);
  //   setIntrospectionResponse(ttt as object);
  // }, []);

  const extractQueryName = (query: string) => {
    const text = query;
    const regex = /query\s+(\w+)/;
    const match = text.match(regex);
    if (match) {
      return match[1];
    } else {
      return 'query name not found';
    }
  };

  function setModal(visible: boolean, text: string, type: ImodalTextType) {
    setModalVisibility(visible);
    setModalText(text);
    setModalTextType(type);
  }

  const showModal = () => {
    setModal(true, '', ImodalTextType.neutral);
  };

  const LazySchema = lazy(() => import('../Schema'));

  async function fetchQuery(
    fetchQuery: string = query,
    fetchVars: object = {}
  ): Promise<ReactNode> {
    // ): Promise<string | void | object> {
    setResponse('');
    if (parseError) return;
    const operationName = extractQueryName(fetchQuery);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operationName: operationName,
        query: fetchQuery,
        variables: fetchVars,
      }),
    };
    fetch('https://rickandmortyapi.com/graphql', requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setResponse(data);
        setIntrospectionResponse(data);
        data.errors && setResponseError(data.errors[0].message);
        return data;
      });
  }

  const handleSendClick = () => {
    const res = fetchQuery(query, vars);
    setResponse(res);
  };

  const handleParse = async (varsString: string) => {
    let result;
    try {
      varsString == '' ? (result = {}) : (result = await JSON.parse(varsString));
      setParseError(null);
      setVars(result);
      setVarsString(varsString);
    } catch (error) {
      if (error instanceof Error) {
        setParseError(error.message);
      }
    }
  };

  const showSchemaHandler = async () => {
    const res = await fetchQuery(schemaQuery);
    setIntrospectionResponse(res);
    showModal();
  };

  return (
    <div style={{ color: 'black' }}>
      <>
        {modalVisibility && (
          <MyModal
            visible={modalVisibility}
            modalText={modalText}
            messageType={modalTextType}
            style={{ textAlign: 'left' }}
            setModalVisibility={() => {
              setModalVisibility(false);
            }}
          >
            <Suspense fallback={<CircularProgress color="success" />}>
              <LazySchema data={introspectionResponse as SchemaServerResponce} />
            </Suspense>
          </MyModal>
        )}
      </>
      <div className={cl.container}>
        <div className={cl.container__left}>
          <div className={cl.editor}>
            <QueryEditor
              setQuery={(q) => {
                setQuery(q);
              }}
              theme={theme}
            />
            {varsVisibility && (
              <VarsEditor
                setVarsToParent={(q) => {
                  handleParse(q);
                }}
                theme={theme}
                vars={varsString}
                parseError={parseError}
              />
            )}
            {headersVisibility && (
              <HeadersEditor
                setVarsToParent={(q) => {
                  handleParse(q);
                }}
                theme={theme}
                vars={varsString}
                parseError={parseError}
              />
            )}
            <br />
            <Button
              variant="contained"
              color={'success'}
              // disabled={parseError}
              onClick={handleSendClick}
            >
              Send
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setVarsVisibility(!varsVisibility);
              }}
            >
              Vars
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setHeadersVisibility(!headersVisibility);
              }}
            >
              Headers
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                showSchemaHandler();
              }}
            >
              Schema
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                theme == 'dark' ? setTheme(ThemeType.light) : setTheme(ThemeType.dark);
              }}
              startIcon={<Brightness4Icon />}
            >
              mode
            </Button>
            <IconButton
              onClick={() => {
                theme == 'dark' ? setTheme(ThemeType.light) : setTheme(ThemeType.dark);
              }}
            >
              <Brightness4Icon />
            </IconButton>
          </div>
        </div>
        <div className={cl.container__right}>
          <div className={cl.response}>
            <ResponseWindow
              theme={theme}
              setResponce={(q) => {
                handleParse(q);
              }}
              response={response}
              responseError={responseError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
