import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Language } from '../Languages/Languages';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { removeUser } from '../../store/slices/userSlice';

interface Props {
  window?: () => Window;
}

interface User {
  email: string;
  token: string;
  id: string;
}

interface Store {
  user: User;
}

const drawerWidth = 240;

export const Header = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const user = useSelector((state: Store) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        <ListItem component={Link} to="/" sx={{ textTransform: 'uppercase' }}>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary="Welcome" />
          </ListItemButton>
        </ListItem>
        <ListItem component={Link} to="/editor" sx={{ textTransform: 'uppercase' }}>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary="Editor" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleClick = () => {
    dispatch(removeUser());
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button component={Link} to="/" sx={{ color: '#fff' }}>
                Welcome
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {user.token && (
                <Button component={Link} to="/editor" color="inherit">
                  {t('header.main')}
                </Button>
              )}
              {!user.token && (
                <>
                  <Button component={Link} to="/login" color="inherit">
                    {t('header.login')}
                  </Button>
                  <Button component={Link} to="/registration" color="inherit">
                    {t('header.register')}
                  </Button>
                </>
              )}
              {user.token && (
                <Button component={Link} to="/login" color="inherit" onClick={handleClick}>
                  {t('editor.log')}
                </Button>
              )}
              <Language />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};
