import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer, { menuWidth } from 'components/layout/Drawer';
import Header, { headerSafePadding } from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import Paper from '@material-ui/core/Paper';
import TelegramGroupPromo from 'components/misc/TelegramGroupPromo';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',

    flexDirection: 'column',
  },
  content: {
    paddingTop: headerSafePadding,
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      paddingLeft: menuWidth,
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: '-5px',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: '-15px',
    },
  },
  paperContent: {
    display: 'flex',
    boxShadow: '0 12px 12px -6px rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    minHeight: '500px',
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    height: '100%',
  },
}));

function MainLayout({ Content }) {
  const classes = useStyles();
  const drawerRef = React.createRef();

  function onMobileMenuClick() {
    if (drawerRef.current) drawerRef.current.toggle();
  }

  return (
    <div className={classes.root}>
      <Header onMobileMenuClick={onMobileMenuClick} />
      <Drawer ref={drawerRef} />
      <main className={classes.content}>
        <TelegramGroupPromo />
        {/* Content container */}
        <Paper elevation={0} className={classes.paperContent}>
          <Content />
        </Paper>
      </main>
      <Footer />
    </div>
  );
}

MainLayout.propTypes = {
  Content: PropTypes.elementType.isRequired,
};

export default MainLayout;
