import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import SalesTable from './components/post-venta-table';
import ExportButton from 'src/components/export-button';
import { CATALOGS_FIELDS } from 'src/utils/catalogs-report-fields';
import { CATALOGS_FORMAT_CONFIG } from 'src/utils/catalogs-report-formats-config';
import authService from 'src/services/auth-service';
import { useCatalogs } from 'src/hooks/use-catalogs';
import PostVentaFilterForm from './components/post-venta-filter-form';

const now = new Date();

const usePostVenta = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useIds = data => {
  return useMemo(() => {
    return data.map(d => d.id);
  }, [data]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filter, setFilter] = useState('sent');
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const dataList = usePostVenta(data, page, rowsPerPage, filter);
  const ids = useIds(dataList);
  const postVentaSelection = useSelection(ids);

  const handleChangeFilter = useCallback((event, filter) => {
    if (filter !== null) {
      setFilter(filter);
      setPage(0);
    }
  }, []);

  const handleFetchData = useCallback(async () => {
    let dataResponse;
    setIsLoading(true); // Establecer isLoading a true al iniciar la carga

    switch (filter) {
      case 'sent':
        dataResponse = await authService.getData('photosamplemail');
        break;
      case 'paid':
        dataResponse = await authService.getData('photosamplemail/closed');
        break;
      case 'canceled':
        dataResponse = await authService.getData('photosamplemail/cancelled');
        break;
      case 'personalized':
        dataResponse = {};
        setFilterIsOpen(true);
        break;
    }
    setIsLoading(false); // Establecer isLoading a false después de cargar los datos
    setData(dataResponse);
    setFilteredData(dataResponse);
  }, [filter]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback(event => {
    setPage(0);
    setRowsPerPage(event.target.value);
  }, []);

  const handleFilter = useCallback(async values => {
    setIsLoading(true); // Establecer isLoading a true al iniciar la carga
    const data = await authService.getData(
      `photosamplemail/search/${values.query}`,
    );
    setIsLoading(false); // Establecer isLoading a false después de cargar los datos
    setData(data);
    setFilteredData(data);
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <>
      <Head>
        <title>Post Venta</title>
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
                <Typography variant="h4">Post Venta</Typography>
                <ExportButton
                  fields={CATALOGS_FIELDS.POST_VENTA_FIELDS}
                  formatConfig={CATALOGS_FORMAT_CONFIG.POST_VENTA_FORMAT}
                  data={data}
                />
              </Stack>
            </Stack>
            <Stack spacing={1} alignItems="flex-end" justifyContent="flex-end">
              <ToggleButtonGroup
                color="standard"
                value={filter}
                onChange={handleChangeFilter}
                exclusive={true}
              >
                <ToggleButton value="sent">Enviados</ToggleButton>
                <ToggleButton value="paid">Pagadas</ToggleButton>
                <ToggleButton value="canceled">Canceladas</ToggleButton>
                <ToggleButton value="personalized">Personalizado</ToggleButton>
              </ToggleButtonGroup>
              <PostVentaFilterForm
                isOpen={filterIsOpen}
                handleSubmit={handleFilter}
              />
            </Stack>

            {isLoading ? (
              <Box
                component="section"
                display="grid"
                sx={{ placeContent: 'center', mt: 0, p: 2 }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <SalesTable
                count={data?.length}
                items={dataList}
                onDeselectAll={postVentaSelection.handleDeselectAll}
                onDeselectOne={postVentaSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={postVentaSelection.handleSelectAll}
                onSelectOne={postVentaSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={postVentaSelection.selected}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
