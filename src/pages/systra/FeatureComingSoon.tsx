import { Box, Card, CardContent, Typography } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';

interface FeatureComingSoonProps {
    title: string;
}

const FeatureComingSoon = ({ title }: FeatureComingSoonProps) => (
    <PageContainer title={title} description="Feature coming soon">
        <Box
            sx={{
                minHeight: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 640 }}>
                <CardContent sx={{ py: 6, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Coming next
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    </PageContainer>
);

export default FeatureComingSoon;
