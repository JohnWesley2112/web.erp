import axiosInstance from "../../axios-instance";

export type AttendanceSessionStatus = "DRAFT" | "SUBMITTED";
export type AttendanceRecordStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

export interface AttendanceRecord {
    id: string;
    studentId: string;
    status: AttendanceRecordStatus;
    remarks: string | null;
    student?: { id: string; admissionNumber: string; firstName: string; lastName: string | null };
}

export interface AttendanceSession {
    id: string;
    academicYearId: string;
    campusId: string;
    sectionId: string;
    attendanceDate: string;
    status: AttendanceSessionStatus;
    createdByUserId: string;
    section?: { id: string; name: string; campusId: string; classId: string; class?: { id: string; name: string } };
    attendanceRecords?: AttendanceRecord[];
}

export interface AttendanceRecordInput {
    studentId: string;
    status: AttendanceRecordStatus;
    remarks?: string;
}

const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number } } }) => response.data;

export const attendanceApi = {
    async list(params: { sectionId?: string; date?: string } = {}) {
        const result = unwrap<AttendanceSession[]>(await axiosInstance.get("/attendance/sessions", { params }));
        return { items: result.data ?? [], total: result.meta?.total ?? 0 };
    },
    async get(sessionId: string) {
        return unwrap<AttendanceSession>(await axiosInstance.get(`/attendance/sessions/${sessionId}`)).data as AttendanceSession;
    },
    async create(input: { sectionId: string; attendanceDate: string }) {
        return unwrap<AttendanceSession>(await axiosInstance.post("/attendance/sessions", input)).data as AttendanceSession;
    },
    async addRecords(sessionId: string, records: AttendanceRecordInput[]) {
        return unwrap<AttendanceSession>(await axiosInstance.post(`/attendance/sessions/${sessionId}/records`, { records })).data as AttendanceSession;
    },
    async submit(sessionId: string) {
        return unwrap<AttendanceSession>(await axiosInstance.post(`/attendance/sessions/${sessionId}/submit`, {})).data as AttendanceSession;
    },
};
