import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import { Stack, Button, SvgIcon } from '@mui/material';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { convertStructure } from 'src/utils/format-catalog-data';
import { exportDataToXlsx } from 'src/utils/create-report';

const ExportButton = props => {
  const { fields, data, formatConfig = {} } = props;
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (fields !== null && data !== null) setDisabled(false);
  }, [fields, data]);

  const onClickHandler = () => {
    if (!fields || !data || fields === null || data === null) return;

    const formatedData = convertStructure(data, fields, formatConfig);

    exportDataToXlsx(formatedData).then(blob => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <Stack alignItems="center" direction="row" spacing={1}>
      <Button
        color="inherit"
        disabled={disabled}
        onClick={onClickHandler}
        startIcon={
          <SvgIcon fontSize="small">
            <ArrowDownOnSquareIcon />
          </SvgIcon>
        }
      >
        Exportar
      </Button>
    </Stack>
  );
};

ExportButton.propTypes = {
  fields: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  formatConfig: PropTypes.object,
};

ExportButton.defaultProps = {
  fields: null,
  data: null,
  formatConfig: {},
};

export default ExportButton;
