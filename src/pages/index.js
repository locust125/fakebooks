import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import authService from 'src/services/auth-service';
import { useCatalogs } from 'src/hooks/use-catalogs';
import useLoading from 'src/hooks/use-loading';
import RecipeReviewCard from 'src/components/post';

const now = new Date();

const Page = () => {
  const { state } = useCatalogs();
  const [data, setData] = useState({});
  const [refreshTable, setRefreshTable] = useState(0);

  const { isLoading, setIsLoadingFalse, setIsLoadingTrue } = useLoading({
    defaultState: false,
  });

  const handleSyncClick = () => {
    setRefreshTable(refreshTable + 1);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [refreshTable]);

  async function fetchData() {
    setIsLoadingTrue();
    const d = await authService.getData('dashboard/sales/stats');
    if (d) {
      setData(d);
    }
    setIsLoadingFalse();
  }

  return (
    <>
      <Head>
        <title>Fakebook</title>
      </Head>
    <RecipeReviewCard></RecipeReviewCard>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
