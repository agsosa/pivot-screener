import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import TradingViewPrices from 'material/components/misc/TradingViewPrices';
import HeaderBG from 'img/headerbg.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    gap: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
  appBar: {
    padding: '5px',
    backgroundImage: `url(${HeaderBG})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  menuButton: {
    position: 'absolute',
    left: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  title: { [theme.breakpoints.up('sm')]: { marginLeft: '10px' } },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* App bar */}
      <AppBar position='static' className={classes.appBar}>
        {/* TV prices widget */}
        <TradingViewPrices responsive />
        <Toolbar className={classes.toolbar}>
          <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
            <MenuIcon />
          </IconButton>
          <Typography variant='h5' className={classes.title}>
            Pivot Screener
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
