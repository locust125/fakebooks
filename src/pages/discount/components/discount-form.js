import React, { useEffect, useState } from 'react';
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
import { useCatalogs } from 'src/hooks/use-catalogs';


const DiscountForm = (props) => {
  const { item, categories } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getDiscount } = useCatalogs();

  const isLoading = state.discount?.loading;

  useEffect(() => {
    setIsNew(item.id && item.id < 0);
  }, [item]);

  const initialValues = {
    code: item.code || '',
    description: item.description || '',
    porcdiscount: item.porcdiscount || 0,
    isEditable: item.isEditable || false,
    status: item.status || false,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: Yup.object({
      code: Yup.string().required(),
      description: Yup.string().required(),
      porcdiscount: Yup.number()
        .min(1, "El valor mínimo debe ser 1")
        .max(100, "El valor máximo debe ser 100"),
      isEditable: Yup.boolean().required(),
      status: Yup.boolean().required(),
    }),

    validate: (values) => {},

    onSubmit: async (values, helpers) => {
      try {
        if (item.id && item.id >= 0) {
        await authService.putData(`discount/${item.id}`, values);
      } else {
        await authService.postData('discount', values);
      }
        getDiscount();
        router.push('/discount');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: 'Error al guardar el registro' });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleChangeCheckboxEditable = (event) => {
    formik.setFieldValue('isEditable', event.target.checked);
  };

  const handleChangeCheckboxStatus = (event) => {
    formik.setFieldValue('status', event.target.checked);
  };

  return (
    <form autoComplete="off" onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Detalles de Descuento" title="Descuento" />
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
                  error={
                    !!(formik.touched.porcdiscount && formik.errors.porcdiscount)
                  }
                  helperText={
                    formik.touched.porcdiscount && formik.errors.porcdiscount
                  }
                  fullWidth
                  label="Porcentaje"
                  name="porcdiscount"
                  id="porcdiscount"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number" 
                  required
                  value={formik.values.porcdiscount}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <label>
                  <Checkbox
                    name='isEditable'
                    id='isEditable'
                    checked={formik.values.isEditable}
                    onChange={handleChangeCheckboxEditable}
                  />
                  Es editable
                </label>
              </Grid>
              <Grid xs={12} md={6}>
                <label>
                  <Checkbox
                    name='status'
                    id='status'
                    checked={formik.values.status}
                    onChange={handleChangeCheckboxStatus}
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
          <Button variant="contained" type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default DiscountForm;
