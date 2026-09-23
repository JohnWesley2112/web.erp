import axiosInstance from "../../axios-instance";

export type AcademicYearStatus = "UPCOMING" | "ACTIVE" | "CLOSED";
export interface AcademicYear { id: string; name: string; startDate: string; endDate: string; status: AcademicYearStatus; }
export type AcademicYearInput = Omit<AcademicYear, "id">;

const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } }) => response.data;
export const academicYearApi = {
    async list() { const data = unwrap<AcademicYear[]>(await axiosInstance.get("/academic-years")); return { items: data.data ?? [], total: data.meta?.total ?? 0 }; },
    async create(input: AcademicYearInput) { return unwrap<AcademicYear>(await axiosInstance.post("/academic-years", input)).data as AcademicYear; },
    async update(id: string, input: AcademicYearInput) { return unwrap<AcademicYear>(await axiosInstance.patch(`/academic-years/${id}`, input)).data as AcademicYear; },
};
