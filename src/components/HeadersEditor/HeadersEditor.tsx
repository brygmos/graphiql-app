import React, { FC } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { ThemeType } from '../../types/ThemeType';
import { json } from '@codemirror/lang-json';
import { Alert } from '@mui/material';

type Props = {
  theme?: ThemeType;
  setVarsToParent?: (arg0: string) => void;
  vars?: string;
  parseError?: string | null;
};

export const HeadersEditor: FC<Props> = ({ theme, setVarsToParent, vars, parseError }) => {
  const handleChange = (vars: string) => {
    setVarsToParent && setVarsToParent(vars);
  };

  return (
    <div>
      <label style={{ color: 'white' }}>Headers editor:</label>
      {/*{parseError && <span style={{ color: 'brown' }}> {parseError}</span>}*/}
      {parseError && (
        <Alert icon={false} severity="error">
          {parseError}
        </Alert>
      )}
      <CodeMirror
        value={vars}
        height="200px"
        theme={theme}
        extensions={[json()]}
        onChange={(vars) => {
          handleChange(vars);
          console.log(vars);
        }}
      />
    </div>
  );
};

export default HeadersEditor;
