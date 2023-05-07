import { Typography } from '@mui/material';
import Image from 'mui-image';
import classes from './ContentWelcome.module.css';

export const ContentWelcome = () => {
    return (
        <>
        <Image className={classes.img} src='src/assets/ram.png' />
        <Typography align='center' variant="h4" component="div">
          Welcome to the request editor for<br/> https://rickandmortyapi.com/
          </Typography>
          <Typography variant="body2" className={classes.text} color="text.secondary">
          To use the editor, please log in.
          </Typography>
        </>
    );
}