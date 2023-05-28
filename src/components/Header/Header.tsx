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
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

export const Header = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { t } = useTranslation();
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const { scrollY } = useScroll();
  const bgColors = ['#1976d2', '#094887'];
  const offsetY = [0, 100];
  const bgColor = useTransform(scrollY, offsetY, bgColors);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        <ListItem component={Link} to="/" sx={{ textTransform: 'uppercase' }}>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary={t('header.main')} />
          </ListItemButton>
        </ListItem>
        <ListItem component={Link} to="/editor" sx={{ textTransform: 'uppercase' }}>
          <ListItemButton sx={{ textAlign: 'center' }}>
            <ListItemText primary={t('header.editor')} />
          </ListItemButton>
        </ListItem>
        <Button component={Link} to="/login" color="inherit">
              {t('header.in')}
        </Button>
        <Button component={Link} to="/registration" color="inherit">
              {t('header.up')}
        </Button>
     
      </List>
      <Divider />
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <motion.div style={{
            backgroundColor: bgColor,
          }}>
        <AppBar component="nav" sx={{backgroundColor: 'inherit'}}>
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
              justifyContent: 'space-around',
              width: '100%',
              alignItems: 'center',
            }}
          >
            
            <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
              <Language />
              <Button component={Link} to="/" sx={{ color: '#fff' }}>
              {t('header.main')}
              </Button>
              <Button component={Link} to="/editor" sx={{ color: '#fff' }}>
                {t('header.editor')}
              </Button>
              
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button component={Link} to="/login" sx={{ display: { xs: 'none', sm: 'block' } }} color="inherit">
              {t('header.in')}
              </Button>
              <Button component={Link} sx={{ display: { xs: 'none', sm: 'block' } }} to="/registration" color="inherit">
              {t('header.up')}
              </Button>
              
            </Box>
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Language />
            </Box>
            
        </Toolbar>
      </AppBar>
      </motion.div>
      
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
