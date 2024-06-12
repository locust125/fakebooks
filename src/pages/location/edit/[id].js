import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import authService from 'src/services/auth-service';
import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import LocationForm from '../components/location-form';
import { useCatalogs } from 'src/hooks/use-catalogs';

const initialState = {
  id: -1,
  keyname: '',
  description: '',
  idProductCategory: 0,
  status: true,
};

async function getItem(id) {
  if (id) {
    return await authService.getData('location/' + id);
  } else {
    return initialState;
  }
}

const Page = () => {
  const [formData, setFormData] = useState(initialState);
  const router = useRouter();
  const { state } = useCatalogs();

  const categories = state.productCategory?.data;

  useMemo(() => {
    getItem(router.query.id).then(data => {
      if (data) {
        setFormData(data);
      } else {
        router.push('/404');
      }
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>Locacion</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Locacion</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Exportar
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <LocationForm item={formData} categories={categories} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
