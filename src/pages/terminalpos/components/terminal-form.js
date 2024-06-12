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
  Select,
  MenuItem,
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCatalogs } from 'src/hooks/use-catalogs';

const TerminalForm = props => {
  const { item, warehouses, stores } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getTerminalpos } = useCatalogs();

  useEffect(() => {
    setIsNew(item.id && item.id < 0);
  }, [item]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: item,
    validationSchema: Yup.object({
      code: Yup.string().required(),
      prefix: Yup.string().required().max(3),
      ticket: Yup.string()
        .min(10)
        .max(10)
        .required('Ticket inicial es requerido'),
      isOpen: Yup.boolean().required().default(false),
      idWarehouse: Yup.number().positive(),
      idStore: Yup.number().positive(),
      status: Yup.boolean().required().default(true),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if (values.id && values.id > 0) {
          await authService.putData(`terminalpos/${values.id}`, values);
        } else {
          await authService.postData('terminalpos', values);
        }
        getTerminalpos();
        router.push('/terminalpos');
      } catch (err) {
        console.log(err);
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: 'Error al guardar el registro' });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Detalles de caja" title="Caja" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Código"
                  label="Código"
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
                  helperText="Descripción"
                  label="Descripción"
                  id="description"
                  name="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.description}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.prefix && formik.errors.prefix)}
                  helperText={formik.touched.prefix && formik.errors.prefix}
                  fullWidth
                  label="Prefijo"
                  name="prefix"
                  id="prefix"
                  onBlur={formik.handleBlur}
                  onChange={e => {
                    const value = e.target.value;
                    var prefixReg = /^[A-Za-z]*$/;
                    if (prefixReg.test(value)) {
                      formik.setFieldValue('prefix', value.toUpperCase());
                      const tiket = !value.length
                        ? ''
                        : value.toUpperCase() +
                          (1 + '').padStart(10 - value.length, '0');
                      formik.setFieldValue('ticket', tiket);
                    }
                  }}
                  type="prefix"
                  required
                  value={formik.values.prefix}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.ticket && formik.errors.ticket)}
                  fullWidth
                  helperText={formik.touched.ticket && formik.errors.ticket}
                  label="ticket"
                  name="ticket"
                  id="ticket"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.ticket}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <Select
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Tienda"
                  name="idStore"
                  id="idStore"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.idStore}
                >
                  {stores &&
                    stores.map(g => {
                      return (
                        <MenuItem key={g.id} value={g.id}>
                          {g.storename}
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
              <Grid xs={12} md={6}>
                <Select
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Almacen"
                  name="idWarehouse"
                  id="idWarehouse"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.idWarehouse}
                >
                  {warehouses &&
                    warehouses.map(g => {
                      return (
                        <MenuItem key={g.id} value={g.id}>
                          {g.description}
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
              
              <Grid xs={12} md={6}>
                <label>
                  <Checkbox
                    name='status'
                    id='status'
                    checked={formik.values.status}
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
          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default TerminalForm;
