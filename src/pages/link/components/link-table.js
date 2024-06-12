import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Stack,
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
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import { SvgIcon } from '@mui/material';
import UpdateLink from '../edit';

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

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const handleOpenLinkInNewTab = (event, url) => {
    event.preventDefault();
    window.open(url, '_blank');
  };

  return (
    <Card style={{ marginTop: '0' }}>
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
                <TableCell>Fecha</TableCell>
                <TableCell>Actividad</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Fecha De Expiracion</TableCell>
                <TableCell>Fotos Subidas</TableCell>
                <TableCell>Codigo Cliente</TableCell>
                <TableCell>Locacion</TableCell>
                <TableCell>Ticket</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => {
                const isSelected = selected.includes(item.idTransaction);
                return (
                  <TableRow
                    hover
                    key={item.idTransaction}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={event => {
                          if (event.target.checked) {
                            onSelectOne?.(item.idTransaction);
                          } else {
                            onDeselectOne?.(item.idTransaction);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatValue(item.fecha, 'date')} </TableCell>
                    <TableCell>{item.actividad}</TableCell>
                    <TableCell>{item.horario}</TableCell>
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
                    <TableCell>
                      {formatValue(item.fechaExpiracion, 'date')}
                    </TableCell>
                    <TableCell>{item.FotosSubidas}</TableCell>
                    <TableCell>{item.CodigoCliente}</TableCell>
                    <TableCell>{item.Locacion}</TableCell>
                    <TableCell>{item.Ticket}</TableCell>
                    <TableCell>{item.Total}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Link
                          href={item.codigo}
                          onClick={event =>
                            handleOpenLinkInNewTab(event, item.codigo)
                          }
                        >
                          <Tooltip title="Ver" placement="top">
                            <Button
                              style={{
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
                        <div style={{ marginTop: '8px' }}>
                          <UpdateLink
                            id={item.id}
                            cliente={item.CodigoCliente}
                          />
                        </div>
                      </div>
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
