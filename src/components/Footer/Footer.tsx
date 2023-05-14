import classes from './Footer.module.css';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Image from 'mui-image';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import IconGit from '../Icons/IconGit';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '25vh',
      }}
    >
      <CssBaseline />
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto'
        }}
      >
        <Container 
        maxWidth="lg"
        className={classes.links__wrap}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          <Box className={classes.links}>
            <Link
            href='https://github.com/brygmos'
            underline='hover'
            target='_blank'
            rel='noopener'
            sx={{mr: '15px'}}
            >
              <IconGit /> {t('footer.danik')}
            </Link>
            <Link
            href='https://github.com/sashagayko'
            underline='hover'
            target='_blank'
            rel='noopener'
            sx={{mr: '15px'}}
            >
              <IconGit /> {t('footer.sasha')}
            </Link>
            <Link
            href='https://github.com/ksankakovsh'
            underline='hover'
            target='_blank'
            rel='noopener'
            sx={{mr: '15px'}}
            >
              <IconGit /> {t('footer.ksanka')}
            </Link>
          </Box>
          <Box>
            <Link href='https://rs.school/react/' target='_blank' rel='noopener'>
              <Image className={classes.img} src="https://rs.school/images/rs_school_js.svg" />
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}