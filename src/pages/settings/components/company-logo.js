import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';

export default function CompanyLogoManager() {
  const [logoUrl, setLogoUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const fetchLogo = async () => {
    try {
      const response = await authService.getData('settings/companylogo');
      setLogoUrl(`${response.settingsValue}?t=${new Date().getTime()}`);
    } catch (error) {
      console.error('Error fetching the logo:', error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      logo: null,
    },
    onSubmit: async values => {
      const formData = new FormData();
      formData.append('logo', values.logo);

      try {
        const response = await authService.postData(
          'settings/companylogo',
          formData,
        );
        console.log('Upload successful', response);
        setSyncResult({ success: true });
        fetchLogo(); // Fetch the new logo after upload
      } catch (error) {
        console.error('Error uploading the logo', error);
        setSyncResult({ success: false, error });
      } finally {
        setOpen(false);
      }
    },
  });

  return (
    <>
      <Stack alignItems="flex-start">
        <Stack direction="column" spacing={2} alignItems="center">
          <h2>Logo</h2>
          <Avatar
            alt="Company Logo"
            src={logoUrl}
            sx={{ width: 170, height: 170 }}
          />
          <Button onClick={handleClickOpen} variant="contained">
            Subir nuevo logo
          </Button>
        </Stack>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subir nuevo logo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Selecciona una imagen para subir como nuevo logo de la empresa.
          </DialogContentText>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={event => {
                    formik.setFieldValue('logo', event.currentTarget.files[0]);
                  }}
                />
              </Grid>
            </Grid>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                Confirmar
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
