import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Button, Collapse, Stack, SvgIcon, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const salesDateFilterValidationSchema = Yup.object({
  query: Yup.string().required('Es necesaria la busqueda'),
});

export default function PostVentaFilterForm(props) {
  const { isOpen, handleSubmit } = props;
  const formik = useFormik({
    initialValues: { query: '' },
    validationSchema: salesDateFilterValidationSchema,
    onSubmit: async values => {
      handleSubmit(values);
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
          <TextField
            fullWidth
            id="query"
            name="query"
            label="Buscar"
            placeholder="Busqueda"
            variant="filled"
            size="medium"
            value={formik.values.query}
            onChange={formik.handleChange}
            error={formik.touched.query && Boolean(formik.errors.query)}
            helperText={formik.touched.query && formik.errors.query}
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

PostVentaFilterForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

PostVentaFilterForm.defaultProps = {
  isOpen: false,
  handleSubmit: null,
};
