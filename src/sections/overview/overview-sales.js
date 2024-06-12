import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [
      theme.palette.primary.main,
      alpha(theme.palette.primary.main, 0.25),
    ],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: 'solid',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '40px',
      },
    },
    stroke: {
      colors: ['transparent'],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: [1, 2, 3, 4, 5],
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: value => {
          if (value === 0) {
            return '0';
          } else if (value >= 1000) {
            const formattedValue = (value / 1000).toFixed(1);
            return isFinite(formattedValue) ? `${formattedValue}K` : `${value}`;
          } else {
            return `${value}`;
          }
        },
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

export const OverviewSales = props => {
  const { chartSeries, sx, chartLabels } = props;
  const chartOptions = useChartOptions();
  chartOptions.xaxis.categories = chartLabels;

  const [refreshTable, setRefreshTable] = useState(0);
  // const handleSyncClick = () => {
  //   setRefreshTable(refreshTable + 1);
  // };

  return (
    <Card sx={sx}>
      {/* <CardHeader
        action={(
          <Button
            color="inherit"
            size="small"
            startIcon={(
              <SvgIcon fontSize="small">
                <ArrowPathIcon />
              </SvgIcon>
            )}
            // Paso 2: Asignar el controlador de eventos al botón "Sync"
            onClick={handleSyncClick}
          >
            Sync
          </Button>
        )}
        title="Sales"
      /> */}
      <CardContent>
        {/* Paso 3: Pasar el estado actualizado como prop */}
        <Chart
          key={refreshTable} // Forzar la actualización mediante una clave única
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
        >
          Overview
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewSales.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  chartLabels: PropTypes.array.isRequired,
  sx: PropTypes.object,
};
