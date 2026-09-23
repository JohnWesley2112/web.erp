import axiosInstance from "../../axios-instance";
import type { ActiveStatus } from "../class-api/class-api.helper";
export interface Section { id: string; academicYearId: string; campusId: string; classId: string; name: string; status: ActiveStatus; }
export type SectionInput = Omit<Section, "id">;
const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } }) => response.data;
export const sectionApi = {
    async list() { const data = unwrap<Section[]>(await axiosInstance.get("/sections")); return { items: data.data ?? [], total: data.meta?.total ?? 0 }; },
    async create(input: SectionInput) { return unwrap<Section>(await axiosInstance.post("/sections", input)).data as Section; },
    async update(id: string, input: SectionInput) { return unwrap<Section>(await axiosInstance.patch(`/sections/${id}`, input)).data as Section; },
};
