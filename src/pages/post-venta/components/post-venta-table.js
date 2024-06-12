import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { formatValue } from 'src/utils/format-catalog-data';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import PostVenta from 'src/components/postVenta';
import { useCatalogs } from 'src/hooks/use-catalogs';
import { useMemo } from 'react';
import CancelPostVenta from 'src/components/cancelPosrVenta';

const SalesTable = props => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [userPathPrefix, setUserPathPrefix] = useState('');

  useEffect(() => {
    if (items.length > 0) {
      const firstItemUserPath = items[0].userPath;
      const parts = firstItemUserPath.split('/');
      const prefix = parts[0];
      setUserPathPrefix(prefix);
    }
  }, [items]);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  // Select User
  const useUsers = () => {
    const { state } = useCatalogs();
    const data = state.users?.data;

    return useMemo(() => {
      return data || [];
    }, [data]);
  };
  const dataList = useUsers();

  // Select Products
  const useProducts = () => {
    const { state } = useCatalogs();
    const data = state.products?.data;

    return useMemo(() => {
      return data || [];
    }, [data]);
  };
  const dataListP = useProducts();

  // Select Paymethod
  const usePaymethod = () => {
    const { state } = useCatalogs();
    const data = state.paymethod?.data;

    return useMemo(() => {
      return data || [];
    }, [data]);
  };
  const dataListPm = usePaymethod();

  return (
    <Card sx={{ marginTop: 0 }}>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={event => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Nombre de usuario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>ID Transacción</TableCell>
                <TableCell>Codígo de usuario</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Venta</TableCell>
                <TableCell>Cancelar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => {
                const isSelected = selected.includes(item.id);
                return (
                  <TableRow hover key={item.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={event => {
                          if (event.target.checked) {
                            onSelectOne?.(item.id);
                          } else {
                            onDeselectOne?.(item.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{item.userName}</TableCell>
                    <TableCell>
                      {formatValue(item.tdate, 'dateAndHour')}
                    </TableCell>
                    <TableCell>
                      {item.email
                        .split(';')
                        .map(email => email.trim())
                        .filter(email => email !== '')
                        .map((email, index) => (
                          <Chip
                            key={index}
                            label={email}
                            style={{ marginRight: '5px', marginBottom: '5px' }}
                          />
                        ))}
                    </TableCell>
                    <TableCell>{item.statusDescription}</TableCell>
                    <TableCell>{item.idTransaction}</TableCell>
                    <TableCell>{item.userCode}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                      <Link
                        href={`https://mylink.fractalphotos.com/#/${userPathPrefix}/sample/${item.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Tooltip title="Ver" placement="top">
                          <Button
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            variant="contained"
                          >
                            <SvgIcon fontSize="small">
                              <EyeIcon />
                            </SvgIcon>
                          </Button>
                        </Tooltip>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <PostVenta
                        xs={12}
                        md={6}
                        items={dataList}
                        itemsP={dataListP}
                        itemsPm={dataListPm}
                        customerCode={item.userCode}
                        email={item.email}
                        userPath={item.userPath}
                        idPost={item.id}
                      />
                    </TableCell>
                    <TableCell>
                      <CancelPostVenta name={item.userCode} idPost={item.id} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

SalesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};

export default SalesTable;
