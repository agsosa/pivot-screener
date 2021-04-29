import * as React from 'react';
import { message } from 'antd'; // TODO: Replace message
import './Table.css';
import { PropTypes } from 'prop-types';
import { capitalizeFirstLetter } from 'lib/Helpers';
import SocketStatus from 'components/misc/SocketStatus';
import { useMst } from 'models/Root';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  btnContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
  tickersCount: {
    border: '1px solid rgb(0,0,0,0.30)',
    borderRadius: '30%',
    paddingLeft: 5,
    paddingRight: 5,
  },
}));

const FiltersMenu = ({ screenerType, gridApi, tickersCount, market, timeframe }) => {
  const classes = useStyles();
  const [filtersEnabled, setFiltersEnabled] = React.useState(false);

  const { camTableFilters, cprTableFilters, setCprTableFilters, setCamTableFilters } = useMst((store) => ({
    camTableFilters: store.camTableFilters,
    cprTableFilters: store.cprTableFilters,
    setCprTableFilters: store.setCprTableFilters,
    setCamTableFilters: store.setCamTableFilters,
  }));

  let setTableFilters;
  let getTableFilters;

  switch (screenerType.toLowerCase()) {
    case 'cam':
      getTableFilters = camTableFilters;
      setTableFilters = setCamTableFilters;
      break;
    case 'cpr':
      getTableFilters = cprTableFilters;
      setTableFilters = setCprTableFilters;
      break;
    default:
      getTableFilters = null;
      setTableFilters = null;
  }

  const onFilterChanged = () => {
    setFiltersEnabled(gridApi.isAnyFilterPresent());
  };

  React.useEffect(() => {
    gridApi.addEventListener('filterChanged', onFilterChanged);

    return () => {
      gridApi.removeEventListener('filterChanged', onFilterChanged);
    };
  }, [gridApi]);

  const saveFilters = () => {
    if (gridApi) {
      const filterModel = gridApi.getFilterModel();
      if (setTableFilters) setTableFilters(filterModel);
      message.success('Filters saved');
    } else {
      message.success('The table is not ready');
    }
  };

  const loadFilters = () => {
    if (gridApi) {
      if (getTableFilters) {
        gridApi.setFilterModel(getTableFilters);
        message.success('Filters applied');
      } else {
        message.error('No saved filters found');
      }
    } else {
      message.success('The table is not ready');
    }
  };

  const clearFilters = () => {
    if (gridApi) {
      gridApi.setFilterModel(null);
    } else {
      message.success('The table is not ready');
    }
  };

  return (
    <div>
      <div className={classes.titleContainer}>
        <Typography variant='h5'>
          {capitalizeFirstLetter(market)} / {capitalizeFirstLetter(timeframe)}
        </Typography>
        {tickersCount > 0 && (
          <Typography variant='caption' className={classes.tickersCount}>
            {tickersCount}
          </Typography>
        )}
        <SocketStatus className='socket-status' />
      </div>

      <Typography variant='caption'>
        You can filter, short and move any column. The data is updated automatically.
      </Typography>
      <div className={classes.btnContainer}>
        <Button size='small' variant='outlined' onClick={saveFilters}>
          Save Filters
        </Button>
        <Button size='small' variant='outlined' onClick={loadFilters}>
          Load Saved Filters
        </Button>
        <Button size='small' variant='outlined' onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
      {filtersEnabled && <p className='using-filters'>* Using Filters *</p>}
    </div>
  );
};

FiltersMenu.propTypes = {
  tickersCount: PropTypes.number.isRequired,
  market: PropTypes.string.isRequired,
  timeframe: PropTypes.string.isRequired,
  screenerType: PropTypes.string.isRequired,
  gridApi: PropTypes.shape({
    setFilterModel: PropTypes.func.isRequired,
    getFilterModel: PropTypes.func.isRequired,
    isAnyFilterPresent: PropTypes.func.isRequired,
    addEventListener: PropTypes.func.isRequired,
    removeEventListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default FiltersMenu;
