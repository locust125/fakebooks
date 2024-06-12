import { useState } from 'react';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import UsersForm from '../components/users-form';
import { useCatalogs } from 'src/hooks/use-catalogs';

const initialState = {
  id: -1,
  user: '',
  password: '',
  name: '',
  idUserGroup: 1,
  email: null,
  active: true,
};

const Page = () => {
  const [formData, setFormData] = useState(initialState);
  const { state } = useCatalogs();

  const groups = state.mpuserGroup?.data;

  return (
    <>
      <UsersForm user={formData} groups={groups} />
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
