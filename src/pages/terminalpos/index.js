import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import TerminalPosTable from 'src/pages/terminalpos/components/terminalpos-table';
import { useCatalogs } from 'src/hooks/use-catalogs';
import ExportButton from 'src/components/export-button';
import SynchronizationDialog from 'src/components/synchronizationDialog';
import { CATALOGS_FIELDS } from 'src/utils/catalogs-report-fields';

const now = new Date();

const useTerminalPos = (page, rowsPerPage) => {
  const { state } = useCatalogs();

  const data = state.terminalpos?.data;

  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const usePosIds = data => {
  return useMemo(() => {
    return data.map(d => d.id);
  }, [data]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const posData = useTerminalPos(page, rowsPerPage);
  const posIds = usePosIds(posData);
  const terminalposSelection = useSelection(posIds);
  const { state } = useCatalogs();

  const data = state.terminalpos?.data;
  const filteredData = state.terminalpos?.filteredData;

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

  return (
    <>
      <Head>
        <title>Cajas</title>
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
                <Typography variant="h4">Cajas</Typography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ExportButton
                    style={{ marginRight: '8px' }}
                    fields={CATALOGS_FIELDS.USER_FIELDS}
                    data={data}
                  />
                  <SynchronizationDialog
                    name="las cajas"
                    endpoint="terminalpos"
                  />
                </div>
              </Stack>
              <div>
                <Link href={'/terminalpos/add'}>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Nuevo
                  </Button>
                </Link>
              </div>
            </Stack>
            <TerminalPosTable
              count={data.length}
              items={posData}
              onDeselectAll={terminalposSelection.handleDeselectAll}
              onDeselectOne={terminalposSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={terminalposSelection.handleSelectAll}
              onSelectOne={terminalposSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={terminalposSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
