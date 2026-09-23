import PageContainer from "../../components/container/PageContainer";
import Breadcrumb from "../../layout/full/shared/breadcrumb/Breadcrumb";
import HomePage from "../../pages/homepage/HomePage";

const Home = () => {
    return (
        <PageContainer title="Home" description="this is Home page">
            <Breadcrumb title="Home app" subtitle="Get the latest news" />
            {/* ------------------------------------------- */}
            {/* Home Listing */}
            {/* ------------------------------------------- */}
            <HomePage />
        </PageContainer>
    );
};

export default Home;