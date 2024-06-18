import { useCallback, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
  Divider,
  Container,
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState('email');
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para controlar la carga del formulario

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Debe ser un email válido')
        .max(255)
        .required('El email es requerido'),
      password: Yup.string().max(255).required('La contraseña es requerida'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        setIsSubmitting(true); // Establecer isLoading a true al iniciar la carga
        const data = await auth.signIn(values.email, values.password);
        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({
          submit: 'Error de acceso, usuario y/o contraseña no válidos',
        });
      } finally {
        setIsSubmitting(false); // Establecer isLoading a false después de cargar los datos (éxito o fallo)
      }
    },
  });

  const handleMethodChange = useCallback((event, value) => {
    setMethod(value);
  }, []);

  return (
    <>
      <Head>
        <title>Acceso | Fractal photos</title>
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
            minHeight: '100vh',
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
            {' '}
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Acceso</Typography>
              <Typography color="text.secondary" variant="body2">
                Ingrese sus datos para acceder a su cuenta
              </Typography>
            </Stack>
            <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />
            </Tabs>
            {method === 'email' && (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="email"
                    value={formik.values.email}
                    variant="outlined"
                  />
                  <TextField
                    error={
                      !!(formik.touched.password && formik.errors.password)
                    }
                    fullWidth
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                    variant="outlined"
                  />
                  {formik.errors.submit && (
                    <Alert severity="error">{formik.errors.submit}</Alert>
                  )}
                  <Button
                    fullWidth
                    size="large"
                    sx={{ mt: 1 }}
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={24} />}
                  >
                    {isSubmitting ? 'Cargando...' : 'Entrar'}
                  </Button>
                </Stack>
              </form>
            )}
            <Divider sx={{ my: 3 }} />
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={() => router.push('/auth/register')}
            >
              Registrarse
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <>{page}</>;

export default Page;
