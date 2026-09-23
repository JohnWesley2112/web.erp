import axiosInstance from "../../axios-instance";
import type { ActiveStatus } from "../class-api/class-api.helper";
export interface Subject { id: string; name: string; code: string; status: ActiveStatus; }
export type SubjectInput = Omit<Subject, "id">;
const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } }) => response.data;
export const subjectApi = {
    async list() { const data = unwrap<Subject[]>(await axiosInstance.get("/subjects")); return { items: data.data ?? [], total: data.meta?.total ?? 0 }; },
    async create(input: SubjectInput) { return unwrap<Subject>(await axiosInstance.post("/subjects", input)).data as Subject; },
    async update(id: string, input: SubjectInput) { return unwrap<Subject>(await axiosInstance.patch(`/subjects/${id}`, input)).data as Subject; },
};
