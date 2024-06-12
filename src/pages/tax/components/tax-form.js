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
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCatalogs } from 'src/hooks/use-catalogs';

const TaxForm = props => {
  const { item } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getTax } = useCatalogs();

  useEffect(() => {
    setIsNew(item.id && item.id < 0);
  }, [item]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: item,
    validationSchema: Yup.object({
      code: Yup.string().required(),
      rate: Yup.number().required(),
      status: Yup.boolean().required().default(true),
    }),
    onSubmit: async (values, helpers) => {
      try {
        if (values.id && values.id > 0) {
          await authService.putData(`tax/${values.id}`, values);
        } else {
          await authService.postData('tax', values);
        }
        getTax();
        router.push('/tax');
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
                  label="Tasa"
                  name="rate"
                  id="rate"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.rate}
                />
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

export default TaxForm;
