import { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import StoreForm from '../components/warehouse-form';
import { useCatalogs } from 'src/hooks/use-catalogs';

const initialState = {
  id: -1,
  code: '',
  name: '',
  description: '',
  idwarehouseparent: 0,
};

const Page = () => {
  const [formData, setFormData] = useState(initialState);
  const { state } = useCatalogs();

  const warehouses = state.warehouse?.data;

  return (
    <>
      <StoreForm warehouse={formData} warehouses={warehouses} />
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
