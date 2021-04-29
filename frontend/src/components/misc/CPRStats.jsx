import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropTypes } from 'prop-types';
import { useMst } from 'models/Root';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import PauseIcon from '@material-ui/icons/Pause';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import BullsBearProgress from './BullsBearProgress';
import { StatsCardItem, StatsCardColumn, StatsCardContainer } from './StatsCard';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
}));

const CPRStats = ({ timeframe, futureMode }) => {
  const classes = useStyles();

  const { cprStats, toggleCPRStatsPanel, cprStatsPanelVisible } = useMst((store) => ({
    cprStats: store.cprStats,
    toggleCPRStatsPanel: store.toggleCPRStatsPanel,
    cprStatsPanelVisible: store.cprStatsPanelVisible,
  }));

  const stats = cprStats(timeframe, futureMode);

  return (
    <div className={classes.root}>
      <Button variant='outlined' color='primary' onClick={toggleCPRStatsPanel}>
        {cprStatsPanelVisible ? 'Hide Statistics' : 'Show Statistics'}
      </Button>
      {cprStatsPanelVisible ? (
        <>
          <StatsCardContainer>
            <StatsCardColumn>
              <StatsCardItem label='Untested CPR' count={stats.untestedCount} prefix='🧲' />
              <StatsCardItem label='Above CPR' count={30} prefix={<TrendingUpIcon />} />
              <StatsCardItem label='CPR Width < 1%' count={30} prefix={<VerticalAlignCenterIcon />} />
            </StatsCardColumn>
            <StatsCardColumn>
              <StatsCardItem label='Neutral' count={30} prefix={<PauseIcon />} />
              <StatsCardItem label='Below CPR' count={30} prefix={<TrendingDownIcon />} />
              <StatsCardItem label='CPR Width > 1%' count={30} prefix={<FullscreenIcon />} />
            </StatsCardColumn>
          </StatsCardContainer>

          <BullsBearProgress bullsPercent={stats.bullsPercent} bearsPercent={stats.bearsPercent} />
        </>
      ) : null}
    </div>
  );
};

CPRStats.propTypes = {
  timeframe: PropTypes.string.isRequired,
  futureMode: PropTypes.bool.isRequired,
};

export default observer(CPRStats);
