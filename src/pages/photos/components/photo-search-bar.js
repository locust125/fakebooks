import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Button, Card, MenuItem, TextField, Grid, Box } from '@mui/material';
import { useFormik } from 'formik';

const photosFormValidateSchema = Yup.object({
  date: Yup.date('La fecha de busqueda es necesaria')
    .max(
      new Date(),
      'La fecha de busqueda no puede ser mayor a la fecha actual',
    )
    .required('La fecha de busqueda es necesaria')
    .typeError('La fecha de busqueda no es valida'),
  init_hour: Yup.string().required('La hora de inicio es necesaria'),
  end_hour: Yup.string().required('La hora de termino es necesaria'),
  location: Yup.string().required('La locación es necesaria'),
});

const PhotoSearchBar = props => {
  const { items = [], handleSubmit } = props;

  const formik = useFormik({
    initialValues: {
      date: '',
      init_hour: '08:00',
      end_hour: '23:00',
      location: '',
    },
    validationSchema: photosFormValidateSchema,
    onSubmit: async values => {
      const finalValues = {
        init_date: new Date(`${values.date}T${values.init_hour}`)
          .toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' })
          .split(' ')
          .join('T'),
        end_date: new Date(`${values.date}T${values.end_hour}`)
          .toLocaleString('sv-SE', { timeZone: 'America/Mexico_City' })
          .split(' ')
          .join('T'),
        location: values.location,
      };

      handleSubmit(finalValues);
    },
  });

  return (
    <Card sx={{ p: 2 }}>
      <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Box textAlign="center">Date</Box>
        </Grid>
        <Grid item>
          <TextField
            id="date"
            name="date"
            type="date"
            placeholder="Search customer"
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            max={new Date()}
            sx={{ minWidth: 200 }}
            InputLabelProps={{
              shrink: false,
            }}
            value={formik.values.date}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item>
          <Box textAlign="center">de</Box>
        </Grid>
        <Grid item>
          <TextField
            id="init_hour"
            name="init_hour"
            label="Hora"
            type="time"
            error={formik.touched.init_hour && Boolean(formik.errors.init_hour)}
            helperText={formik.touched.init_hour && formik.errors.init_hour}
            sx={{ minWidth: 200 }}
            InputLabelProps={{
              shrink: true,
            }}
            value={formik.values.init_hour}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item>
          <Box textAlign="center">a</Box>
        </Grid>
        <Grid item>
          <TextField
            id="end_hour"
            name="end_hour"
            label="Hora"
            type="time"
            error={formik.touched.end_hour && Boolean(formik.errors.end_hour)}
            helperText={formik.touched.end_hour && formik.errors.end_hour}
            sx={{ minWidth: 200 }}
            InputLabelProps={{
              shrink: true,
            }}
            value={formik.values.end_hour}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            id="location"
            name="location"
            label="Locacion"
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            sx={{ minWidth: 200 }}
            select
            value={formik.values.location}
            onChange={formik.handleChange}
          >
            {items.map(item => (
              <MenuItem key={item.id} value={item.description}>
                {item.description}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <Button onClick={formik.handleSubmit}>Buscar</Button>
        </Grid>
      </Grid>
    </Card>
  );
};

PhotoSearchBar.propTypes = {
  items: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default PhotoSearchBar;
