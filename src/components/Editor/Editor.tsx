import React, { lazy, useEffect, useState, Suspense, ReactNode } from 'react';
import cl from './Editor.module.css';
import { useTranslation } from 'react-i18next';
import { ImodalTextType } from '../Modal/ImodalTextType';
import MyModal from '../Modal/MyModal';
import VarsEditor from './VarsEditor/VarsEditor';
import QueryEditor from './QueryEditor/QueryEditor';
import { ThemeType } from '../../types/ThemeType';
import ResponseWindow from './ResponseWindow/ResponseWindow';
import Button from '@mui/material/Button';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import HeadersEditor from '../HeadersEditor/HeadersEditor';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { SchemaServerResponse } from './Schema.types';

type Headers = {
  'Content-Type': string;
  [key: string]: string;
};

const Editor = () => {
  const [response, setResponse] = useState<string | void | object>();
  const { t } = useTranslation();
  const [theme, setTheme] = useState(ThemeType.light);
  const [varsVisibility, setVarsVisibility] = useState(true);
  const [headersVisibility, setHeadersVisibility] = useState(false);
  const [responseError, setResponseError] = useState('');
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalTextType, setModalTextType] = useState(ImodalTextType.neutral);
  const [vars, setVars] = useState({ page: 1, filter: { name: 'beth' } });
  const [introspectionResponse, setIntrospectionResponse] = useState<string | void | object>();
  const varsString = '{\n  "page": 1,\n  "filter": {\n    "name": "beth"\n  }\n}';
  const headersString = '{\n  "Content-Type": "application/json"\n}';
  const [query, setQuery] = useState('');
  const [headers, setHeaders] = useState<Headers>({ 'Content-Type': 'application/json' });
  const [varsParseError, setVarsParseError] = useState<string | null>(null);
  const [headersParseError, setHeadersParseError] = useState<string | null>(null);

  const prefersDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const schemaQuery = `query IntrospectionQuery {
      __schema {
        queryType { name }
        types {
          name
          kind
          description
          fields {
            name
            description
            type { 
              name
              kind
              ofType {
                name
                kind
                ofType { 
                  name
                  kind 
                }
              }
            }
            args {
              name
              description
              type {
                name
                kind
                ofType {
                  name
                  kind
                  ofType {
                    name
                    kind
                    ofType {
                      name
                      kind
                      name
                      kind
                      ofType {
                        name
                        kind
                    }
                    }
                  }
                }
              }
              defaultValue
            }
          }
          inputFields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      }
    }`;

  useEffect(() => {
    prefersDarkMode ? setTheme(ThemeType.dark) : setTheme(ThemeType.light);
  }, [prefersDarkMode]);

  useEffect(() => {
    headers == null ||
    !headers['Content-Type'] ||
    (headers['Content-Type'] && headers['Content-Type'] !== 'application/json')
      ? setHeadersParseError('"Content-Type": "application/json" should be declared')
      : null;
  }, [headers]);

  function extractQueryName(query: string): string {
    const text = query;
    const regex = /query\s+(\w+)/;
    const match = text.match(regex);
    if (match) {
      return match[1];
    } else {
      return 'query name not found';
    }
  }

  function setModal(visible: boolean, text: string, type: ImodalTextType) {
    setModalVisibility(visible);
    setModalText(text);
    setModalTextType(type);
  }

  const showModal = () => {
    setModal(true, '', ImodalTextType.neutral);
  };

  const LazySchema = lazy(() => import('./Schema'));

  async function fetchQuery(
    fetchQuery: string = query,
    fetchVars: object = {},
    fetchHeaders: Headers = headers
  ): Promise<ReactNode> {
    setResponse('');
    if (varsParseError) return;
    const operationName = extractQueryName(fetchQuery);
    const requestOptions = {
      method: 'POST',
      headers: fetchHeaders,
      // headers: { 'Content-Type': 'application/json' },
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
    const res = fetchQuery(query, vars, headers);
    setResponse(res);
  };

  const handleParse = async (string: string) => {
    let result;
    let parseError;
    try {
      string == '' ? (result = null) : (result = await JSON.parse(string));
    } catch (error) {
      if (error instanceof Error) {
        parseError = error.message;
        result = string;
      }
    }
    return [result, parseError];
  };

  const showSchemaHandler = async () => {
    const res: ReactNode = await fetchQuery(schemaQuery);
    setIntrospectionResponse(res as object);
    showModal();
  };

  const throwError = () => {
    throw new Error('This is a test error');
  };

  return (
    <div style={{ color: 'black' }}>
      <Snackbar
        open={!!responseError}
        autoHideDuration={50000}
        onClose={() => {
          setResponseError('');
        }}
      >
        <Alert
          onClose={() => {
            setResponseError('');
          }}
          severity="error"
          sx={{ width: '100%' }}
        >
          {responseError}
        </Alert>
      </Snackbar>
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
              <LazySchema data={introspectionResponse as SchemaServerResponse} />
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
                setVarsToParent={async (q) => {
                  const [result, error] = await handleParse(q);
                  setVarsParseError(error);
                  setVars(result);
                }}
                theme={theme}
                vars={varsString}
                parseError={varsParseError}
              />
            )}
            {headersVisibility && (
              <HeadersEditor
                setVarsToParent={async (q) => {
                  const [result, error] = await handleParse(q);
                  setHeadersParseError(error);
                  setHeaders(result);
                }}
                theme={theme}
                vars={headersString}
                parseError={headersParseError}
              />
            )}
            <br />
            <Button
              variant="contained"
              color={'success'}
              disabled={!!varsParseError || !!headersParseError}
              onClick={handleSendClick}
            >
              {t('editor.send')}
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
          </div>
        </div>
        <div className={cl.container__right}>
          <div className={cl.response}>
            <ResponseWindow
              theme={theme}
              setResponse={(q) => {
                handleParse(q);
              }}
              response={response}
              responseError={responseError}
            />
          </div>
        </div>
      </div>
      <button onClick={throwError}>Throw Error</button>
    </div>
  );
};

export default Editor;
