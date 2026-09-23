import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    teacherApi,
    type Teacher,
    type TeacherAssignment,
    type TeacherInput,
} from "../../api/helpers/teacher-api/teacher-api.helper";
import {
    campusApi,
    type Campus,
} from "../../api/helpers/campus-api/campus-api.helper";
import {
    subjectApi,
    type Subject,
} from "../../api/helpers/subject-api/subject-api.helper";
import {
    sectionApi,
    type Section,
} from "../../api/helpers/section-api/section-api.helper";

const message = (error: unknown) =>
    (error as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message ?? "Unable to complete the request.";
const emptyTeacher: TeacherInput = {
    firstName: "",
    lastName: "",
    employeeCode: "",
    campusId: "",
    status: "ACTIVE",
};

export default function TeachersPage() {
    const permissions = useAppSelector(
        (state) => state.permissions.permissions,
    );
    const canCreate = hasPermission(permissions, "teacher.create");
    const canUpdate = hasPermission(permissions, "teacher.update");
    const canAssign = hasPermission(permissions, "academic.manage");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [selected, setSelected] = useState<Teacher | null>(null);
    const [form, setForm] = useState<TeacherInput>(emptyTeacher);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [assignmentOpen, setAssignmentOpen] = useState(false);
    const [assignmentTeacher, setAssignmentTeacher] = useState<Teacher | null>(
        null,
    );
    const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
    const [assignment, setAssignment] = useState({
        subjectId: "",
        sectionId: "",
    });
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [teacherResult, campusResult, subjectResult, sectionResult] =
                await Promise.all([
                    teacherApi.list(),
                    campusApi.listCampuses(),
                    subjectApi.list(),
                    sectionApi.list(),
                ]);
            setTeachers(teacherResult.items);
            setCampuses(campusResult.items);
            setSubjects(subjectResult.items);
            setSections(sectionResult.items);
        } catch (err) {
            setError(message(err));
        } finally {
            setLoading(false);
        }
    }, []);
    // The initial resource load intentionally updates the page state from the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        void load();
    }, [load]);
    const openTeacher = (teacher: Teacher | null) => {
        setSelected(teacher);
        setForm(
            teacher
                ? {
                      firstName: teacher.firstName,
                      lastName: teacher.lastName ?? "",
                      employeeCode: teacher.employeeCode,
                      campusId: teacher.campusId,
                      userId: teacher.userId ?? "",
                      status: teacher.status,
                  }
                : { ...emptyTeacher },
        );
        setFormError(null);
        setFormOpen(true);
    };
    const saveTeacher = async () => {
        if (
            !form.firstName.trim() ||
            !form.employeeCode.trim() ||
            !form.campusId
        ) {
            setFormError("First name, employee code, and campus are required.");
            return;
        }
        setSaving(true);
        setFormError(null);
        try {
            if (selected) await teacherApi.update(selected.id, form);
            else await teacherApi.create(form);
            setFormOpen(false);
            await load();
        } catch (err) {
            setFormError(message(err));
        } finally {
            setSaving(false);
        }
    };
    const openAssignments = async (teacher: Teacher) => {
        setAssignmentTeacher(teacher);
        setAssignment({ subjectId: "", sectionId: "" });
        setAssignmentOpen(true);
        try {
            setAssignments(await teacherApi.assignments(teacher.id));
        } catch (err) {
            setFormError(message(err));
        }
    };
    const saveAssignment = async () => {
        if (
            !assignmentTeacher ||
            !assignment.subjectId ||
            !assignment.sectionId
        )
            return;
        setSaving(true);
        setFormError(null);
        try {
            await teacherApi.createAssignment(assignmentTeacher.id, assignment);
            setAssignments(await teacherApi.assignments(assignmentTeacher.id));
            setAssignment({ subjectId: "", sectionId: "" });
        } catch (err) {
            setFormError(message(err));
        } finally {
            setSaving(false);
        }
    };
    return (
        <PageContainer
            title="Teachers"
            description="Manage teachers and teaching assignments"
        >
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography variant="h4">Teachers</Typography>
                        <Typography color="text.secondary">
                            Manage teachers and teaching assignments
                        </Typography>
                    </Box>
                    {canCreate && (
                        <Button
                            variant="contained"
                            onClick={() => openTeacher(null)}
                        >
                            Add Teacher
                        </Button>
                    )}
                </Box>
                {error && (
                    <Alert
                        severity="error"
                        action={
                            <Button color="inherit" onClick={() => void load()}>
                                Retry
                            </Button>
                        }
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 8,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Employee code</TableCell>
                                        <TableCell>Campus</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {teachers.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                align="center"
                                                sx={{ py: 5 }}
                                            >
                                                No teachers found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        teachers.map((teacher) => (
                                            <TableRow key={teacher.id} hover>
                                                <TableCell>
                                                    {teacher.firstName}{" "}
                                                    {teacher.lastName}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.employeeCode}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.campus?.name ??
                                                        campuses.find(
                                                            (campus) =>
                                                                campus.id ===
                                                                teacher.campusId,
                                                        )?.name ??
                                                        teacher.campusId}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={teacher.status}
                                                        size="small"
                                                        color={
                                                            teacher.status ===
                                                            "ACTIVE"
                                                                ? "success"
                                                                : "default"
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack
                                                        direction="row"
                                                        sx={{ justifyContent: "flex-end" }}
                                                    >
                                                        <Button
                                                            size="small"
                                                            onClick={() =>
                                                                void openAssignments(
                                                                    teacher,
                                                                )
                                                            }
                                                        >
                                                            Assignments
                                                        </Button>
                                                        {canUpdate && (
                                                            <Button
                                                                size="small"
                                                                onClick={() =>
                                                                    openTeacher(
                                                                        teacher,
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </Button>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Box>
            <Dialog
                open={formOpen}
                onClose={() => !saving && setFormOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>{selected ? "Edit" : "Add"} Teacher</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {formError && (
                            <Alert severity="error">{formError}</Alert>
                        )}
                        <TextField
                            label="First name"
                            value={form.firstName}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    firstName: event.target.value,
                                })
                            }
                            required
                        />
                        <TextField
                            label="Last name"
                            value={form.lastName}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    lastName: event.target.value,
                                })
                            }
                        />
                        <TextField
                            label="Employee code"
                            value={form.employeeCode}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    employeeCode: event.target.value,
                                })
                            }
                            required
                        />
                        <TextField
                            select
                            label="Campus"
                            value={form.campusId}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    campusId: event.target.value,
                                })
                            }
                            required
                        >
                            {campuses.map((campus) => (
                                <MenuItem key={campus.id} value={campus.id}>
                                    {campus.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Status"
                            value={form.status}
                            onChange={(event) =>
                                setForm({
                                    ...form,
                                    status: event.target
                                        .value as TeacherInput["status"],
                                })
                            }
                        >
                            {["ACTIVE", "INACTIVE"].map((value) => (
                                <MenuItem key={value} value={value}>
                                    {value}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Tenant user ID (optional)"
                            value={form.userId ?? ""}
                            onChange={(event) =>
                                setForm({ ...form, userId: event.target.value })
                            }
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => void saveTeacher()}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={assignmentOpen}
                onClose={() => setAssignmentOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Assignments
                    {assignmentTeacher
                        ? `: ${assignmentTeacher.firstName} ${assignmentTeacher.lastName ?? ""}`
                        : ""}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {formError && (
                            <Alert severity="error">{formError}</Alert>
                        )}
                        {canAssign && (
                            <Stack direction="row" spacing={2}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Subject"
                                    value={assignment.subjectId}
                                    onChange={(event) =>
                                        setAssignment({
                                            ...assignment,
                                            subjectId: event.target.value,
                                        })
                                    }
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.name} ({subject.code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    select
                                    fullWidth
                                    label="Section"
                                    value={assignment.sectionId}
                                    onChange={(event) =>
                                        setAssignment({
                                            ...assignment,
                                            sectionId: event.target.value,
                                        })
                                    }
                                >
                                    {sections
                                        .filter(
                                            (section) =>
                                                section.campusId ===
                                                assignmentTeacher?.campusId,
                                        )
                                        .map((section) => (
                                            <MenuItem
                                                key={section.id}
                                                value={section.id}
                                            >
                                                {section.name}
                                            </MenuItem>
                                        ))}
                                </TextField>
                                <Button
                                    variant="contained"
                                    onClick={() => void saveAssignment()}
                                    disabled={saving}
                                >
                                    Assign
                                </Button>
                            </Stack>
                        )}
                        <Typography variant="subtitle1">
                            Current assignments
                        </Typography>
                        {assignments.length === 0 ? (
                            <Typography color="text.secondary">
                                No assignments found
                            </Typography>
                        ) : (
                            assignments.map((item) => (
                                <Typography key={item.id}>
                                    {item.subject?.name ?? item.subjectId} -{" "}
                                    {item.section?.class?.name ?? "Class"}{" "}
                                    {item.section?.name ?? item.sectionId}
                                </Typography>
                            ))
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignmentOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
}
