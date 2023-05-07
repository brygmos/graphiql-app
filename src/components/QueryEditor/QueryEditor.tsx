import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';
import { graphql } from 'cm6-graphql';
import { ThemeType } from '../../types/ThemeType';

type Props = {
  theme?: ThemeType;
  setQuery?: (arg0: string) => void;
};

export const QueryEditor: FC<Props> = ({ theme, setQuery }) => {
  const [query, setQQQuery] = useState(
    'query AllCharacters {\n' +
      '  characters {\n' +
      '    results {\n' +
      '      name\n' +
      '    }\n' +
      '  }\n' +
      '}'
  );

  const passToParent = () => {
    setQuery && setQuery(query);
  };

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

  return (
    <div
      onBlur={() => {
        passToParent();
      }}
    >
      <label style={{ color: 'white' }}>Query editor:</label>
      <CodeMirror
        value={query}
        height="200px"
        theme={theme}
        autoFocus={true}
        //TODO pass api schema to graphql()
        extensions={[graphql()]}
        // extensions={[javascript({ jsx: true })]}
        onChange={(value) => {
          setQQQuery(value);
          setQuery && setQuery(value);
        }}
      />
    </div>
  );
};

export default QueryEditor;
