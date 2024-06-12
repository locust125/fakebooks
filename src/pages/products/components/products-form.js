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

const ProductsForm = props => {
  const { item, taxes, categories, currencies, brands } = props;
  const router = useRouter();
  const [isNew, setIsNew] = useState(true);
  const { state, getProducts } = useCatalogs();

  useEffect(() => {
    setIsNew(item.id && item.id < 0);
  }, [item]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: item,
    validationSchema: Yup.object({
      codename: Yup.string().required(),
      barcode: Yup.string().required(),
      description: Yup.string().required(),
      price: Yup.number().positive().required(),
      pricepesos: Yup.number(),
      cost: Yup.number().optional(),
      //maxdiscount: Yup.number().positive(),
      max: Yup.number(),
      min: Yup.number(),
      //picture: Yup.string(),
      idTax: Yup.number(),
      idCategory: Yup.number().required(),
      idCurrency: Yup.number().required(),
      idBrand: Yup.number().required(),
      //isKit: Yup.boolean().default(false),
      //isStockable: Yup.boolean().default(false),
      //status: Yup.boolean().default(true)
    }),

    validate: values => {},
    onSubmit: async (values, helpers) => {
      try {
        const tc = currencies.find(x => x.id === values.idCurrency);
        values.pricepesos = values.price * tc.rate ?? 1;
        if (values.id && values.id > 0) {
          await authService.putData(`product/${values.id}`, values);
        } else {
          await authService.postData('product', values);
        }
        getProducts();
        router.push('/products');
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
        <CardHeader subheader="Detalles de producto" title="Producto" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.barcode && formik.errors.barcode)}
                  fullWidth
                  helperText="Código"
                  label="Código"
                  name="codename"
                  id="codename"
                  onBlur={formik.handleBlur}
                  onChange={e => {
                    formik.setFieldValue('codename', e.target.value);
                    formik.setFieldValue('barcode', e.target.value);
                  }}
                  value={formik.values.codename}
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
                  error={!!(formik.touched.barcode && formik.errors.barcode)}
                  helperText={formik.touched.barcode && formik.errors.barcode}
                  fullWidth
                  label="Código de barras"
                  name="barcode"
                  id="barcode"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.barcode}
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
                  value={formik.values.idCurrency}
                >
                  {currencies &&
                    currencies.map(g => {
                      return (
                        <MenuItem key={g.id} value={g.id}>
                          {g.description}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.price && formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  fullWidth
                  label="Precio"
                  name="price"
                  id="price"
                  onBlur={formik.handleBlur}
                  onChange={e => {
                    const value = e.target.value;
                    const tc = currencies.find(
                      x => x.id === formik.values.idCurrency,
                    );
                    if (tc) {
                      formik.setFieldValue('price', value);
                      formik.setFieldValue('pricepesos', value * tc?.rate ?? 1);
                    }
                  }}
                  type="price"
                  required
                  value={formik.values.price}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={
                    !!(formik.touched.pricepesos && formik.errors.pricepesos)
                  }
                  helperText={
                    formik.touched.pricepesos && formik.errors.pricepesos
                  }
                  fullWidth
                  label="Precio pesos"
                  name="pricepesos"
                  id="pricepesos"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="pricepesos"
                  required
                  value={formik.values.pricepesos}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.prefix && formik.errors.prefix)}
                  helperText={formik.touched.prefix && formik.errors.prefix}
                  fullWidth
                  label="Costo"
                  name="cost"
                  id="cost"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="cost"
                  value={formik.values.cost}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.min && formik.errors.min)}
                  fullWidth
                  helperText={formik.touched.min && formik.errors.min}
                  label="Stock mínimo"
                  name="min"
                  id="min"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.min}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.max && formik.errors.max)}
                  fullWidth
                  helperText={formik.touched.max && formik.errors.max}
                  label="Stock máximo"
                  name="max"
                  id="max"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.max}
                />
              </Grid>

              <Grid xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  helperText={formik.touched.idBrand && formik.errors.idBrand}
                  error={!!(formik.touched.idBrand && formik.errors.idBrand)}
                  label="Marca"
                  name="idBrand"
                  id="idBrand"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.idBrand ?? null}
                >
                  {brands &&
                    brands.map(g => {
                      return (
                        <MenuItem key={g.description} value={g.id}>
                          {g.description}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  select
                  error={
                    !!(formik.touched.idCategory && formik.errors.idCategory)
                  }
                  fullWidth
                  helperText={
                    formik.touched.idCategory && formik.errors.idCategory
                  }
                  label="Categoría"
                  name="idCategory"
                  id="idCategory"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.idCategory}
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
                <TextField
                  select
                  fullWidth
                  error={!!(formik.touched.idTax && formik.errors.idTax)}
                  required
                  helperText={formik.touched.idTax && formik.errors.idTax}
                  label="Impuesto"
                  name="idTax"
                  id="idTax"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.idTax}
                >
                  {taxes &&
                    taxes.map(g => {
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

export default ProductsForm;
