import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { useState } from 'react';
import { graphql } from 'cm6-graphql';
import { ThemeType } from '../../types/ThemeType';

type Props = {
  theme?: ThemeType;
};

export const QueryEditor: FC<Props> = ({ theme }) => {
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

  return (
    <>
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
          setQuery(value);
        }}
      />
    </>
  );
};

export default QueryEditor;
