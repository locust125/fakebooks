import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Button, Collapse, Stack, SvgIcon, TextField } from '@mui/material';
import PropTypes, { bool } from 'prop-types';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from 'src/services/auth-service';
import { useEffect, useState } from 'react';

const salesDateFilterValidationSchema = Yup.object({
  initDate: Yup.date()
    .max(Yup.ref('endDate'), 'La fecha de inicio debe ser menor a la termino')
    .required('Es necesaria una fecha de inicio'),
  endDate: Yup.date()
    .min(
      Yup.ref('initDate'),
      'La fecha de termino debe ser mayor a la de inicio',
    )
    .max(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
      ),
      'La fecha de termino no puede ser mayor al día de hoy',
    )
    .required('Es necesaria una fecha de termino'),
});

export default function SalesDateFilterForm(props) {
  const { isOpen, handleSubmit } = props;
  const formik = useFormik({
    initialValues: { initDate: new Date(), endDate: new Date() },
    validationSchema: salesDateFilterValidationSchema,
    onSubmit: async values => {
      let newValues = {};
      newValues = {
        initDate: new Date(values.initDate)
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, ''),
        endDate: new Date(values.endDate)
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, ''),
      };

      handleSubmit(newValues);
    },
  });

  return (
    <Collapse sx={{ width: '100%' }} in={isOpen}>
      <form
        onSubmit={formik.handleSubmit}
        style={{
          width: '100%',
        }}
      >
        <Stack spacing={1} direction="row" width="100%" marginBottom={1}>
          <DatePicker
            label="Fecha de inicio"
            value={formik.values.initDate}
            onChange={value => {
              formik.setFieldValue('initDate', value);
            }}
            maxDate={formik.values.endDate}
            renderInput={params => (
              <TextField
                name="initDate"
                size="small"
                helperText={formik.errors && formik.errors.initDate}
                {...params}
              />
            )}
          />
          <DatePicker
            label="Fecha de termino"
            value={formik.values.endDate}
            minDate={formik.values.initDate}
            maxDate={new Date()}
            onChange={value => {
              formik.setFieldValue('endDate', value);
            }}
            renderInput={params => (
              <TextField
                name="endDate"
                size="small"
                helperText={formik.errors.endDate}
                {...params}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            style={{
              height: 'fit-content',
            }}
            startIcon={
              <SvgIcon fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            }
          >
            Buscar
          </Button>
        </Stack>
      </form>
    </Collapse>
  );
}

SalesDateFilterForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

SalesDateFilterForm.defaultProps = {
  isOpen: false,
  handleSubmit: null,
};
