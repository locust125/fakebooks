import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  CardHeader,
  CircularProgress,
  Container,
  Unstable_Grid2 as Grid,
  SvgIcon,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import authService from 'src/services/auth-service';
import { getDaysInMonth, getMonthSales } from 'src/utils/get-month-sales';
import { useCatalogs } from 'src/hooks/use-catalogs';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import useLoading from 'src/hooks/use-loading';

const now = new Date();

const Page = () => {
  const { state } = useCatalogs();
  const [data, setData] = useState({});
  const [refreshTable, setRefreshTable] = useState(0);

  const { isLoading, setIsLoadingFalse, setIsLoadingTrue } = useLoading({
    defaultState: false,
  });

  const handleSyncClick = () => {
    setRefreshTable(refreshTable + 1);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [refreshTable]);

  async function fetchData() {
    setIsLoadingTrue();
    const d = await authService.getData('dashboard/sales/stats');
    if (d) {
      setData(d);
    }
    setIsLoadingFalse();
  }

  return (
    <>
      <Head>
        <title>Fractal photos</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <CardHeader
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowPathIcon />
                  </SvgIcon>
                }
                onClick={handleSyncClick}
              >
                Actualizar
              </Button>
            }
            title="Sales"
          />
          {isLoading && (
            <Box
              component="section"
              display="grid"
              sx={{ placeContent: 'center', mt: 0, p: 4 }}
            >
              <CircularProgress />
            </Box>
          )}
          <Grid container spacing={3} sx={{ opacity: isLoading ? 0 : 1 }}>
            <Grid xs={12} sm={6} lg={4}>
              <OverviewBudget
                key={refreshTable} // Añadimos una clave única para forzar la actualización del componente
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={data.salesToday?.toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                })}
                caption={'Ventas hoy'}
              />
            </Grid>

            <Grid xs={12} sm={6} lg={4}>
              <OverviewBudget
                key={refreshTable}
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={data.salesThisWeek?.toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                })}
                caption={'Ventas esta semana'}
              />
            </Grid>

            <Grid xs={12} sm={6} lg={4}>
              <OverviewBudget
                key={refreshTable}
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={data.salesThisMonth?.toLocaleString('es-MX', {
                  style: 'currency',
                  currency: 'MXN',
                })}
                caption={'Ventas este mes'}
              />
            </Grid>

            <Grid xs={12} lg={12}>
              <OverviewSales
                key={refreshTable} // Añadimos una clave única para forzar la actualización del componente
                chartSeries={[
                  {
                    name: 'This year',
                    data: getMonthSales(data.salesThisMonthRows, 10, 2023),
                  },
                ]}
                chartLabels={getDaysInMonth(10, 2023)}
                sx={{ height: '100%' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
