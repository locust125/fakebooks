import { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import TerminalForm from '../components/terminal-form';
import { useCatalogs } from 'src/hooks/use-catalogs';

const initialState = {
  id: -1,
  code: '',
  description: '',
  prefix: '',
  ticket: '',
  isOpen: false,
  idWarehouse: 1,
  idStore: 1,
  status: true,
};

const Page = () => {
  const [formData, setFormData] = useState(initialState);
  const { state } = useCatalogs();

  const stores = state.store?.data;
  const warehouses = state.warehouse?.data;

  return (
    <>
      <TerminalForm item={formData} stores={stores} warehouses={warehouses} />
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
