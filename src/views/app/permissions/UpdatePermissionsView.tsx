import PageContainer from "../../../components/container/PageContainer";
import UpdatePermissionsPage from "../../../pages/permissions/UpdatePermissionsPage";

const UpdatePermissionsView = () => {
    return (
        <PageContainer title="Permissions" description="this is Permissions page">
            {/* <Breadcrumb title="Permissions app" subtitle="Get the latest news" /> */}
            <UpdatePermissionsPage />
        </PageContainer>
    );
};

export default UpdatePermissionsView;