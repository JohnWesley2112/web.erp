import axiosInstance from "../../axios-instance";
export type ActiveStatus = "ACTIVE" | "INACTIVE";
export interface AcademicClass { id: string; name: string; code: string; displayOrder: number; status: ActiveStatus; }
export type AcademicClassInput = Omit<AcademicClass, "id">;
const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } }) => response.data;
export const classApi = {
    async list() { const data = unwrap<AcademicClass[]>(await axiosInstance.get("/classes")); return { items: data.data ?? [], total: data.meta?.total ?? 0 }; },
    async create(input: AcademicClassInput) { return unwrap<AcademicClass>(await axiosInstance.post("/classes", input)).data as AcademicClass; },
    async update(id: string, input: AcademicClassInput) { return unwrap<AcademicClass>(await axiosInstance.patch(`/classes/${id}`, input)).data as AcademicClass; },
};
