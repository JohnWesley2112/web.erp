import PageContainer from "../../../components/container/PageContainer";
// import Breadcrumb from "../../../layout/full/shared/breadcrumb/Breadcrumb";
import PermissionsPage from "../../../pages/permissions/PermissionsPage";

const PermissionsView = () => {
    return (
        <PageContainer title="Permissions" description="this is Permissions page">
            {/* <Breadcrumb title="Permissions app" subtitle="Get the latest news" /> */}
            <PermissionsPage />
        </PageContainer>
    );
};

export default PermissionsView;