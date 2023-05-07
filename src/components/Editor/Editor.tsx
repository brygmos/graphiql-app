import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';
import cl from './Editor.module.css';
import { graphql } from 'cm6-graphql';
import { ImodalTextType } from '../../types/ImodalTextType';
import MyModal from '../MyModal';

export const Editor = () => {
  const [response, setResponse] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
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
    prefersDarkMode ? setTheme('dark') : setTheme('light');
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

  const fetchUserData = () => {
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
      });
  };

  const handleClick = () => {
    fetchUserData();
  };

  return (
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
            // width={'50%'}
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
      <div className={cl.container}>
        <div className={cl.container__left}>
          <div className={cl.editor}>
            <label style={{ color: 'white' }}>Query Editor:</label>
            <CodeMirror
              value={query}
              height="200px"
              theme={theme}
              autoFocus={true}
              //TODO pass api schema to graphql()
              extensions={[graphql()]}
              // extensions={[javascript({ jsx: true })]}
              onChange={(value) => {
                setQuery(value);
              }}
            />
            <label style={{ color: 'white' }}>Variables Editor:</label>
            <CodeMirror
              value={'{\n\t"page": 1\n}'}
              height="200px"
              theme={theme}
              autoFocus={true}
              extensions={[graphql()]}
              // extensions={[javascript({ jsx: true })]}
              onChange={(value) => {
                setQuery(value);
              }}
            />
            <br />
            <button onClick={handleClick}>SEND</button>
            <button
              onClick={() => {
                theme == 'dark' ? setTheme('light') : setTheme('dark');
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
            <CodeMirror
              basicSetup={{ lineNumbers: false }}
              value={JSON.stringify(response, null, 2)}
              height="400px"
              theme={theme}
              readOnly={true}
              placeholder="here will be api response"
              extensions={[javascript({ jsx: true })]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
