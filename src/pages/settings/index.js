import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import SizeAvatars from './components/company-logo';
import EditorSection from './components/editor-section';

const Page = () => (
  <>
    <Head>
      <title>Configuración</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">Configuración</Typography>
        </Stack>
        <SizeAvatars></SizeAvatars>
        <EditorSection />
      </Container>
    </Box>
  </>
);

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
