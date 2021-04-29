import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles(() => ({
  container: {
    alignSelf: 'center',
    display: 'inline-flex',
  },
  alert: {
    flex: 1,
    flexDirection: 'row',
    display: 'inline-flex',
  },
}));

function TelegramGroupPromo() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Alert icon={<InfoIcon />} className={classes.alert} severity='warning'>
        <b>
          Camarilla Pivot Trading Group •{' '}
          <a href='https://t.me/camarillacruisin' target='_blank' rel='noopener noreferrer'>
            Join on Telegram
          </a>
        </b>
      </Alert>
    </div>
  );
}

export default TelegramGroupPromo;
