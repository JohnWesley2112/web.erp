import axiosInstance from "../../axios-instance";

export class HomeApiHelper {
    async getAllUsers() {
        const response = await axiosInstance("/users/users");
        return response.data;
    }
}
