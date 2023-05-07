import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import cl from './Editor.module.css';
import { graphql } from 'cm6-graphql';
import { ImodalTextType } from '../../types/ImodalTextType';
import MyModal from '../MyModal';
import VarsEditor from '../VarsEditor/VarsEditor';
import QueryEditor from '../QueryEditor/QueryEditor';
import { ThemeType } from '../../types/ThemeType';
import { json } from '@codemirror/lang-json';

export const Editor = () => {
  const [response, setResponse] = useState('');
  const [theme, setTheme] = useState(ThemeType.light);
  const [responseError, setResponseError] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [modalText, setModalText] = useState('');
  const [modalTextType, setModalTextType] = useState(ImodalTextType.neutral);
  const [query, setQuery] = useState(
    'query AllCharacters {\n' +
      '  characters {\n' +
      '    results {\n' +
      '      name\n' +
      '    }\n' +
      '  }\n' +
      '}'
  );

  const prefersDarkMode =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  useEffect(() => {
    prefersDarkMode ? setTheme(ThemeType.dark) : setTheme(ThemeType.light);
  }, [prefersDarkMode]);

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
    setModal(true, 'Here will be introspection schema fetch', ImodalTextType.neutral);
  };

  const fetchQuery = () => {
    const operationName = extractQueryName(query);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationName: operationName, query: query }),
    };
    fetch('https://rickandmortyapi.com/graphql', requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setResponse(data);
        data.errors && setResponseError(data.errors[0].message);
      });
  };

  const handleSendClick = () => {
    fetchQuery();
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
            <CodeMirror
              value={
                'query IntrospectionQuery {\n' +
                '    __schema {\n' +
                '        queryType {\n' +
                '            name\n' +
                '        }\n' +
                '        types {\n' +
                '            name\n' +
                '            kind\n' +
                '            description\n' +
                '            fields {\n' +
                '                name\n' +
                '                description\n' +
                '                args {\n' +
                '                    name\n' +
                '                    description\n' +
                '                    type {\n' +
                '                        name\n' +
                '                        kind\n' +
                '                        ofType {\n' +
                '                            name\n' +
                '                            kind\n' +
                '                        }\n' +
                '                    }\n' +
                '                }\n' +
                '            }\n' +
                '        }\n' +
                '    }\n' +
                '}'
              }
              theme={theme}
              autoFocus={true}
              //TODO pass api schema to graphql()
              extensions={[graphql()]}
              // extensions={[javascript({ jsx: true })]}
              onChange={(value) => {
                setQuery(value);
              }}
            />
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
            <VarsEditor theme={theme} />
            <br />
            <button
              style={{ backgroundColor: '#01e001', color: 'white' }}
              onClick={handleSendClick}
            >
              send
            </button>
            <button
              onClick={() => {
                theme == 'dark' ? setTheme(ThemeType.light) : setTheme(ThemeType.dark);
              }}
            >
              change theme
            </button>
            <button
              onClick={() => {
                showModal();
              }}
            >
              show schema
            </button>
          </div>
        </div>
        <div className={cl.container__right}>
          <div className={cl.response}>
            <label style={{ color: 'white' }}>Server response:</label>
            {responseError && <span>{responseError}</span>}
            <CodeMirror
              basicSetup={{ lineNumbers: false }}
              value={JSON.stringify(response, null, 2)}
              height="400px"
              theme={theme}
              readOnly={true}
              placeholder="here will be api response"
              extensions={[json()]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
