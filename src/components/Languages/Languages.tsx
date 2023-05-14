import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export const Language = () => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') ?? 'en';
  });
  const { t, i18n } = useTranslation();
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="lang">{t('lang.langs')}</InputLabel>
        <Select
          labelId="lang"
          id="lang"
          label="Language"
          defaultValue={language}
          onChange={handleChange}
        >
          <MenuItem value={'en'}>{t('lang.en')}</MenuItem>
          <MenuItem value={'ru'}>{t('lang.ru')}</MenuItem>
          <MenuItem value={'by'}>{t('lang.by')}</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}