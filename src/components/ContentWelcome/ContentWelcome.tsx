import { Typography } from '@mui/material';
import Image from 'mui-image';
import classes from './ContentWelcome.module.css';
import { useTranslation } from 'react-i18next';

export const ContentWelcome = () => {
  const { t } = useTranslation();
  return (
    <>
      <Image className={classes.img} src="src/assets/ram1.png" />
      <Typography align="center" className={classes.title}>
        {t('welcome.welcome')} https://rickandmortyapi.com/
      </Typography>
      <Typography className={classes.text} color="text.secondary">
        {t('welcome.toUse')}
      </Typography>
      <br />
      <Typography className={classes.text} color="text.secondary">
        {t('welcome.aboutCourse')}
      </Typography>
    </>
  );
};
