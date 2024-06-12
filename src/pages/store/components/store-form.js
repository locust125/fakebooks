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
} from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCatalogs } from 'src/hooks/use-catalogs';

const UsersForm = props => {
  const { store } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getStore } = useCatalogs();

  const isLoading = state.store?.loading;

  useEffect(() => {
    setIsNew(store.id && store.id < 0);
  }, [store]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: store,
    validationSchema: Yup.object({
      code: Yup.string().max(45).required(),
      storename: Yup.string().max(100).required(),
      email: Yup.string().email('email no valido').max(255),
      telephone: Yup.string()
        .matches(/^\d{10}/, 'Ingrese un número de teléfono válido')
        .required(),
      address: Yup.string().max(100).required(),
      ticketMessage: Yup.string().max(500).required(),
      comments: Yup.string().max(500).required(),
      website: Yup.string()
        .max(100)
        .matches(
          /(https?:\/\/)?(www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)|(https?:\/\/)?(www\.)?(?!ww)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
        )
        .required(),
      rfc: Yup.string()
        .matches(/^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/, 'Ingrese un RFC válido')
        .required(),
    }),

    onSubmit: async (values, helpers) => {
      console.log('submit');
      try {
        if (values.id && values.id > 0) {
          await authService.putData(`store/${values.id}`, values);
        } else {
          await authService.postData('store', values);
        }

        getStore();
        router.push('/store');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: 'Error al guardar el registro' });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Detalles de la sucursal" title="Sucursal" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Codigo de la sucursal"
                  label="Codigo"
                  name="code"
                  id="code"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.code}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Nombre de la sucursal"
                  label="Nombre"
                  name="storename"
                  id="storname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.storename ?? ''}
                />
              </Grid>
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
                <TextField
                  error={
                    !!(formik.touched.telephone && formik.errors.telephone)
                  }
                  fullWidth
                  helperText={
                    formik.touched.telephone && formik.errors.telephone
                  }
                  label="Número de teléfono"
                  name="telephone"
                  id="telephone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.telephone ?? ''}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Dirección"
                  label="Dirección"
                  name="address"
                  id="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address ?? ''}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.website && formik.errors.website)}
                  fullWidth
                  helperText={
                    formik.touched.telephone && formik.errors.telephone
                  }
                  label="Sitio web"
                  name="website"
                  id="website"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.website ?? ''}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Mensaje de ticket"
                  label="Mensaje"
                  name="ticketMessage"
                  id="ticketMessage"
                  multiline
                  rows={3}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ticketMessage ?? ''}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Comentarios"
                  label="Comentarios"
                  name="comments"
                  id="comments"
                  multiline
                  rows={3}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.comments}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.rfc && formik.errors.rfc)}
                  fullWidth
                  helperText={formik.touched.rfc && formik.errors.rfc}
                  label="RFC"
                  name="rfc"
                  id="rfc"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.rfc ?? ''}
                />
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
          <Button variant="contained" type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default UsersForm;
