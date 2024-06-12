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
  Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCatalogs } from 'src/hooks/use-catalogs';

const LocationForm = props => {
  const { item, categories } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getLocations } = useCatalogs();

  useEffect(() => {
    setIsNew(item.id && item.id < 0);
  }, [item]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: item,
    validationSchema: Yup.object({
      keyname: Yup.string().required(),
      description: Yup.string().required(),
      idProductCategory: Yup.number().required(),
      status: Yup.boolean().required(),
    }),

    validate: values => {},
    
    onSubmit: async (values, helpers) => {
      try {
        if (values.id && values.id > 0) {
          await authService.putData(`location/${values.id}`, values);
        } else {
          await authService.postData('location', values);
        }
        getLocations();
        router.push('/location');
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
        <CardHeader subheader="Detalles de Locacion" title="Locacion" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.keyname && formik.errors.keyname)}
                  fullWidth
                  helperText="Código"
                  label="Código"
                  name="keyname"
                  id="keyname"
                  onBlur={formik.handleBlur}
                  onChange={e => {
                    formik.setFieldValue('keyname', e.target.value);
                  }}
                  value={formik.values.keyname}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                  fullWidth
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
                  select
                  error={
                    !!(
                      formik.touched.idProductCategory &&
                      formik.errors.idProductCategory
                    )
                  }
                  fullWidth
                  helperText={
                    formik.touched.idProductCategory &&
                    formik.errors.idProductCategory
                  }
                  label="Categoría"
                  name="idProductCategory"
                  id="idProductCategory"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.idProductCategory}
                >
                  {categories &&
                    categories.map(g => {
                      return (
                        <MenuItem key={g.description} value={g.id}>
                          {g.description}
                        </MenuItem>
                      );
                    })}
                </TextField>
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
export default LocationForm;
