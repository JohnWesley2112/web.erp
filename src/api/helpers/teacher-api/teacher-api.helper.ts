import axiosInstance from "../../axios-instance";

export type TeacherStatus = "ACTIVE" | "INACTIVE";
export interface Teacher { id: string; userId: string | null; campusId: string; employeeCode: string; firstName: string; lastName: string | null; status: TeacherStatus; campus?: { id: string; name: string; code: string }; }
export interface TeacherInput { firstName: string; lastName: string; employeeCode: string; campusId: string; userId?: string; status: TeacherStatus; }
export interface TeacherAssignment { id: string; teacherId: string; subjectId: string; sectionId: string; subject?: { id: string; name: string; code: string }; section?: { id: string; name: string; campusId: string; class?: { name: string } }; }
const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } }) => response.data;
export const teacherApi = {
    async list() { const result = unwrap<Teacher[]>(await axiosInstance.get("/teachers")); return { items: result.data ?? [], total: result.meta?.total ?? 0 }; },
    async create(input: TeacherInput) { return unwrap<Teacher>(await axiosInstance.post("/teachers", input)).data as Teacher; },
    async update(id: string, input: TeacherInput) { return unwrap<Teacher>(await axiosInstance.patch(`/teachers/${id}`, input)).data as Teacher; },
    async assignments(id: string) { return unwrap<TeacherAssignment[]>(await axiosInstance.get(`/teachers/${id}/assignments`)).data ?? []; },
    async createAssignment(id: string, input: { subjectId: string; sectionId: string }) { return unwrap<TeacherAssignment>(await axiosInstance.post(`/teachers/${id}/assignments`, input)).data as TeacherAssignment; },
};
