import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default React.forwardRef((props, ref) => {
  const [open, setOpen] = React.useState(false);

  function toggle() {
    setOpen(!open);
  }

  React.useImperativeHandle(ref, () => ({
    toggle() {
      toggle();
    },
  }));

  return (
    <Dialog
      open={open}
      onClose={toggle}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'>
      <DialogTitle id='alert-dialog-title'>Donations</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Any amount of money can help me to maintain the site. Thank you!
          <ul>
            <li>
              <b>BTC/BCH:</b> 17oGi5Qc3ru599vY8mWgPj723SJgfAqdBn
            </li>
            <li>
              <b>LTC:</b> LQ2xgCCqzG2AYJLPNarCuap4ZqAV5rLaNE
            </li>
            <li>
              <b>USDT-TRC20:</b> TAuhS3JDzDzK9FhK2EbmeDKJ9JdKUbwGzs
            </li>
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} color='primary' autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});
