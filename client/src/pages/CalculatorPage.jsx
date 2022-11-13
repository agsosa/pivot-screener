import * as React from 'react';
import PageContainer from 'components/layout/PageContainer';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Alert } from '@material-ui/lab';
import Chip from '@material-ui/core/Chip';
import { calculateCamarilla, calculateCPR, toFixedEx } from 'lib/Helpers';

const defaultState = {
  p: 0,
  bc: 0,
  tc: 0,
  h6: 0,
  h5: 0,
  h4: 0,
  h3: 0,
  l6: 0,
  l5: 0,
  l4: 0,
  l3: 0,
  low: '',
  high: '',
  close: '',
};

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(4),
    display: 'flex',
    gap: theme.spacing(3),
  },
  btnContainer: {
    display: 'flex',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
  },
  tipAlert: {
    marginTop: theme.spacing(2),
  },
  cprContainer: {
    display: 'flex',
    padding: theme.spacing(1),
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  camContainer: { display: 'flex', justifyContent: 'center' },
  camCol: { padding: theme.spacing(1), display: 'flex', flexDirection: 'column', gap: theme.spacing(2) },
  chipContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  resultsContainer: { padding: theme.spacing(1) },
}));

function CalculatorPage() {
  const classes = useStyles();
  const [state, setState] = React.useState(defaultState);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleInputChange = (e) => {
    setState((prev) => {
      const result = prev;
      result[e.target.name] = Number.parseFloat(e.target.value);
      return { ...result };
    });
  };

  const reset = () => {
    setState(defaultState);
  };

  React.useEffect(() => {
    if (errorMessage) setErrorMessage('');
  }, [state.high, state.close, state.low]);

  const calculate = () => {
    if (state.high < 0 || state.low < 0 || state.close < 0) {
      setErrorMessage('Negative numbers are not allowed');
      return;
    }

    if (state.high < state.low) {
      setErrorMessage("The High input can't be lower than the Low input");
      return;
    }

    if (state.close > state.high || state.close < state.low) {
      setErrorMessage('The Close input should be between High and Low');
      return;
    }

    if (state.high && state.low && state.close) {
      const cam = calculateCamarilla(state.high, state.low, state.close);
      const cpr = calculateCPR(state.high, state.low, state.close);

      setState((prevState) => ({
        ...prevState,
        h6: cam.h6,
        h5: cam.h5,
        h4: cam.h4,
        h3: cam.h3,
        l3: cam.l3,
        l4: cam.l4,
        l5: cam.l5,
        l6: cam.l6,
        tc: cpr.tc,
        p: cpr.p,
        bc: cpr.bc,
      }));
    } else {
      setErrorMessage('Please input High, Low and Close prices greater than 0');
    }
  };

  return (
    <PageContainer breadcrumbsItems={['Tools', 'Calculator']}>
      <Typography variant='h5'>Central Pivot Range and Camarilla S/R Calculator</Typography>
      <Typography variant='subtitle1'>Calculate the CPR and Camarilla levels for the next session</Typography>
      <Alert severity='info' className={classes.tipAlert}>
        If you want to calculate the <b>current</b> weekly CPR/Camarilla levels yo should <b>input</b> the High, Low and
        Close values of the <b>previous</b> weekly candle.
      </Alert>
      {errorMessage && (
        <Alert severity='error' className={classes.tipAlert}>
          {errorMessage}
        </Alert>
      )}
      <form className={classes.form}>
        <TextField
          required
          size='small'
          id='outlined-number'
          label='High'
          type='number'
          min={0}
          name='high'
          onChange={handleInputChange}
          value={state.high}
          InputLabelProps={{
            shrink: true,
          }}
          variant='outlined'
        />
        <TextField
          required
          size='small'
          id='outlined-number'
          value={state.low}
          name='low'
          label='Low'
          min={0}
          type='number'
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
          variant='outlined'
        />
        <TextField
          required
          size='small'
          id='outlined-number'
          label='Close'
          onChange={handleInputChange}
          value={state.close}
          name='close'
          type='number'
          min={0}
          InputLabelProps={{
            shrink: true,
          }}
          variant='outlined'
        />
      </form>
      <div className={classes.btnContainer}>
        <Button
          variant='contained'
          disabled={!state.close || !state.high || !state.low}
          color='primary'
          className={classes.button}
          startIcon={<DeleteForeverIcon />}
          onClick={calculate}>
          Calculate
        </Button>
        <Button variant='contained' className={classes.button} startIcon={<DeleteForeverIcon />} onClick={reset}>
          Reset
        </Button>
      </div>
      <div className={classes.resultsContainer}>
        <Typography>Central Pivot Range (CPR)</Typography>
        <div className={classes.cprContainer}>
          <div className={classes.chipContainer}>
            <Chip label='TC' variant='outlined' />
            {toFixedEx(state.tc)}
          </div>
          <div className={classes.chipContainer}>
            <Chip label='PIVOT' variant='outlined' />
            {toFixedEx(state.p)}
          </div>
          <div className={classes.chipContainer}>
            <Chip label='BC' variant='outlined' />
            {toFixedEx(state.bc)}
          </div>
        </div>
      </div>
      <div className={classes.resultsContainer}>
        <Typography>Camarilla Levels (Support/Resistance)</Typography>
        <div className={classes.camContainer}>
          <div className={classes.camCol}>
            <div className={classes.chipContainer}>
              <Chip label='H6' variant='outlined' />
              {toFixedEx(state.h6)}
            </div>
            <div className={classes.chipContainer}>
              <Chip label='H5' variant='outlined' />
              {toFixedEx(state.h5)}
            </div>
            <div className={classes.chipContainer}>
              <Chip label='H4' variant='outlined' />
              {toFixedEx(state.h4)}
            </div>
            <div className={classes.chipContainer}>
              <Chip label='H3' variant='outlined' />
              {toFixedEx(state.h3)}
            </div>
          </div>
          <div className={classes.camCol}>
            <div className={classes.chipContainer}>
              <Chip label='L6' variant='outlined' />
              {toFixedEx(state.l6)}
            </div>
            <div className={classes.chipContainer}>
              <Chip label='L5' variant='outlined' />
              {toFixedEx(state.l5)}
            </div>
            <div className={classes.chipContainer}>
              <Chip label='L4' variant='outlined' />
              {toFixedEx(state.l4)}
            </div>
            <div className={classes.chipContainer}>
              <Chip label='L3' variant='outlined' />
              {toFixedEx(state.l3)}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default CalculatorPage;
