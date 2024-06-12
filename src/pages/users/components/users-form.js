import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Typography,
  SvgIcon,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import { useEffect, useState } from 'react';
import { useCatalogs } from 'src/hooks/use-catalogs';

const userYupObject = Yup.object({
  user: Yup.string().when(['updatePassword'], {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema,
  }),
  name: Yup.string().when(['updatePassword'], {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema,
  }),
  email: Yup.string().email('email no valido').max(255).nullable().optional(),
  password: Yup.string().when(['isNew', 'updatePassword'], {
    is: (isNew, updatePassword) => isNew || updatePassword,
    then: schema =>
      schema.min(8).max(255).required('La contraseña es requerida'),
    otherwise: schema => schema,
  }),
  active: Yup.boolean().required(),
});

const UsersForm = props => {
  const { user, groups } = props;
  const router = useRouter();
  const [updatePassword, setUpdatePassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const { state, getUsers } = useCatalogs();

  const isLoading = state.d?.loading;

  useEffect(() => {
    setIsNew(user.id && user.id < 0);
  }, [user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { ...user, isNew, updatePassword },
    validationSchema: userYupObject,
    onSubmit: async (values, helpers) => {
      try {
        if (updatePassword || isNew) {
          values.password = values.password;
        }

        if (updatePassword) {
          await authService.putData(
            `mpuser/updatepassword/${values.id}`,
            values,
          );
          handleCloseUpdatePassword();

          router.push('/users');
          return;
        }

        if (values.id && values.id > 0) {
          await authService.putData(`mpuser/${values.id}`, values);
        } else {
          await authService.postData('mpuser', values);
        }

        getUsers();
        router.push('/users');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: 'Error al guardar el registro' });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleUpdatePassword = () => {
    setUpdatePassword(true);
    setModalOpen(true);
  };
  const handleCancelUpdatePassword = () => {
    setUpdatePassword(false);
    setModalOpen(false);
  };
  const handleCloseUpdatePassword = () => {
    setModalOpen(false);
    setUpdatePassword(false);
  };

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Detalles de usuario" title="Usuario" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Nombre del usuario"
                  label="Usuario"
                  name="user"
                  id="user"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.user}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="Nombre"
                  id="name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  // required
                  value={formik.values.name}
                />
              </Grid>
              {isNew && (
                <Grid xs={12} md={6}>
                  <TextField
                    error={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    fullWidth
                    label="Contraseña"
                    name="password"
                    id="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    required
                    disabled={!isNew}
                    value={formik.values.password}
                  />
                </Grid>
              )}
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  id="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email ?? ''}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <Select
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Grupo"
                  name="idUserGroup"
                  id="idUserGroup"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.idUserGroup}
                >
                  {groups.map(g => {
                    return (
                      <MenuItem key={g.id + g.name} value={g.id}>
                        {g.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              <Grid xs={12} md={6}>
                <label>
                  <Checkbox
                    name="active"
                    id="active"
                    checked={formik.values.active}
                    onChange={formik.handleChange}
                  />
                  Habilitado
                </label>
              </Grid>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {!isNew && (
            <Button
              onClick={handleUpdatePassword}
              variant="contained"
              disabled={isLoading}
              startIcon={
                <SvgIcon fontSize="small">
                  <CogIcon />
                </SvgIcon>
              }
            >
              Cambiar contraseña
            </Button>
          )}
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardActions>
      </Card>

      <Dialog open={modalOpen} onClose={handleCloseUpdatePassword}>
        <DialogTitle>Actualización de contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cambiar la contraseña de <b>{user.name}</b>{' '}
          </DialogContentText>
          {!isNew && (
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
                autoFocus
                margin="dense"
                variant="standard"
                label="Nueva contraseña"
                name="password"
                id="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="password"
                required
                value={formik.values.password}
              />
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpdatePassword}>Cancelar</Button>
          <Button
            variant="contained"
            type="submit"
            onClick={formik.handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default UsersForm;
