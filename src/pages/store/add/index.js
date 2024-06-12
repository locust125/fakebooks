import { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import StoreForm from '../components/store-form';

const initialState = {
  id: -1,
  code: '',
  storename: '',
  email: null,
  telephone: '',
  address: '',
  ticketMessage: '',
  comments: '',
  website: '',
  rfc: '',
};

const Page = () => {
  const [formData, setFormData] = useState(initialState);

  return (
    <>
      <StoreForm store={formData} />
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
