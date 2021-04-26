import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import MaterialDrawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TelegramIcon from '@material-ui/icons/Telegram';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import BuildIcon from '@material-ui/icons/Build';
import TocIcon from '@material-ui/icons/Toc';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AppsIcon from '@material-ui/icons/Apps';
import DvrIcon from '@material-ui/icons/Dvr';
import Typography from '@material-ui/core/Typography';

export const menuWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {},
  drawer: {
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      width: menuWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar theme.mixins.toolbar
  toolbar: {
    paddingTop: '95px',
  },
  drawerPaper: {
    width: menuWidth,
  },
  title: {
    textAlign: 'center',
    padding: '5px',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Drawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Hidden smDown>
        <Typography variant='h6' className={classes.title}>
          Pivot Screener
        </Typography>
      </Hidden>
      <List>
        <ListItem button onClick={() => console.log('home')}>
          <ListItemIcon>{<HomeIcon />}</ListItemIcon>
          <ListItemText primary='Home (Chart)' />
        </ListItem>
        <ListItem button>
          <ListItemIcon>{<TocIcon />}</ListItemIcon>
          <ListItemText primary='CPR Screeners' />
        </ListItem>
        <ListItem button>
          <ListItemIcon>{<ShowChartIcon />}</ListItemIcon>
          <ListItemText primary='Camarilla Screeners' />
        </ListItem>
      </List>
      <Divider />
      <ListItem button disabled>
        <ListItemIcon>{<DvrIcon />}</ListItemIcon>
        <ListItemText primary='Live Feed' />
      </ListItem>
      <ListItem button disabled>
        <ListItemIcon>{<BuildIcon />}</ListItemIcon>
        <ListItemText primary='Backtest' />
      </ListItem>
      <ListItem button>
        <ListItemIcon>{<AppsIcon />}</ListItemIcon>
        <ListItemText primary='Calculator' />
      </ListItem>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>{<TelegramIcon />}</ListItemIcon>
          <ListItemText primary='Contact (Telegram)' />
        </ListItem>
        <ListItem button>
          <ListItemIcon>{<FavoriteIcon />}</ListItemIcon>
          <ListItemText primary='Donate Crypto' />
        </ListItem>
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label='mailbox folders'>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation='css'>
        <MaterialDrawer
          variant='temporary'
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}>
          {drawer}
        </MaterialDrawer>
      </Hidden>
      <Hidden smDown implementation='css'>
        <MaterialDrawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant='permanent'
          open>
          {drawer}
        </MaterialDrawer>
      </Hidden>
    </nav>
  );
}

export default Drawer;
