import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import * as PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PaperAirplaneIcon from '@heroicons/react/24/solid/PaperAirplaneIcon';
import { Button, SvgIcon, TextField } from '@mui/material';
import authService from 'src/services/auth-service';

export default function SynchronizationDialog(props) {
  const { customerCode, eventDate, visible } = props;

  const [open, setOpen] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [successMessageOpen, setSuccessMessageOpen] = React.useState(false);
  const [errorMessageOpen, setErrorMessageOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    const requestData = {
      email: document.getElementById('email').value,
      customerCode,
      eventDate,
    };

    authService
      .postData(`delivery/samplephotos`, requestData)
      .then(response => {
        console.log('Sincronización exitosa', response);
        setSyncResult({ success: true });
        setSuccessMessageOpen(true);
      })
      .catch(error => {
        console.error('Error en la sincronización', error);
        setSyncResult({ success: false, error });
        setErrorMessageOpen(true);
      })
      .finally(() => {
        setOpen(true);
      });
  };

  const handleAcceptSuccessMessage = () => {
    setSuccessMessageOpen(false);
    handleClose();
  };

  const handleAcceptErrorMessage = () => {
    setErrorMessageOpen(false);
  };

  return (
    <React.Fragment>
      {visible && (
        <Button
          variant="contained"
          onClick={handleClickOpen}
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <span style={{ marginRight: '8px' }}>Generar link de muestra</span>
          <SvgIcon fontSize="small">
            <PaperAirplaneIcon />
          </SvgIcon>
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Enviar muestra`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Escribe el correo donde se enviaran las muestras
          </DialogContentText>
          <TextField label="Correo" name="email" id="email" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            disabled={syncResult && syncResult.success}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={successMessageOpen}
        onClose={handleAcceptSuccessMessage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Éxito</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Se han enviado las muestras.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAcceptSuccessMessage}
            color="primary"
            autoFocus
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={errorMessageOpen}
        onClose={handleAcceptErrorMessage}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Se produjo un error al enviar las muestras. Inténtalo de nuevo más
            tarde.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAcceptErrorMessage} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

SynchronizationDialog.propTypes = {
  customerCode: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};
