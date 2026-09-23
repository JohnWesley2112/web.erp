import axiosInstance from "../../axios-instance";

export type StudentStatus = "ACTIVE" | "INACTIVE" | "GRADUATED" | "TRANSFERRED";
export interface StudentEnrollment { id: string; academicYearId: string; campusId: string; classId: string; sectionId: string; admissionNumber: string; status: string; enrolledAt: string; academicYear?: { id: string; name: string }; campus?: { id: string; name: string; code: string }; class?: { id: string; name: string; code: string }; section?: { id: string; name: string }; }
export interface Student { id: string; admissionNumber: string; firstName: string; middleName: string | null; lastName: string | null; dateOfBirth: string | null; gender: string | null; status: StudentStatus; enrollments: StudentEnrollment[]; }
export interface StudentInput { admissionNumber: string; firstName: string; middleName?: string; lastName?: string; dateOfBirth?: string; gender?: string; status?: StudentStatus; academicYearId: string; campusId: string; classId: string; sectionId: string; enrolledAt?: string; }
const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } }) => response.data;
export const studentApi = {
    async list(params: { sectionId?: string; campusId?: string; academicYearId?: string; classId?: string; page?: number; pageSize?: number } = {}) { const result = unwrap<Student[]>(await axiosInstance.get("/students", { params })); return { items: result.data ?? [], total: result.meta?.total ?? 0 }; },
    async create(input: StudentInput) { return unwrap<Student>(await axiosInstance.post("/students", input)).data as Student; },
    async update(id: string, input: Partial<StudentInput>) { return unwrap<Student>(await axiosInstance.patch(`/students/${id}`, input)).data as Student; },
    async enroll(id: string, input: Omit<StudentInput, "firstName" | "middleName" | "lastName" | "dateOfBirth" | "gender" | "status">) { return unwrap<StudentEnrollment>(await axiosInstance.post(`/students/${id}/enrollments`, input)).data as StudentEnrollment; },
};