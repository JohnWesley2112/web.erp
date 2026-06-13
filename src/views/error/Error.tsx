import PageContainer from "../../components/container/PageContainer";
import ErrorPage from "../../pages/errorpage/ErrorPage";

const Error = () => {
    return (
        <PageContainer title="Error" description="Page Not Found">
            <ErrorPage />
        </PageContainer>
    );
};

export default Error;