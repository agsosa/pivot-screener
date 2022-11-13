import React from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { observer } from 'mobx-react-lite';
import { useMst } from 'models/Root';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';

/* eslint-disable no-unneeded-ternary */

const ChartOptions = observer(({ width }) => {
  const timeframes = ['Daily', 'Weekly', 'Monthly'];
  const xs = width === 'xs';

  const { chartOptions } = useMst((store) => ({
    chartOptions: store.chartOptions,
  }));

  const handleChange = (event) => {
    if (chartOptions[event.target.name]) {
      chartOptions[event.target.name](event.target.checked);
    }
  };

  const onToggleOffClick = () => {
    timeframes.forEach((q) => {
      chartOptions[`set${q}CPR`](false);
      chartOptions[`set${q}Cam`](false);
    });
    chartOptions.setFutureMode(false);
  };

  return (
    <>
      <FormGroup row={xs ? false : true} style={{ justifyContent: 'center', padding: 5 }}>
        {timeframes.map((q) => (
          <FormGroup column={xs ? 'false' : 'true'} key={q}>
            <FormControlLabel
              control={
                <Switch
                  checked={chartOptions[`${q.toLowerCase()}CPR`]}
                  onChange={handleChange}
                  name={`set${q}CPR`} // Function name on chartOptions to be called on change
                  color='primary'
                />
              }
              label={`${q} CPR`}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={chartOptions[`${q.toLowerCase()}Cam`]}
                  onChange={handleChange}
                  name={`set${q}Cam`} // Function name on chartOptions to be called on change
                  color='primary'
                />
              }
              label={`${q} Camarilla`}
            />
          </FormGroup>
        ))}
        <FormGroup column={xs ? 'false' : 'true'} style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={chartOptions.futureMode}
                onChange={handleChange}
                name='setFutureMode' // Function name on chartOptions to be called on change
                color='primary'
              />
            }
            label='Show developing pivots'
          />
          <Button
            variant='outlined'
            size='small'
            color='primary'
            style={{ width: '80%', marginBottom: 5 }}
            onClick={onToggleOffClick}>
            Toggle off
          </Button>
        </FormGroup>
      </FormGroup>
    </>
  );
});

export default withWidth()(ChartOptions);
