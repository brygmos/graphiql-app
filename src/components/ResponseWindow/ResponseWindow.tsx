import React, { FC, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { ThemeType } from '../../types/ThemeType';
import { json } from '@codemirror/lang-json';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Button from '@mui/material/Button';

type Props = {
  theme?: ThemeType;
  setResponce?: (arg0: string) => void;
  response?: string | void | object;
  responseError?: string;
};

export const ResponseWindow: FC<Props> = ({ theme, response, responseError }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  useEffect(() => {
    setCopyButtonText('Copy');
  }, [response]);

  const copyHandler = () => {
    response && navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopyButtonText('Copied');
  };

  return (
    <div style={{ color: 'black' }}>
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
      <br />
      <Button
        onClick={() => {
          copyHandler();
        }}
        variant="contained"
        startIcon={<FileCopyIcon />}
      >
        {copyButtonText}
      </Button>
    </div>
  );
};

export default ResponseWindow;
