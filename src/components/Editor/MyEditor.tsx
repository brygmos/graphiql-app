import React, { useEffect, useRef, useState } from 'react';
import cl from './MyEditor.module.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/mode/javascript/javascript';
import CodeMirror from 'codemirror';

export const Editor = () => {
  const editorRef = useRef(null);
  const [responce, setResponce] = useState('');
  const [query, setQuery] = useState(
    'query AllCharacters {\n' +
      '  characters {\n' +
      '    results {\n' +
      '      name\n' +
      '    }\n' +
      '  }\n' +
      '}'
  );
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setValue(event.target.value);
  };

  useEffect(() => {
    const editor = CodeMirror.fromTextArea(editorRef.current, {
      mode: 'javascript',
      theme: '3024-day',
      lineNumbers: true,
      value: 'qwerty',
      lint: true,
      lineWrapping: true,
      spellcheck: true,
    });
    editor.on('change', (instance) => {
      setQuery(instance.getValue());
    });
  }, []);

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
        setResponce(data);
      });
  };

  const handleClick = (event: React.MouseEvent) => {
    fetchUserData();
  };
  return (
    <>
      <div className={cl.container}>
        <div className={cl.container__left}>
          <div className={cl.editor}>
            <label>Enter your query:</label>
            <textarea ref={editorRef} value={query} />
            <button onClick={handleClick}>SEND</button>
          </div>
        </div>
        <div className={cl.container__right}>
          <div className={cl.responce}>
            {/*{responce.data && <pre>{JSON.stringify(responce, null,2)}</pre>}*/}
            <pre>{responce.data && JSON.stringify(responce, null, 2)}</pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyEditor;
