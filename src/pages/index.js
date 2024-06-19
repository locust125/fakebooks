import React from 'react';
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import RecipeReviewCard from 'src/components/post';
import Postx2 from 'src/components/postsPost';

const Page = () => {
  

  return (
    <>
      <Head>
        <title>Twiter2</title>
      </Head>
      
      <DashboardLayout>
        <Postx2/>
        <RecipeReviewCard/>
      </DashboardLayout>
    </>
  );
};

export default Page;
