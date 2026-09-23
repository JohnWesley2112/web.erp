import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router';
import UnauthorizedImg from 'src/assets/images/backgrounds/401ErrorUnauthorized2.svg';

const UnAuthorizedPage = () => (
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
            <img src={UnauthorizedImg} alt="401" width="360" height="360" />
            <Typography sx={{ align: "center", variant: "h1", mb: 4 }}>
                STOP!!!
            </Typography>
            <Typography sx={{ align: "center", variant: "h4", mb: 4 }}>
                You are not authorized to access this page.
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

export default UnAuthorizedPage;
