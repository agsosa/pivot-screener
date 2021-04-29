import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  card: { padding: '10px 0px' },
  cardsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    display: 'flex',
  },
  cardsColumn: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export function StatsCardItem({ prefix, label, count }) {
  const classes = useStyles();

  return (
    <Card className={classes.card} variant='outlined'>
      <CardContent>
        <Typography color='textSecondary' gutterBottom>
          {label}
        </Typography>
        <Typography variant='h5'>
          {prefix}
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function StatsCardContainer({ children }) {
  const classes = useStyles();

  return <div className={classes.cardsContainer}>{children}</div>;
}

export function StatsCardColumn({ children }) {
  const classes = useStyles();

  return <div className={classes.cardsColumn}>{children}</div>;
}

StatsCardContainer.defaultProps = {
  children: null,
};

StatsCardContainer.propTypes = {
  children: PropTypes.node,
};

StatsCardColumn.defaultProps = {
  children: null,
};

StatsCardColumn.propTypes = {
  children: PropTypes.node,
};

StatsCardItem.defaultProps = {
  label: '',
  count: 0,
  prefix: null,
};

StatsCardItem.propTypes = {
  label: PropTypes.string,
  count: PropTypes.number,
  prefix: PropTypes.node,
};
