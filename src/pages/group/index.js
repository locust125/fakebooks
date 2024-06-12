import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import GrupSearchBar from './components/photo-search-bar';
import { useCatalogs } from 'src/hooks/use-catalogs';
import authService from 'src/services/auth-service';
import PhotoCard from '../../components/photo-card';
import GalleryContainer from '../../components/gallery-container';
import { usePhotosPagination } from 'src/hooks/use-photos-pagination';

const now = new Date();

const useLocation = () => {
  const { state } = useCatalogs();
  const data = state.location?.data;

  return useMemo(() => {
    return data || [];
  }, [data]);
};

const Page = () => {
  const dataList = useLocation();
  const [galleryData, setGalleryData] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [gallerySelectedID, setGallerySelectedID] = useState(0);
  const { imagesToShow, isLoading, handleShowMorePhotos } =
    usePhotosPagination(galleryData);

  const { state } = useCatalogs();
  const data = state.location?.data;

  const openGallery = useCallback(id => {
    setGallerySelectedID(id);
    setIsGalleryOpen(true);
  }, []);

  const closeGallery = () => setIsGalleryOpen(false);

  const handleSubmit = useCallback(async values => {
    const endpoint = `photography/bygroup/${values.date}/${values.group}`;
    const res = await authService.getData(endpoint);
    setGalleryData(res);
  }, []);

  const [numberOfPhotos, setNumberOfPhotos] = useState(0);

  useEffect(() => {
    if (galleryData) {
      setNumberOfPhotos(galleryData.length);
    }
  }, [galleryData]);

  return (
    <>
      <Head>
        <title>Fotos Por grupos</title>
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
                <Typography variant="h4">Fotos Por grupos</Typography>
              </Stack>
            </Stack>
            <GrupSearchBar
              xs={12}
              md={6}
              count={data.length}
              items={dataList}
              handleSubmit={handleSubmit}
            />
          </Stack>

          <Typography variant="h6" sx={{ marginTop: 2 }}>
            {numberOfPhotos > 0 && `Fotos encontradas (${numberOfPhotos})`}
          </Typography>

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
                      orientation={image.orientation}
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
