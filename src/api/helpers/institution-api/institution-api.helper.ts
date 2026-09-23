import axiosInstance from "../../axios-instance";

export interface Institution {
    id: string;
    name: string;
    code: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}

export interface UpdateInstitutionInput {
    name: string;
    email: string;
    phone: string;
    address: string;
}

const unwrap = <T,>(response: { data: { data?: T } | T }): T => {
    const payload = response.data;
    return typeof payload === "object" && payload !== null && "data" in payload
        ? payload.data as T
        : payload as T;
};

export const institutionApi = {
    async getInstitution(): Promise<Institution> {
        return unwrap<Institution>(await axiosInstance.get("/institution"));
    },

    async updateInstitution(input: UpdateInstitutionInput): Promise<Institution> {
        return unwrap<Institution>(await axiosInstance.patch("/institution", input));
    },
};
