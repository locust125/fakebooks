import PropTypes from 'prop-types';
import { Button, Card, MenuItem, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import authService from 'src/services/auth-service';
import { useFormik } from 'formik';
import SynchronizationDialog from 'src/components/sampleLinks';

const SearchByGroupValidationSchema = Yup.object().shape({
  date: Yup.date()
    .max(new Date(), 'La fecha no puede ser mayor a la actual')
    .required('La fecha es necesaria')
    .typeError('La fecha ingresada no es valida'),
  location: Yup.string().required('La locacion es necesaria'),
  tour: Yup.string().required('El tour es necesario'),
  group: Yup.string().required('El grupo es necesario'),
});

const formatFecha = fecha => {
  const partes = fecha.split('-');
  return partes.join('');
};

const GrupSearchBar = props => {
  const { items = [], handleSubmit = () => {} } = props;
  const [searchResults, setSearchResults] = useState([]);

  const formik = useFormik({
    initialValues: {
      date: '',
      location: '',
      tour: '',
      group: '',
    },
    validationSchema: SearchByGroupValidationSchema,
    onSubmit: values => {
      const { date, group } = values;
      const payload = {
        date: formatFecha(date),
        group,
      };

      handleSubmit(payload);
    },
  });

  useEffect(() => {
    const searchReady = Boolean(
      formik.values.date && formik.values.location && formik.values.tour,
    );

    if (searchReady) {
      const fechaFormateada = formatFecha(formik.values.date);

      const endpoint = `photography/groups/${fechaFormateada}/${formik.values.location}/${formik.values.tour}`;

      authService
        .getData(endpoint)
        .then(response => {
          formik.setFieldValue('group', '');
          setSearchResults(response);
        })
        .catch(error => {
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.date, formik.values.location, formik.values.tour]);

  return (
    <Card sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }} // cambia la dirección a column en dispositivos xs y a row en tabletas
        spacing={2}
        justifyContent={'flex-end'}
        sx={{ p: { xs: 0, md: 2 } }} // ajusta el padding
      >
        <TextField
          id="date"
          name="date"
          type="date"
          placeholder="Search customer"
          error={Boolean(formik.touched.date && formik.errors.date)}
          helperText={formik.touched.date && formik.errors.date}
          sx={{ minWidth: 200 }}
          InputLabelProps={{
            shrink: false,
          }}
          value={formik.values.date}
          onChange={formik.handleChange}
        />

        <TextField
          label="Locacion"
          sx={{ minWidth: 200 }}
          select
          id="location"
          name="location"
          error={Boolean(formik.touched.location && formik.errors.location)}
          helperText={formik.touched.location && formik.errors.location}
          value={formik.values.location}
          onChange={formik.handleChange}
        >
          {items.map(item => (
            <MenuItem key={item.id} value={item.description}>
              {item.description}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Tour"
          sx={{ minWidth: 200 }}
          select
          id="tour"
          name="tour"
          error={Boolean(formik.touched.tour && formik.errors.tour)}
          helperText={formik.touched.tour && formik.errors.tour}
          value={formik.values.tour}
          onChange={formik.handleChange}
        >
          <MenuItem value="TOUR1">TOUR1</MenuItem>
          <MenuItem value="TOUR2">TOUR2</MenuItem>
          <MenuItem value="TOUR3">TOUR3</MenuItem>
          <MenuItem value="TOUR4">TOUR4</MenuItem>
          <MenuItem value="TOUR5">TOUR5</MenuItem>
          <MenuItem value="TOUR6">TOUR6</MenuItem>
        </TextField>

        <TextField
          label="Grupo"
          sx={{ minWidth: 200 }}
          select
          id="group"
          name="group"
          error={Boolean(formik.touched.group && formik.errors.group)}
          helperText={
            (formik.touched.group && formik.errors.group) ||
            (searchResults.length === 0 && 'No hay grupos disponibles')
          }
          value={formik.values.group}
          onChange={formik.handleChange}
          disabled={
            !Boolean(
              formik.values.date &&
                formik.values.location &&
                formik.values.tour,
            )
          }
        >
          {searchResults.map(result => (
            <MenuItem key={result.UserCodeID} value={result.UserCodeID}>
              {result.UserCodeID}
            </MenuItem>
          ))}
        </TextField>

        <Button onClick={formik.handleSubmit}>Buscar</Button>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        justifyContent={'flex-end'}
        sx={{ marginTop: 2 }}
      >
        <SynchronizationDialog
          customerCode={formik.values.group}
          eventDate={formik.values.date}
          visible={
            formik.values.date &&
            formik.values.location &&
            formik.values.tour &&
            formik.values.group
          }
        />
      </Stack>
    </Card>
  );
};

GrupSearchBar.propTypes = {
  items: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
};

export default GrupSearchBar;
