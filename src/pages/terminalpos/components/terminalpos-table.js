import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import { SvgIcon } from '@mui/material';

const TerminalPosTable = props => {
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

  return (
    <Card>
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
                <TableCell>Code</TableCell>
                <TableCell>Almacen</TableCell>
                <TableCell>Tienda</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Prefijo</TableCell>
                <TableCell>Ticket</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(pos => {
                const isSelected = selected.includes(pos.id);
                return (
                  <TableRow hover key={pos.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={event => {
                          if (event.target.checked) {
                            onSelectOne?.(pos.id);
                          } else {
                            onDeselectOne?.(pos.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Typography variant="subtitle2">{pos.code}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {pos.warehouse && pos.warehouse.description}
                    </TableCell>
                    <TableCell>{pos.store && pos.store.storename}</TableCell>
                    <TableCell>{pos.description}</TableCell>
                    <TableCell>{pos.prefix}</TableCell>
                    <TableCell>{pos.ticket}</TableCell>

                    <TableCell>
                      <Checkbox checked={pos.status} disabled={true}></Checkbox>
                    </TableCell>
                    <TableCell>
                      <Link href={'terminalpos/edit/' + pos.id}>
                        <Button
                          startIcon={
                            <SvgIcon fontSize="small">
                              <PencilIcon />
                            </SvgIcon>
                          }
                          variant="contained"
                        >
                          Editar
                        </Button>
                      </Link>
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
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
      />
    </Card>
  );
};

TerminalPosTable.propTypes = {
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

export default TerminalPosTable;
