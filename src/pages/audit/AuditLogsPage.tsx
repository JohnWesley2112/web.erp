import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import { auditApi, type AuditLog } from "../../api/helpers/audit-api/audit-api.helper";

const PAGE_SIZE = 20;

const message = (error: unknown) =>
    (error as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? "Unable to complete the request.";

const emptyFilters = { actorUserId: "", action: "", entityType: "", from: "", to: "" };

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(emptyFilters);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (currentPage: number, currentFilters: typeof emptyFilters) => {
        setLoading(true);
        setError(null);
        try {
            const params = { page: currentPage, pageSize: PAGE_SIZE, ...currentFilters };
            const cleaned = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ""));
            const result = await auditApi.list(cleaned);
            setLogs(result.items);
            setTotal(result.total);
        } catch (err) {
            setError(message(err));
        } finally {
            setLoading(false);
        }
    }, []);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void load(page, filters); }, [load, page, filters]);

    const applyFilters = () => setPage(1);
    const clearFilters = () => { setFilters(emptyFilters); setPage(1); };

    const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

    return (
        <PageContainer title="Audit Logs" description="Review important actions performed within this tenant">
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4">Audit Logs</Typography>
                    <Typography color="text.secondary">Traceability of important actions performed within this tenant</Typography>
                </Box>

                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                        <TextField label="Actor user id" value={filters.actorUserId} onChange={(event) => setFilters((current) => ({ ...current, actorUserId: event.target.value }))} sx={{ minWidth: 220 }} />
                        <TextField label="Action" value={filters.action} onChange={(event) => setFilters((current) => ({ ...current, action: event.target.value }))} sx={{ minWidth: 180 }} />
                        <TextField label="Entity type" value={filters.entityType} onChange={(event) => setFilters((current) => ({ ...current, entityType: event.target.value }))} sx={{ minWidth: 160 }} />
                        <TextField label="From" type="date" value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="To" type="date" value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} slotProps={{ inputLabel: { shrink: true } }} />
                        <Button variant="contained" onClick={applyFilters}>Apply</Button>
                        <Button variant="text" onClick={clearFilters}>Clear</Button>
                    </Stack>
                </Paper>

                {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" onClick={() => void load(page, filters)}>Retry</Button>}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
                ) : (
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Actor</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Entity</TableCell>
                                        <TableCell>Metadata</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 5 }}>No audit records found</TableCell></TableRow>
                                    ) : (
                                        logs.map((log) => (
                                            <TableRow key={log.id} hover>
                                                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>{log.actorUserId}</TableCell>
                                                <TableCell>{log.action}</TableCell>
                                                <TableCell>{log.entityType}{log.entityId ? ` / ${log.entityId}` : ""}</TableCell>
                                                <TableCell sx={{ maxWidth: 320, wordBreak: "break-word" }}>{log.metadata ? JSON.stringify(log.metadata) : "-"}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
                            <Typography color="text.secondary">Page {page} of {totalPages} ({total} total)</Typography>
                            <Button size="small" disabled={page <= 1} onClick={() => setPage((current) => Math.max(current - 1, 1))}>Previous</Button>
                            <Button size="small" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(current + 1, totalPages))}>Next</Button>
                        </Box>
                    </Paper>
                )}
            </Box>
        </PageContainer>
    );
}
