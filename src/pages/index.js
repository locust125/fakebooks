import React from 'react';
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import RecipeReviewCard from 'src/components/post';
import Postx2 from 'src/components/postsPost';

const Page = () => {
  

  return (
    <>
      <Head>
        <title>Fakebook</title>
      </Head>
      <Postx2></Postx2>
      <DashboardLayout><RecipeReviewCard/>
      </DashboardLayout>
    </>
  );
};

export default Page;
