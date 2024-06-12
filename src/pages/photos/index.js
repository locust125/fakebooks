import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import PhotoSearchBar from './components/photo-search-bar';
import { useCatalogs } from 'src/hooks/use-catalogs';
import PhotoCard from '../../components/photo-card';
import GalleryContainer from '../../components/gallery-container';
import { use, useEffect, useMemo, useState } from 'react';
import authService from 'src/services/auth-service';
import Grid from '@mui/system/Unstable_Grid/Grid';
import { applyPagination } from 'src/utils/apply-pagination';
import { usePhotosPagination } from 'src/hooks/use-photos-pagination';

const useLocation = () => {
  const { state } = useCatalogs();
  const data = state.location?.data;

  return useMemo(() => {
    return data || [];
  }, [data]);
};

const Page = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [gallerySelectedID, setGallerySelectedID] = useState(0);
  const [galleryData, setGalleryData] = useState([]);
  const dataList = useLocation();

  const { imagesToShow, isLoading, handleShowMorePhotos } =
    usePhotosPagination(galleryData);

  const openGallery = id => {
    setGallerySelectedID(id);
    setIsGalleryOpen(true);
  };
  const closeGallery = () => setIsGalleryOpen(false);

  const handleSubmit = async values => {
    const routeString = `photography/bydate/${values.location}/${values.init_date}/${values.end_date}`;

    const res = await authService.getData(routeString);
    setGalleryData(res);
  };

  return (
    <>
      <Head>
        <title>Fotos</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Fotos</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Exportar
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <PhotoSearchBar
              xs={12}
              md={6}
              items={dataList}
              handleSubmit={handleSubmit}
            />
          </Stack>

          {isLoading && (
            <CircularProgress
              sx={{
                color: '#fff',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          )}

          <Grid marginTop={2} container spacing={2}>
            {imagesToShow &&
              !isLoading &&
              imagesToShow.map((image, index) => {
                return (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                    <PhotoCard
                      orientation={image.Orientation}
                      baseURL={image.Path}
                      isDownloadButtonActive
                      isZoomButtonActive
                      handleZoom={() => openGallery(index)}
                    />
                  </Grid>
                );
              })}
          </Grid>

          {galleryData && imagesToShow.length < galleryData.length && (
            <Button
              onClick={handleShowMorePhotos}
              variant="contained"
              disabled={isLoading || galleryData.length <= 0}
              sx={{ mt: 2 }}
            >
              Mostrar más
            </Button>
          )}
          <GalleryContainer
            isOpen={isGalleryOpen}
            handleClose={closeGallery}
            images={imagesToShow}
            selectedID={gallerySelectedID}
          />
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
