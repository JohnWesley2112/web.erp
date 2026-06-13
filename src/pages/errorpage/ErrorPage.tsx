import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router';
import ErrorImg from 'src/assets/images/backgrounds/errorimg.svg';

const ErrorPage = () => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            textAlign: "center",
            justifyContent: "center",
        }}
    >
        <Container maxWidth="md">
            <img src={ErrorImg} alt="404" />
            <Typography sx={{ align: "center", variant: "h1", mb: 4 }}>
                Opps!!!
            </Typography>
            <Typography sx={{ align: "center", variant: "h4", mb: 4 }}>
                This page you are looking for could not be found.
            </Typography>
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to="/dashboards/modern"
                disableElevation
            >
                Go Back to Home
            </Button>
        </Container>
    </Box>
);

export default ErrorPage;
