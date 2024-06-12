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
  FormControlLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import authService from 'src/services/auth-service';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCatalogs } from 'src/hooks/use-catalogs';

const PaymethodForm = props => {
  const { item, currencies } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getPaymethod } = useCatalogs();

  useEffect(() => {
    setIsNew(item.id && item.id < 0);
  }, [item]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: item,
    validationSchema: Yup.object({
      code: Yup.string().required(),
      description: Yup.string().required(),
      idCurrency: Yup.number().required(),
      maxamount: Yup.number().required(),
      fee: Yup.number().positive().min(0).max(100).optional().nullable(),
      account: Yup.string().optional().nullable(),
      isCash: Yup.boolean().required().default(true),
      status: Yup.boolean().required().default(true),
    }),
    onSubmit: async (values, helpers) => {
      try {
        console.log(values);
        if (values.id && values.id > 0) {
          await authService.putData(`paymethod/${values.id}`, values);
        } else {
          await authService.postData('paymethod', values);
        }
        getPaymethod();
        router.push('/paymethod');
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
                  required
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
                  select
                  error={
                    !!(formik.touched.idCurrency && formik.errors.idCurrency)
                  }
                  fullWidth
                  helperText={
                    formik.touched.idCurrency && formik.errors.idCurrency
                  }
                  label="Moneda"
                  name="idCurrency"
                  id="idCurrency"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  selected={formik.values.idCurrency}
                  value={formik.values.idCurrency}
                >
                  {currencies &&
                    currencies.map(g => {
                      return (
                        <MenuItem key={g.id + g.description} value={g.id}>
                          {g.description}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      fullWidth
                      name="isCash"
                      id="isCash"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      checked={formik.values.isCash}
                    />
                  }
                  label="Es efectivo"
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.prefix && formik.errors.prefix)}
                  helperText={formik.touched.prefix && formik.errors.prefix}
                  fullWidth
                  required
                  label="Monto máximo"
                  name="maxamount"
                  id="maxamount"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="maxamount"
                  value={formik.values.maxamount}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.fee && formik.errors.fee)}
                  fullWidth
                  helperText={formik.touched.fee && formik.errors.fee}
                  label="Comisión (%)"
                  name="fee"
                  id="fee"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.fee}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.account && formik.errors.account)}
                  fullWidth
                  helperText={formik.touched.account && formik.errors.account}
                  label="Cuenta"
                  name="account"
                  id="account"
                  optional
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.account}
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
export default PaymethodForm;
