import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { menuWidth } from 'components/layout/Drawer';
import DailyCloseTime from 'components/misc/DailyCloseTime';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      paddingLeft: menuWidth,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px 0px',
    height: '100%',
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
  },
}));

const year = new Date().getFullYear();

function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <div className={classes.textContainer}>
          <DailyCloseTime />
          <Typography variant='overline'>Disclaimer</Typography>

          <Typography variant='caption'>
            The information provided on this website does not constitute Investment or trading advice. The sole purpose
            of this website is informational and/or Educational. <br />
            PivotScreener.com is not responsible for any misuse of the information presented on this website.
            <br />
            <br />
            Pivot Screener © {year}
          </Typography>
        </div>
      </main>
    </div>
  );
}

export default Footer;
