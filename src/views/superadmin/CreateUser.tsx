import PageContainer from "../../components/container/PageContainer";
import CreateUserPage from "../../pages/superadmin/CreateUserPage";

const CreateUser = () => {
    return (
        <PageContainer title="Create User" description="this is Create User page">
            <CreateUserPage />
        </PageContainer>
    );
};

export default CreateUser;