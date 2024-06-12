import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import SalesTable from './components/link-table';
import ExportButton from 'src/components/export-button';
import { CATALOGS_FIELDS } from 'src/utils/catalogs-report-fields';
import { CATALOGS_FORMAT_CONFIG } from 'src/utils/catalogs-report-formats-config';
import authService from 'src/services/auth-service';
import FilterForm from './components/filter-form';
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
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [linkReport, setinkReport] = useState('linkDetailToday');
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);

  const { isLoading, setIsLoadingFalse, setIsLoadingTrue } = useLoading({
    defaultState: false,
  });

  const dataList = useSales(data, page, rowsPerPage, linkReport);
  const ids = useIds(dataList);
  const salesSelection = useSelection(ids);

  const handleChangePeriod = useCallback((event, periodSelected) => {
    if (periodSelected !== null) {
      setinkReport(periodSelected);
      setPage(0);
      setIsSearchBarVisible(periodSelected === 'linkSearch');
    }
  }, []);

  const handleFetchData = useCallback(async () => {
    let dataResponse;

    switch (linkReport) {
      case 'linkDetailToday':
        setIsLoadingTrue();
        dataResponse = await authService
          .getData('reporting/linksdetail/today')
          .finally(() => {
            setIsLoadingFalse();
          });
        break;
      case 'linkDetailWeek':
        setIsLoadingTrue();
        dataResponse = await authService
          .getData('reporting/linksdetail/thisweek')
          .finally(() => {
            setIsLoadingFalse();
          });
        break;
      case 'linkDetailMonth':
        setIsLoadingTrue();

        dataResponse = await authService
          .getData('reporting/linksdetail/thismonth')
          .finally(() => {
            setIsLoadingFalse();
          });
        break;

      case 'linkSearch':
        dataResponse = {};
        setFilterIsOpen(true);
        break;
    }
    setData(dataResponse);
    setFilteredData(dataResponse);
  }, [linkReport]);

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
      .getData(`reporting/linksdetail/custom/${values.query}`)
      .finally(() => {
        setIsLoadingFalse();
      });
    setData(data);
    setFilteredData(data);
  }, []);

  useEffect(() => {
    handleFetchData();
  }, [handleFetchData]);

  const handleSearchResultsChange = useCallback(searchResults => {
    setData(searchResults);
  }, []);

  return (
    <>
      <Head>
        <title>Reporte de Links</title>
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
                <Typography variant="h4">Reporte de Link</Typography>
                <ExportButton
                  fields={CATALOGS_FIELDS.POST_LINK}
                  data={data}
                  formatConfig={CATALOGS_FORMAT_CONFIG.SALES_FORMAT}
                />
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Stack
                alignItems="flex-end"
                justifyContent="flex-end"
                sx={{ flexGrow: 1 }}
              >
                <ToggleButtonGroup
                  color="standard"
                  value={linkReport}
                  onChange={handleChangePeriod}
                  exclusive={true}
                >
                  <ToggleButton value="linkDetailToday">Hoy</ToggleButton>
                  <ToggleButton value="linkDetailWeek">
                    Esta semana
                  </ToggleButton>
                  <ToggleButton value="linkDetailMonth">Este mes</ToggleButton>
                  <ToggleButton value="linkSearch">Personalizado</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>

            <Stack alignItems="flex-start" justifyContent="flex-start">
              {isSearchBarVisible && (
                <FilterForm isOpen={filterIsOpen} handleSubmit={handleFilter} />
              )}
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
