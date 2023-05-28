import React, { FC, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { ThemeType } from '../../../types/ThemeType';
import { json } from '@codemirror/lang-json';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Button from '@mui/material/Button';

import { useTranslation } from 'react-i18next';

type Props = {
  theme?: ThemeType;
  setResponse?: (arg0: string) => void;
  response?: string | void | object;
  responseError?: string;
};

export const ResponseWindow: FC<Props> = ({ theme, response }) => {
  const { t } = useTranslation();
  const [copyButtonText, setCopyButtonText] = useState(t('editor.copy') as string);

  useEffect(() => {
    setCopyButtonText(t('editor.copy') as string);
  }, [response, t]);

  const copyHandler = () => {
    response && navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopyButtonText(t('editor.copied') as string);
  };

  return (
    <div style={{ color: 'black' }}>
      <label style={{ color: 'white' }}>{t('editor.queryServ')}</label>
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
