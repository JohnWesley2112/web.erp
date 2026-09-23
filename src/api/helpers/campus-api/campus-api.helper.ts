import axiosInstance from "../../axios-instance";

export type CampusStatus = "ACTIVE" | "INACTIVE";

export interface Campus {
    id: string;
    institutionId: string;
    name: string;
    code: string;
    address: string | null;
    status: CampusStatus;
}

export interface CampusInput {
    name: string;
    code: string;
    address: string;
    status: CampusStatus;
}

export interface CampusListResult {
    items: Campus[];
    total: number;
}

const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } | T }) => {
    const payload = response.data;
    return typeof payload === "object" && payload !== null && "data" in payload
        ? payload as { data: T; meta?: { total?: number } }
        : { data: payload as T };
};

export const campusApi = {
    async listCampuses(): Promise<CampusListResult> {
        const payload = unwrap<Campus[]>(await axiosInstance.get("/campuses"));
        return { items: payload.data, total: payload.meta?.total ?? payload.data.length };
    },

    async createCampus(input: CampusInput): Promise<Campus> {
        return unwrap<Campus>(await axiosInstance.post("/campuses", input)).data;
    },

    async updateCampus(campusId: string, input: CampusInput): Promise<Campus> {
        return unwrap<Campus>(await axiosInstance.patch(`/campuses/${campusId}`, input)).data;
    },
};
