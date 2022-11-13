import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import TradingViewPrices from 'components/misc/TradingViewPrices';
import HeaderBG from 'img/headerbg.png';
import Hidden from '@material-ui/core/Hidden';
import { PropTypes } from 'prop-types';

export const headerSafePadding = 100;

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
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
}));

function Header({ onMobileMenuClick }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* App bar */}
      <AppBar position='fixed' className={classes.appBar}>
        <TradingViewPrices responsive />
        <Hidden mdUp>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge='start'
              className={classes.menuButton}
              color='inherit'
              aria-label='menu'
              onClick={onMobileMenuClick}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h5'>Pivot Screener</Typography>
          </Toolbar>
        </Hidden>
      </AppBar>
    </div>
  );
}

Header.defaultProps = {
  onMobileMenuClick: null,
};

Header.propTypes = {
  onMobileMenuClick: PropTypes.func,
};

export default Header;
