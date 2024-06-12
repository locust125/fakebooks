import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import * as PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, SvgIcon } from '@mui/material';
import authService from 'src/services/auth-service';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';

export default function CancelPostVenta(props) {
  const { name, idPost } = props;

  const [open, setOpen] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [confirmClicked, setConfirmClicked] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    authService
      .putData(`photosamplemail/cancel/${idPost}`)
      .then(response => {
        console.log('Cancelación exitosa', response);
        setSyncResult({ success: true });
        setTimeout(() => {
          window.location.reload();
        }, 900);
      })
      .catch(error => {
        console.error('Error al eliminar, intente mas tarde', error);
        setSyncResult({ success: false, error });
      })
      .finally(() => {
        setOpen(true);
        setConfirmClicked(true);
      });
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        variant="contained"
      >
        <SvgIcon fontSize="small">
          <TrashIcon />
        </SvgIcon>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Cancelar producto de ${name}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta seguro de eliminar el producto de {name}.
          </DialogContentText>
          {syncResult && syncResult.success && (
            <div style={{ color: 'green' }}>Cancelación exitosa</div>
          )}
          {syncResult && !syncResult.success && (
            <div style={{ color: 'red' }}>
              Error en la cancelación: {syncResult.error.message}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            disabled={(syncResult && syncResult.success) || confirmClicked}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

CancelPostVenta.propTypes = {
  name: PropTypes.string.isRequired,
  idPost: PropTypes.string.isRequired,
};
