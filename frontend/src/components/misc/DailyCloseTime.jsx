import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    alignSelf: 'center',
    marginBottom: theme.spacing(3),
    flexGrow: 1,
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'center',
  },
}));

const getDailyClose = (exchange) => {
  let time;

  switch (exchange) {
    case 'binance':
      time = moment();
      break;
    case 'huobi':
      time = moment().utcOffset(5);
      break;
    default:
      return '...';
  }

  const dif = time.endOf('day').diff(moment());
  return moment(dif).format('HH:mm:ss');
};

export default function DailyCloseTime() {
  const classes = useStyles();

  const [binanceTimeleft, setBinanceTimeleft] = useState(getDailyClose('binance'));
  const [huobiTimeleft, SetHuobiTimeleft] = useState(getDailyClose('huobi'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setBinanceTimeleft(getDailyClose('binance'));
      SetHuobiTimeleft(getDailyClose('huobi'));
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className={classes.root}>
      <Grid container spacing={4} className={classes.grid}>
        <Grid item>
          Binance Daily Close
          <Grid item>{binanceTimeleft.toString()}</Grid>
        </Grid>
        <Grid item>
          Huobi Daily Close
          <Grid item>{huobiTimeleft.toString()}</Grid>
        </Grid>
      </Grid>
    </div>
  );
}
