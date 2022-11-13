import React from 'react';
import { observer } from 'mobx-react-lite';
import { PropTypes } from 'prop-types';
import { useMst } from 'models/Root';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import BullsBearProgress from 'components/stats/BullsBearProgress';
import { StatsCardItem, StatsCardColumn, StatsCardContainer } from 'components/stats/StatsCard';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
}));

const CamStats = observer(({ timeframe, futureMode }) => {
  const classes = useStyles();

  const { toggleCamStatsPanel, camStatsPanelVisible, camStats } = useMst((store) => ({
    tickers: store.tickers,
    toggleCamStatsPanel: store.toggleCamStatsPanel,
    camStatsPanelVisible: store.camStatsPanelVisible,
    camStats: store.camStats,
  }));

  const stats = camStats(timeframe, futureMode);

  return (
    <div className={classes.root}>
      <Button variant='outlined' color='primary' onClick={toggleCamStatsPanel}>
        {camStatsPanelVisible ? 'Hide Statistics' : 'Show Statistics'}
      </Button>
      {camStatsPanelVisible ? (
        <>
          <div style={{ marginBottom: 15, marginTop: 15 }}>
            <StatsCardContainer>
              <StatsCardColumn>
                <StatsCardItem label='Above H4' count={stats.aboveH4} prefix={<TrendingUpIcon />} />
                <StatsCardItem label='Above H3' count={stats.aboveH3} prefix={<ErrorOutlineIcon />} />
              </StatsCardColumn>
              <StatsCardColumn>
                <StatsCardItem label='Below L4' count={stats.belowL4} prefix={<TrendingDownIcon />} />
                <StatsCardItem label='Below L3' count={stats.belowL3} prefix={<ErrorOutlineIcon />} />
              </StatsCardColumn>
            </StatsCardContainer>

            <StatsCardItem label='Between H3 and L3' count={stats.betweenL3H3} prefix={<VerticalAlignCenterIcon />} />
          </div>

          <BullsBearProgress bullsPercent={stats.bullsPercent} bearsPercent={stats.bearsPercent} />
        </>
      ) : null}
    </div>
  );
});

CamStats.propTypes = {
  futureMode: PropTypes.bool.isRequired,
  timeframe: PropTypes.string.isRequired,
};

export default CamStats;
