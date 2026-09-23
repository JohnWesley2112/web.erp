import axiosInstance from "../../axios-instance";

export interface AuditLog {
    id: string;
    actorUserId: string;
    action: string;
    entityType: string;
    entityId: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
}

export interface AuditLogListParams {
    page?: number;
    pageSize?: number;
    actorUserId?: string;
    action?: string;
    entityType?: string;
    from?: string;
    to?: string;
}

const unwrap = <T,>(response: { data: { data?: T; meta?: { total?: number; page?: number; pageSize?: number } } }) => response.data;

export const auditApi = {
    async list(params: AuditLogListParams = {}) {
        const result = unwrap<AuditLog[]>(await axiosInstance.get("/audit-logs", { params }));
        return { items: result.data ?? [], total: result.meta?.total ?? 0, page: result.meta?.page ?? 1, pageSize: result.meta?.pageSize ?? 20 };
    },
};
