import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  CircularProgress,
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import SalesTable from './components/sales-table';
import ExportButton from 'src/components/export-button';
import { CATALOGS_FIELDS } from 'src/utils/catalogs-report-fields';
import { CATALOGS_FORMAT_CONFIG } from 'src/utils/catalogs-report-formats-config';
import authService from 'src/services/auth-service';
import SalesDateFilterForm from './components/sales-date-filter-form';
import useLoading from 'src/hooks/use-loading';

const now = new Date();

const useSales = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useIds = data => {
  return useMemo(() => {
    return data.map(d => d.idTransaction);
  }, [data]);
};

const Page = () => {
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [salesPeriod, setSalesPeriod] = useState('salesDetailToday');

  const { isLoading, setIsLoadingTrue, setIsLoadingFalse } = useLoading({
    defaultState: false,
  });

  const dataList = useSales(data, page, rowsPerPage, salesPeriod);
  const ids = useIds(dataList);
  const salesSelection = useSelection(ids);

  const handleChangePeriod = useCallback((event, periodSelected) => {
    if (periodSelected !== null) {
      setSalesPeriod(periodSelected);
      setPage(0);
    }
  }, []);

  const handleFetchData = useCallback(async () => {
    let dataResponse;
    setFilterIsOpen(false);

    switch (salesPeriod) {
      case 'salesDetailToday':
        setIsLoadingTrue();
        dataResponse = await authService
          .getData('reporting/salesdetail/today')
          .finally(() => {
            setIsLoadingFalse();
          });
        break;
      case 'salesDetailWeek':
        setIsLoadingTrue();
        dataResponse = await authService
          .getData('reporting/salesdetail/thisweek')
          .finally(() => {
            setIsLoadingFalse();
          });
        break;
      case 'salesDetailMonth':
        setIsLoadingTrue();
        dataResponse = await authService
          .getData('reporting/salesdetail/thismonth')
          .finally(() => {
            setIsLoadingFalse();
          });
        break;
      case 'personalized':
        dataResponse = {};
        setFilterIsOpen(true);
        break;
    }
    setData(dataResponse);
    setFilteredData(dataResponse);
  }, [salesPeriod]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleSearch = useCallback(
    (event, value) => {
      filteredData.slice(0, filteredData.length);
    },
    [filteredData],
  );

  const handleRowsPerPageChange = useCallback(event => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleFilter = useCallback(async values => {
    setIsLoadingTrue();
    const data = await authService
      .getData(
        `reporting/salesdetail/custom/${values.initDate}/${values.endDate}`,
      )
      .finally(() => {
        setIsLoadingFalse();
      });

    setPage(0);
    setData(data);
    setFilteredData(data);
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  return (
    <>
      <Head>
        <title>Reporte de ventas</title>
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
                <Typography variant="h4">Reporte de ventas</Typography>
                <ExportButton
                  fields={CATALOGS_FIELDS.SALES_FIELDS}
                  data={data}
                  formatConfig={CATALOGS_FORMAT_CONFIG.SALES_FORMAT}
                />
              </Stack>
            </Stack>
            <Stack spacing={1} alignItems="flex-end" justifyContent="flex-end">
              <ToggleButtonGroup
                color="standard"
                value={salesPeriod}
                onChange={handleChangePeriod}
                exclusive={true}
              >
                <ToggleButton value="salesDetailToday">Hoy</ToggleButton>
                <ToggleButton value="salesDetailWeek">Esta semana</ToggleButton>
                <ToggleButton value="salesDetailMonth">Este mes</ToggleButton>
                <ToggleButton value="personalized">Personalizado</ToggleButton>
              </ToggleButtonGroup>
              <SalesDateFilterForm
                isOpen={filterIsOpen}
                handleSubmit={handleFilter}
              />
            </Stack>

            {isLoading && (
              <Box
                component="section"
                display="grid"
                sx={{ placeContent: 'center', mt: 0, p: 2 }}
              >
                <CircularProgress />
              </Box>
            )}

            {!isLoading && (
              <SalesTable
                count={data?.length}
                items={dataList}
                onDeselectAll={salesSelection.handleDeselectAll}
                onDeselectOne={salesSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={salesSelection.handleSelectAll}
                onSelectOne={salesSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={salesSelection.selected}
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
