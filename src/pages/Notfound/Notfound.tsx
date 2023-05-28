import { Typography } from '@mui/material';
import Image from 'mui-image';
import classes from './Notfound.module.css';
import { useTranslation } from 'react-i18next';

export const Notfound = () => {
    const { t } = useTranslation();
    return (
        <div className={classes.wrap}>
        <Typography align='center' className={classes.title} >
        404
        </Typography>
        <Image className={classes.img} src='src/assets/nf.png' />
        <Typography className={classes.text} color="text.secondary">
        {t('welcome.nf')}
        </Typography>
        </div>
    );
}