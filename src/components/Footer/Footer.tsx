// import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Image from 'mui-image';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import IconGit from '../Icons/IconGit';

export const Footer = () => {
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
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        >
          <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
            <Link
            href='https://github.com/brygmos'
            underline='hover'
            target='_blank'
            rel='noopener'
            sx={{mr: '15px'}}
            >
              <IconGit /> Daniil Russkikh
            </Link>
            <Link
            href='https://github.com/sashagayko'
            underline='hover'
            target='_blank'
            rel='noopener'
            sx={{mr: '15px'}}
            >
              <IconGit /> Alexandr Gayko
            </Link>
            <Link
            href='https://github.com/ksankakovsh'
            underline='hover'
            target='_blank'
            rel='noopener'
            sx={{mr: '15px'}}
            >
              <IconGit /> Oksana Kovsh
            </Link>
          </Box>
          <Box>
          <Link href='https://rs.school/react/' target='_blank' rel='noopener'>
            <Image src="https://rs.school/images/rs_school_js.svg" />
          </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}