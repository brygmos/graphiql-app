import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';
import cl from './Editor.module.css';
import { useTranslation } from 'react-i18next';

export const Editor = () => {
  const [response, setResponse] = useState('');
  const { t } = useTranslation();
  const [query, setQuery] = useState(
    'query AllCharacters {\n' +
      '  characters {\n' +
      '    results {\n' +
      '      name\n' +
      '    }\n' +
      '  }\n' +
      '}'
  );

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
      <div className={cl.container}>
        <div className={cl.container__left}>
          <div className={cl.editor}>
            <label style={{ color: 'white' }}>{t('editor.query')}</label>
            <CodeMirror
              value={query}
              height="200px"
              theme={'light'}
              autoFocus={true}
              extensions={[javascript({ jsx: true })]}
              onChange={(value) => {
                setQuery(value);
              }}
            />
            <button onClick={handleClick}>{t('editor.send')}</button>
          </div>
        </div>
        <div className={cl.container__right}>
          <div className={cl.response}>
            <CodeMirror
              basicSetup={{ lineNumbers: false }}
              value={JSON.stringify(response, null, 2)}
              height="400px"
              readOnly={true}
              style={{ overflowY: 'scroll' }}
              placeholder="here will be api response"
              theme={'light'}
              extensions={[javascript({ jsx: true })]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Editor;
