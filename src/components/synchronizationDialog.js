import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import * as PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloudArrowUpIcon from '@heroicons/react/24/solid/CloudArrowUpIcon';
import { Button, SvgIcon } from '@mui/material';
import authService from 'src/services/auth-service';

export default function SynchronizationDialog(props) {
  const { name, endpoint } = props;

  const [open, setOpen] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [confirmClicked, setConfirmClicked] = React.useState(false); // Nuevo estado para el botón de confirmar

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    authService
      .postData(`${endpoint}/fbsync`)
      .then(response => {
        console.log('Sincronización exitosa', response);
        setSyncResult({ success: true });
      })
      .catch(error => {
        console.error('Error en la sincronización', error);
        setSyncResult({ success: false, error });
      })
      .finally(() => {
        setOpen(true);
        setConfirmClicked(true); // Establecer confirmClicked en true después de confirmar
      });
  };

  return (
    <React.Fragment>
      <Button
        color="inherit"
        onClick={handleClickOpen}
        startIcon={
          <SvgIcon fontSize="small">
            <CloudArrowUpIcon />
          </SvgIcon>
        }
      >
        Sincronizar
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Sincronización de ${name}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al sincronizar {name}, estos estarán disponibles en la aplicación
            móvil.
          </DialogContentText>
          {syncResult && syncResult.success && (
            <div style={{ color: 'green' }}>Sincronización exitosa</div>
          )}
          {syncResult && !syncResult.success && (
            <div style={{ color: 'red' }}>
              Error en la sincronización: {syncResult.error.message}
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

SynchronizationDialog.propTypes = {
  name: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
};
