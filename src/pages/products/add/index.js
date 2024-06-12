import { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

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
import ProductsForm from '../components/products-form';
import { useCatalogs } from 'src/hooks/use-catalogs';

const initialState = {
  id: -1,
  codename: '',
  barcode: '',
  description: '',
  price: 0,
  cost: 0,
  idTax: null,
  picture: '',
  idCategory: null,
  maxdiscount: 0,
  idCurrency: null,
  idBrand: null,
  max: 0,
  min: 0,
  isStockable: false,
  isKit: false,
  status: true,
  pricepesos: 0,
};

const Page = () => {
  const [formData, setFormData] = useState(initialState);
  const { state } = useCatalogs();

  const categories = state.productCategory?.data;
  const currencies = state.currency?.data;
  const brands = state.brand?.data;
  const taxes = state.tax?.data;

  return (
    <>
      <Head>
        <title>Producto</title>
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
                <Typography variant="h4">Productos</Typography>
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
            <ProductsForm
              item={formData}
              categories={categories}
              brands={brands}
              taxes={taxes}
              currencies={currencies}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Page;