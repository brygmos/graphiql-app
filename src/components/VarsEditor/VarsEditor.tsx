import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { ThemeType } from '../../types/ThemeType';
import { json } from '@codemirror/lang-json';

type Props = {
  theme?: ThemeType;
  setVarsToParent?: (arg0: string) => void;
  vars?: string;
  parseError?: string | null;
};

export const VarsEditor: FC<Props> = ({ theme, setVarsToParent, vars, parseError }) => {
  const handleChange = (vars: string) => {
    setVarsToParent && setVarsToParent(vars);
  };

  return (
    <div>
      <label style={{ color: 'white' }}>Variables editor:</label>
      {parseError && <span style={{ color: 'brown' }}> {parseError}</span>}
      <CodeMirror
        value={vars}
        height="200px"
        theme={theme}
        extensions={[json()]}
        onChange={(vars) => {
          handleChange(vars);
        }}
      />
    </div>
  );
};

export default VarsEditor;
