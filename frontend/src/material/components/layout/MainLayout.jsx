import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialDrawer, { menuWidth } from 'material/components/layout/Drawer';
import Header from 'material/components/layout/Header';
import Footer from 'material/components/layout/Footer';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from 'material/components/layout/Breadcrumbs';
import TelegramGroupPromo from 'material/components/misc/TelegramGroupPromo';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  alert: {
    marginBottom: theme.spacing(3),
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    display: 'inline-flex',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    marginTop: theme.spacing(3),
    height: '100%',
    [theme.breakpoints.up('md')]: {
      paddingLeft: menuWidth,
    },
  },
  paperContent: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    gap: theme.spacing(3),
    padding: theme.spacing(3),
    height: '100%',
  },
}));

function MainLayout({ Content }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <MaterialDrawer />
      <main className={classes.content}>
        <TelegramGroupPromo />
        {/* Content container */}
        <Paper elevation={0} className={classes.paperContent}>
          <Breadcrumbs items={['asd', 'lol']} />
          <Content />
        </Paper>
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
