import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { InputLabel } from '@mui/material';

export const Language = () => {
  const [language, setLanguage] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="lang">Language</InputLabel>
        <Select value={language} onChange={handleChange}>
          <MenuItem value={'en'}>English</MenuItem>
          <MenuItem value={'ru'}>Russian</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
