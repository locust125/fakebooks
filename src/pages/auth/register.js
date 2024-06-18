import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';

const Page = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      password: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Debe ser un email válido')
        .max(255)
        .required('El email es requerido'),
      name: Yup.string().max(255).required('El nombre es requerido'),
      password: Yup.string().max(255).required('La contraseña es requerida'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const response = await axios.post('http://localhost:3000/signUpUser', {
          name: values.name,
          email: values.email,
          password: values.password,
        });

        localStorage.setItem('userinfo', JSON.stringify(response.data));

        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Register | Fractal Photos</title>
      </Head>
      <Box
        sx={{
          backgroundImage: 'url(/fondoTree.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 2,
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
              textAlign: 'center',
            }}
          >
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Registrarse</Typography>
              <Typography color="text.secondary" variant="body2">
                ¿Ya tienes una cuenta? &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Iniciar sesión
                </Link>
              </Typography>
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nombre"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  variant="outlined"
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo Electrónico"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                  variant="outlined"
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Contraseña"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                  variant="outlined"
                />
              </Stack>
              {formik.errors.submit && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {formik.errors.submit}
                </Alert>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continuar
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <>{page}</>;

export default Page;
