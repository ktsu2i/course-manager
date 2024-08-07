import CourseTable from "./_components/CourseTable";

import getAllProfessors from "../actions/getAllProfessors";
import getAllCourses from "../actions/getAllCourses";
import getCurrentUserFromDb from "../actions/getCurrentUserFromDb";
import getAllUniqueRecordKeys from "../actions/getAllUniqueRecordKeys";
import { auth } from "@/auth";

const CourseManagementPage = async () => {
  const professors = await getAllProfessors();
  const courses = await getAllCourses();
  const recordKeys = await getAllUniqueRecordKeys();

  const session = await auth();

  const isAdmin = session?.user.roles.includes("admin");
  const isCoordinator = session?.user.roles.includes("coordinator");
  const isFaculty = session?.user.roles.includes("faculty");

  return (
    <>
      <div
        className={`pt-[85px] px-10 ${
          !isAdmin && !isCoordinator && !isFaculty && "hidden"
        }`}
      >
        <h1 className="text-2xl font-bold">Manage Courses</h1>
        <p className="text-slate-500 mt-1">
          You can request for adding, updating, and deleting courses.
        </p>
        <div className="mt-8">
          <CourseTable
            professors={professors}
            courses={courses}
            recordKeys={recordKeys}
          />
        </div>
      </div>
      <div
        className={`h-full flex items-center justify-center ${
          (isAdmin || isCoordinator || isFaculty) && "hidden"
        }`}
      >
        You cannot access this.
      </div>
    </>
  );
};

export default CourseManagementPage;
