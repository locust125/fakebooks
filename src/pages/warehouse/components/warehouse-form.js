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
  MenuItem,
  Select,
  Checkbox,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCatalogs } from 'src/hooks/use-catalogs';

const WarehouseForm = props => {
  const { warehouse, warehouses } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getWarehouse } = useCatalogs();

  const isLoading = state.warehouse?.loading;

  useEffect(() => {
    setIsNew(warehouse.id && warehouse.id < 0);
  }, [warehouse]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: warehouse,
    validationSchema: Yup.object({
      code: Yup.string().max(45).required(),
      name: Yup.string().required(),
      description: Yup.string().max(100).required(),
      idwarehouseparent: Yup.number().min(0, 'Elige un almacén valido'),
    }),

    onSubmit: async (values, helpers) => {
      try {
        if (values.id && values.id > 0) {
          await authService.putData(`warehouse/${values.id}`, values);
        } else {
          await authService.postData('warehouse', values);
        }
        getWarehouse();
        router.push('/warehouse');
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
        <CardHeader subheader="Detalles del almacén" title="Almacén" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Código del almacén"
                  label="Código"
                  name="code"
                  id="code"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.code ?? ''}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Nombre del almacén"
                  label="Nombre"
                  name="name"
                  id="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name ?? ''}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  helperText="Descripción"
                  label="Descripción"
                  name="description"
                  id="description"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.description ?? ''}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl fullWidth>
                  <Select
                    error={
                      !!(
                        formik.touched.idwarehouseparent &&
                        formik.errors.idwarehouseparent
                      )
                    }
                    fullWidth
                    name="idwarehouseparent"
                    id="idwarehouseparen"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.idwarehouseparent}
                  >
                    <MenuItem value={0} selected>
                      No aplica
                    </MenuItem>
                    {warehouses &&
                      warehouses
                        .filter(warehouse => warehouse.id !== formik.values.id)
                        .map(item => {
                          return (
                            <MenuItem key={item.id} value={item.id}>
                              {item.description}
                            </MenuItem>
                          );
                        })}
                  </Select>
                  <FormHelperText>
                    {(formik.touched.idwarehouseparent &&
                      formik.errors.idwarehouseparent) ||
                      'Almacén Padre'}
                  </FormHelperText>
                </FormControl>
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

export default WarehouseForm;
