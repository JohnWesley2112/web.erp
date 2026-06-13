import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import PageContainer from '../../components/container/PageContainer';
import Logo from '../../layout/shared/logo/Logo';
import AuthLogin from './authform/AuthLogin';

const Login = () => (
  <PageContainer title="Login" description="this is Login page">
    <Grid
      container
      sx={{
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        overflowX: 'hidden',
      }}
    >
      <Grid size={{ xs: 11, sm: 8, md: 6, lg: 4, }}>
        <Paper
          elevation={6}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Logo />
          </Box>
          <AuthLogin />
        </Paper>
      </Grid>
    </Grid>
  </PageContainer>
);

export default Login;