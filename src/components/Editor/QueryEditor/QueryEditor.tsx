import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';
import { graphql } from 'cm6-graphql';
import { ThemeType } from '../../../types/ThemeType';
import { useTranslation } from 'react-i18next';

type Props = {
  theme?: ThemeType;
  setQuery?: (arg0: string) => void;
};

export const QueryEditor: FC<Props> = ({ theme, setQuery }) => {
  const [query, setQQQuery] = useState(
    'query AllCharacters($page: Int, $filter: FilterCharacter) {\n' +
      '  characters(page: $page, filter: $filter) {\n' +
      '    results {\n' +
      '      name\n' +
      '    }\n' +
      '  }\n' +
      '}'
  );
  const { t } = useTranslation();

  const passToParent = () => {
    setQuery && setQuery(query);
  };

  return (
    <div
      onBlur={() => {
        passToParent();
      }}
    >
      {/*<label style={{ color: 'white' }}>Query editor:</label>*/}
      <label style={{ color: 'white' }}>{t('editor.query')}</label>
      <CodeMirror
        value={query}
        height="400px"
        theme={theme}
        autoFocus={true}
        //TODO pass api schema to graphql()
        extensions={[graphql()]}
        onChange={(value) => {
          setQQQuery(value);
          setQuery && setQuery(value);
        }}
      />
    </div>
  );
};

export default QueryEditor;
