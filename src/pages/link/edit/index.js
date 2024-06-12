import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import * as PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, SvgIcon, TextField, Grid, Tooltip } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import authService from 'src/services/auth-service';

export default function UpdateLink({ id, cliente }) {
  const [open, setOpen] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    authService
      .putData(`logphotodelivery/${id}/expirationdate/${formik.values.date}`)
      .then(response => {
        console.log('Acción exitosa', response);
        setSyncResult({ success: true });
        window.location.reload();
      })
      .catch(error => {
        console.error('Error en la acción', error);
        setSyncResult({ success: false, error });
      })
      .finally(() => {
        setOpen(true);
      });
  };

  const today = new Date();
  today.setDate(today.getDate() + 15);
  const initialDate = today.toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: {
      date: initialDate,
    },
  });

  return (
    <React.Fragment>
      <Tooltip title="Editar" placement="top">
        <Button
          onClick={handleClickOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          variant="contained"
        >
          <SvgIcon fontSize="small">
            <PencilIcon />
          </SvgIcon>
        </Button>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Cambio de fecha de expiración de {cliente}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al editar la fecha de expiración el usuario podrá tener acceso al
            Link. Seleccione la fecha, por favor.
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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                id="date"
                name="date"
                type="date"
                placeholder="Search customer"
                error={Boolean(formik.touched.date && formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{
                  shrink: false,
                }}
                value={formik.values.date}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
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
    </React.Fragment>
  );
}

UpdateLink.propTypes = {
  id: PropTypes.number.isRequired,
  cliente: PropTypes.string.isRequired,
};
