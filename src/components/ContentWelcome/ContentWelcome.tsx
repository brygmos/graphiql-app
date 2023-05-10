import { Typography } from '@mui/material';
import Image from 'mui-image';
import classes from './ContentWelcome.module.css';

export const ContentWelcome = () => {
    return (
        <>
          <Image className={classes.img} src='src/assets/ram1.png' />
          <Typography align='center' className={classes.title} >
          Welcome to the request editor for https://rickandmortyapi.com/
          </Typography>
          <Typography className={classes.text} color="text.secondary">
          To use the editor, please log in.
          </Typography>
        </>
    );
}