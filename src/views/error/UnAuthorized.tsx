import PageContainer from "../../components/container/PageContainer";
import UnAuthorizedPage from "../../pages/errorpage/UnAuthorizedPage";

const UnAuthorized = () => {
    return (
        <PageContainer title="UnAuthorized" description="Page Not Found">
            <UnAuthorizedPage />
        </PageContainer>
    );
};

export default UnAuthorized;