import SimpleAcademicResourcePage from "./SimpleAcademicResourcePage";
import { subjectApi, type Subject } from "../../api/helpers/subject-api/subject-api.helper";
export default function SubjectsPage() { return <SimpleAcademicResourcePage<Subject> title="Subjects" singular="Subject" description="Manage institution subjects" list={subjectApi.list} create={subjectApi.create} update={subjectApi.update} fields={[{ key: "name", label: "Name" }, { key: "code", label: "Code" }, { key: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"] }]} />; }
