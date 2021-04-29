import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { apiFetchBinanceFuturesList } from 'lib/API';
import { PropTypes } from 'prop-types';

function SymbolsListSelector({ onSymbolChange }) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  async function fetchSymbolsList() {
    // TODO: Cancel on unmount
    setLoading(true);

    const result = await apiFetchBinanceFuturesList();

    if (result && Array.isArray(result)) {
      setOptions(result);
    }

    setLoading(false);
  }

  React.useEffect(() => {
    if (open && options.length === 0 && !loading) {
      fetchSymbolsList();
    }
  }, [open]);

  function handleOnChange(event, value) {
    if (value && onSymbolChange) onSymbolChange(value);
  }

  return (
    <Autocomplete
      id='async-symbols-list'
      size='small'
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      defaultValue={options[0] || 'BTCUSDT'}
      getOptionSelected={(option, value) => option === value}
      getOptionLabel={(option) => option}
      options={options}
      onChange={handleOnChange}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Symbol'
          variant='outlined'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

SymbolsListSelector.defaultProps = {
  onSymbolChange: null,
};

SymbolsListSelector.propTypes = {
  onSymbolChange: PropTypes.func,
};

export default SymbolsListSelector;
