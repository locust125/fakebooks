import React from 'react';
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import RecipeReviewCard from 'src/components/post';
import usePosts from 'src/hooks/usePosts'; // Asegúrate de que la ruta sea correcta

const Page = () => {
  const posts = usePosts();

  return (
    <>
      <Head>
        <title>Fakebook</title>
      </Head>
      <DashboardLayout>
        {/* Asegúrate de que posts tenga datos antes de pasarlos */}
        {posts.length > 0 && <RecipeReviewCard items={posts} />}
      </DashboardLayout>
    </>
  );
};

export default Page;
