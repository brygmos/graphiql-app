import React, { FC, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { useState } from 'react';
import { ThemeType } from '../../types/ThemeType';
import { json } from '@codemirror/lang-json';

type Props = {
  theme?: ThemeType;
  setVarsToParent?: (arg0: object) => void;
};

export const VarsEditor: FC<Props> = ({ theme, setVarsToParent }) => {
  const [vars, setVars] = useState('{\n  "page": 1,\n  "filter": {\n    "name": "beth"\n  }\n}');
  const [parsedVars, setParsedVars] = useState(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleParse = async () => {
    try {
      const result = await JSON.parse(vars);
      setParsedVars(result);
      setParseError(null);
      setVarsToParent && setVarsToParent(result);
    } catch (error) {
      setParsedVars(null);
      if (error instanceof Error) {
        setParseError(error.message);
      }
    }
  };

  useEffect(() => {
    handleParse();
  }, []);

  return (
    <div
      onBlur={() => {
        handleParse();
      }}
    >
      {/*{parsedVars && <pre>{JSON.stringify(parsedVars, null, 2)}</pre>}*/}
      <label style={{ color: 'white' }}>Variables editor:</label>
      {parseError && <span style={{ color: 'brown' }}> {parseError}</span>}
      <CodeMirror
        value={vars}
        height="200px"
        theme={theme}
        extensions={[json()]}
        // extensions={[javascript({ jsx: true })]}
        onChange={(vars) => {
          setVars(vars);
        }}
      />
    </div>
  );
};

export default VarsEditor;
