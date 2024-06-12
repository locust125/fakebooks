import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import ReceiptPercentIcon from '@heroicons/react/24/solid/ReceiptPercentIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LinkIcon from '@heroicons/react/24/solid/LinkIcon';
import PhotoIcon from '@heroicons/react/24/solid/PhotoIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import MapPinIcon from '@heroicons/react/24/solid/MapPinIcon';
import PresentationChartBarIcon from '@heroicons/react/24/solid/PresentationChartBarIcon';
import ArchiveBoxIcon from '@heroicons/react/24/solid/ArchiveBoxIcon';
import CreditCardIcon from '@heroicons/react/24/solid/CreditCardIcon';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import BuildingStorefrontIcon from '@heroicons/react/24/solid/BuildingStorefrontIcon';
import BuildingLibraryIcon from '@heroicons/react/24/solid/BuildingLibraryIcon';
import PresentationChartLineIcon from '@heroicons/react/24/solid/PresentationChartLineIcon';
import UserGroupIcon from '@heroicons/react/24/solid/UserGroupIcon';
import DocumentTextIcon from '@heroicons/react/24/solid/DocumentTextIcon';
import WalletIcon from '@heroicons/react/24/solid/WalletIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Punto de venta',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
    items: [
      {
        title: 'Dashboard',
        path: '/',
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Usuarios',
        path: '/users',
        icon: (
          <SvgIcon fontSize="small">
            <UsersIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Descuento',
        path: '/discount',
        icon: (
          <SvgIcon fontSize="small">
            <ReceiptPercentIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Cajas',
        path: '/terminalpos',
        icon: (
          <SvgIcon fontSize="small">
            <ArchiveBoxIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Productos',
        path: '/products',
        icon: (
          <SvgIcon fontSize="small">
            <ShoppingBagIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Monedas',
        path: '/currency',
        icon: (
          <SvgIcon fontSize="small">
            <CurrencyDollarIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Formas de pago',
        path: '/paymethod',
        icon: (
          <SvgIcon fontSize="small">
            <CreditCardIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Sucursales',
        path: '/store',
        icon: (
          <SvgIcon fontSize="small">
            <BuildingStorefrontIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Almacenes',
        path: '/warehouse',
        icon: (
          <SvgIcon fontSize="small">
            <BuildingLibraryIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Impuestos',
        path: '/tax',
        icon: (
          <SvgIcon fontSize="small">
            <PresentationChartBarIcon />
          </SvgIcon>
        ),
      },
    ],
  },
  {
    title: 'Fotografias',
    icon: (
      <SvgIcon fontSize="small">
        <PhotoIcon />
      </SvgIcon>
    ),
    items: [
      {
        title: 'Locación',
        path: '/location',
        icon: (
          <SvgIcon fontSize="small">
            <MapPinIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Fotografias',
        path: '/photos',
        icon: (
          <SvgIcon fontSize="small">
            <PhotoIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Fotos por grupo',
        path: '/group',
        icon: (
          <SvgIcon fontSize="small">
            <UserGroupIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Post Venta',
        path: '/post-venta',
        icon: (
          <SvgIcon fontSize="small">
            <WalletIcon />
          </SvgIcon>
        ),
      },
    ],
  },
  {
    title: 'Reportes',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentTextIcon />
      </SvgIcon>
    ),
    items: [
      {
        title: 'Reporte de links',
        path: '/link',
        icon: (
          <SvgIcon fontSize="small">
            <LinkIcon />
          </SvgIcon>
        ),
      },
      {
        title: 'Ventas',
        path: '/sales',
        icon: (
          <SvgIcon fontSize="small">
            <PresentationChartLineIcon />
          </SvgIcon>
        ),
      },
    ],
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
];
