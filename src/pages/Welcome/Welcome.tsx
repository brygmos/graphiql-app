
import { Container } from '@mui/material';
import { ContentWelcome } from '../../components/ContentWelcome/ContentWelcome';

export const Welcome = () => {
  return (
    <Container component="main"  sx={{minHeight: '80vh', marginTop: '90px'}}>
      <ContentWelcome />
    </Container>
  );
};
