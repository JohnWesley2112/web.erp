import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    MenuItem,
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
import { useAppSelector } from "../../store/Hooks";
import { hasPermission } from "../../utils/permissions";
import {
    attendanceApi,
    type AttendanceRecordStatus,
    type AttendanceSession,
} from "../../api/helpers/attendance-api/attendance-api.helper";
import { sectionApi, type Section } from "../../api/helpers/section-api/section-api.helper";
import { classApi, type AcademicClass } from "../../api/helpers/class-api/class-api.helper";
import { studentApi, type Student } from "../../api/helpers/student-api/student-api.helper";

const STATUS_OPTIONS: AttendanceRecordStatus[] = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

const message = (error: unknown) =>
    (error as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? "Unable to complete the request.";

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

export default function AttendancePage() {
    const permissions = useAppSelector((state) => state.permissions.permissions);
    const canMark = hasPermission(permissions, "attendance.mark");
    const canSubmit = hasPermission(permissions, "attendance.submit");

    const [sections, setSections] = useState<Section[]>([]);
    const [classes, setClasses] = useState<AcademicClass[]>([]);
    const [sectionId, setSectionId] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(todayIsoDate());

    const [loading, setLoading] = useState(true);
    const [sessionLoading, setSessionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [session, setSession] = useState<AttendanceSession | null>(null);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [roster, setRoster] = useState<Student[]>([]);
    const [draftStatus, setDraftStatus] = useState<Record<string, AttendanceRecordStatus>>({});
    const [draftRemarks, setDraftRemarks] = useState<Record<string, string>>({});

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [sectionResult, classResult] = await Promise.all([sectionApi.list(), classApi.list()]);
            setSections(sectionResult.items);
            setClasses(classResult.items);
        } catch (err) {
            setError(message(err));
        } finally {
            setLoading(false);
        }
    }, []);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { void load(); }, [load]);

    const classNameById = useMemo(() => new Map(classes.map((item) => [item.id, item.name])), [classes]);

    const existingRecordByStudentId = useMemo(
        () => new Map((session?.attendanceRecords ?? []).map((record) => [record.studentId, record])),
        [session],
    );

    const loadSession = async () => {
        if (!sectionId || !attendanceDate) return;
        setSessionLoading(true);
        setActionError(null);
        setSession(null);
        setRoster([]);
        setDraftStatus({});
        setDraftRemarks({});
        try {
            const { items } = await attendanceApi.list({ sectionId, date: attendanceDate });
            const found = items[0] ? await attendanceApi.get(items[0].id) : null;
            const rosterResult = await studentApi.list({ sectionId });
            setSession(found);
            setRoster(rosterResult.items);
        } catch (err) {
            setActionError(message(err));
        } finally {
            setSessionChecked(true);
            setSessionLoading(false);
        }
    };

    const createSession = async () => {
        setSaving(true);
        setActionError(null);
        try {
            const created = await attendanceApi.create({ sectionId, attendanceDate });
            setSession(created);
        } catch (err) {
            setActionError(message(err));
        } finally {
            setSaving(false);
        }
    };

    const saveRecords = async () => {
        if (!session) return;
        const unmarked = roster.filter((student) => !existingRecordByStudentId.has(student.id));
        if (!unmarked.length) return;
        setSaving(true);
        setActionError(null);
        try {
            const records = unmarked.map((student) => {
                const remarks = draftRemarks[student.id]?.trim();
                return {
                    studentId: student.id,
                    status: draftStatus[student.id] ?? "PRESENT",
                    ...(remarks ? { remarks } : {}),
                };
            });
            const updated = await attendanceApi.addRecords(session.id, records);
            setSession(updated);
            setDraftStatus({});
            setDraftRemarks({});
        } catch (err) {
            setActionError(message(err));
        } finally {
            setSaving(false);
        }
    };

    const submitSession = async () => {
        if (!session) return;
        setSaving(true);
        setActionError(null);
        try {
            const updated = await attendanceApi.submit(session.id);
            setSession(updated);
        } catch (err) {
            setActionError(message(err));
        } finally {
            setSaving(false);
        }
    };

    const isDraft = session?.status === "DRAFT";
    const unmarkedCount = roster.filter((student) => !existingRecordByStudentId.has(student.id)).length;

    return (
        <PageContainer title="Attendance" description="Mark and review section attendance">
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4">Attendance</Typography>
                    <Typography color="text.secondary">Mark, review, and submit attendance for a section and date</Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" onClick={() => void load()}>Retry</Button>}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
                ) : (
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "center" }}>
                            <TextField select label="Section" value={sectionId} onChange={(event) => setSectionId(event.target.value)} sx={{ minWidth: 240 }}>
                                <MenuItem value="">Select a section</MenuItem>
                                {sections.map((section) => (
                                    <MenuItem key={section.id} value={section.id}>
                                        {classNameById.get(section.classId) ?? "Class"} - {section.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Date"
                                type="date"
                                value={attendanceDate}
                                onChange={(event) => setAttendanceDate(event.target.value)}
                                slotProps={{ inputLabel: { shrink: true } }}
                            />
                            <Button variant="contained" disabled={!sectionId || !attendanceDate || sessionLoading} onClick={() => void loadSession()}>
                                {sessionLoading ? "Loading..." : "Load session"}
                            </Button>
                        </Stack>
                    </Paper>
                )}

                {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}

                {sessionChecked && !sessionLoading && !session && (
                    <Paper sx={{ p: 3 }}>
                        <Typography sx={{ mb: 2 }}>No attendance session exists for this section and date yet.</Typography>
                        {canMark ? (
                            <Button variant="contained" disabled={saving} onClick={() => void createSession()}>
                                Start attendance
                            </Button>
                        ) : (
                            <Typography color="text.secondary">You do not have permission to start attendance.</Typography>
                        )}
                    </Paper>
                )}

                {session && (
                    <Paper>
                        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                            <Box>
                                <Typography variant="h6">
                                    {classNameById.get(session.section?.classId ?? "") ?? "Class"} - {session.section?.name ?? "Section"}
                                </Typography>
                                <Typography color="text.secondary">{session.attendanceDate.slice(0, 10)}</Typography>
                            </Box>
                            <Chip label={session.status} color={session.status === "SUBMITTED" ? "success" : "warning"} />
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Admission number</TableCell>
                                        <TableCell>Student</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Remarks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roster.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 5 }}>No students enrolled in this section</TableCell></TableRow>
                                    ) : (
                                        roster.map((student) => {
                                            const existing = existingRecordByStudentId.get(student.id);
                                            return (
                                                <TableRow key={student.id} hover>
                                                    <TableCell>{student.admissionNumber}</TableCell>
                                                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                                                    <TableCell>
                                                        {existing ? (
                                                            <Chip size="small" label={existing.status} />
                                                        ) : isDraft && canMark ? (
                                                            <TextField
                                                                select
                                                                size="small"
                                                                value={draftStatus[student.id] ?? "PRESENT"}
                                                                onChange={(event) => setDraftStatus((current) => ({ ...current, [student.id]: event.target.value as AttendanceRecordStatus }))}
                                                                sx={{ minWidth: 140 }}
                                                            >
                                                                {STATUS_OPTIONS.map((status) => (
                                                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                                                ))}
                                                            </TextField>
                                                        ) : (
                                                            <Chip size="small" label="Not marked" variant="outlined" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {existing ? (
                                                            existing.remarks ?? "-"
                                                        ) : isDraft && canMark ? (
                                                            <TextField
                                                                size="small"
                                                                value={draftRemarks[student.id] ?? ""}
                                                                onChange={(event) => setDraftRemarks((current) => ({ ...current, [student.id]: event.target.value }))}
                                                            />
                                                        ) : "-"}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            {isDraft && canMark && (
                                <Button variant="outlined" disabled={saving || unmarkedCount === 0} onClick={() => void saveRecords()}>
                                    {saving ? "Saving..." : `Save attendance (${unmarkedCount} remaining)`}
                                </Button>
                            )}
                            {isDraft && canSubmit && (
                                <Button variant="contained" disabled={saving || unmarkedCount > 0} onClick={() => void submitSession()}>
                                    Submit attendance
                                </Button>
                            )}
                        </Box>
                    </Paper>
                )}
            </Box>
        </PageContainer>
    );
}
