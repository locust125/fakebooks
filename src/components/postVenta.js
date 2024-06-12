import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import * as PropTypes from 'prop-types';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Button, MenuItem, SvgIcon, TextField } from '@mui/material';
import authService from 'src/services/auth-service';
import ShoppingCartIcon from '@heroicons/react/24/solid/ShoppingCartIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';

const postVentaSchemaValidation = Yup.object({
  mpuserId: Yup.number()
    .min(1, 'Valor invalido')
    .required('El usuario es requerido'),
  productId: Yup.number()
    .min(1, 'Valor invalido')
    .required('El producto es requerido'),
  paymethodId: Yup.number()
    .min(1, 'Valor invalido')
    .required('El método de pago es requerido'),
  total: Yup.number()
    .min(1, 'Valor invalido')
    .required('El monto es requerido'),
});

export default function PostVenta(props) {
  const {
    items = [],
    itemsP = [],
    itemsPm = [],
    customerCode,
    email,
    userPath,
    idPost,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState(null);
  const [confirmClicked, setConfirmClicked] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      mpuserId: '',
      productId: '',
      paymethodId: '',
      total: 0,
    },
    validationSchema: postVentaSchemaValidation,
    onSubmit: values => {
      const { mpuserId, productId, paymethodId, total } = values;

      const dataToSend = {
        customerCode,
        userPath,
        email,
        mpuserId,
        paymethodId,
        productId,
        total,
      };

      authService
        .postData(`transaction/samplemailtransaction`, dataToSend)
        .then(response => {
          console.log('Sincronización exitosa', response);
          setSyncResult({ success: true });
          handleConfirm();
        })
        .catch(error => {
          console.error('Error en la sincronización', error);
          setSyncResult({ success: false, error });
        })
        .finally(() => {
          setOpen(false); // Cerrar el diálogo después de la solicitud
        });
    },
  });

  const handleConfirm = () => {
    authService
      .putData(`photosamplemail/close/${idPost}`)
      .then(response => {
        console.log('Venta exitosa', response);
        setSyncResult({ success: true });
        setTimeout(() => {
          window.location.reload();
        }, 900);
      })
      .catch(error => {
        console.error('Error al cerrar venta, intente mas tarde', error);
        setSyncResult({ success: false, error });
      })
      .finally(() => {
        setOpen(true);
        setConfirmClicked(true);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setSyncResult(null);
  };

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  useEffect(() => {
    const calcTotal = () => {
      const { productId, paymethodId } = formik.values;
      if (!productId || !paymethodId || isNaN(productId) || isNaN(paymethodId))
        return;

      const product = itemsP.find(item => item.id === productId);
      const paymethod = itemsPm.find(item => item.id === paymethodId);

      formik.setFieldValue(
        'total',
        product.pricepesos / paymethod.currency.rate,
      );
    };

    calcTotal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.productId, formik.values.paymethodId]);

  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        variant="contained"
      >
        <SvgIcon fontSize="small">
          <ShoppingCartIcon />
        </SvgIcon>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Generar link`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Por favor, seleccione las opciones en los campos siguientes:
          </DialogContentText>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            gap={2}
            mt={2}
          >
            <TextField
              id="mpuserId"
              name="mpuserId"
              label="Users"
              error={formik.touched.mpuserId && Boolean(formik.errors.mpuserId)}
              helperText={formik.touched.mpuserId && formik.errors.mpuserId}
              select
              fullWidth
              value={formik.values.mpuserId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {items.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="productId"
              name="productId"
              label="Productos"
              error={
                formik.touched.productId && Boolean(formik.errors.productId)
              }
              helperText={formik.touched.productId && formik.errors.productId}
              select
              fullWidth
              value={formik.values.productId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {itemsP.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.description}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="paymethodId"
              name="paymethodId"
              label="Método de Pago"
              error={
                formik.touched.paymethodId && Boolean(formik.errors.paymethodId)
              }
              helperText={
                formik.touched.paymethodId && formik.errors.paymethodId
              }
              select
              fullWidth
              value={formik.values.paymethodId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {itemsPm.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  {item.description}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              label="Total"
              name="total"
              id="total"
              value={formik.values.total}
              error={formik.touched.total && Boolean(formik.errors.total)}
              helperText={formik.touched.total && formik.errors.total}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            onClick={formik.handleSubmit}
            disabled={syncResult && syncResult.success}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

PostVenta.propTypes = {
  items: PropTypes.array.isRequired,
  itemsP: PropTypes.array.isRequired,
  itemsPm: PropTypes.array.isRequired,
  customerCode: PropTypes.string,
  email: PropTypes.string,
  userPath: PropTypes.string,
  idPost: PropTypes.number, // Changed from PropTypes.int to PropTypes.number
};
