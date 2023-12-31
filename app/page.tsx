import { SignedIn } from "@clerk/nextjs";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import WelcomeCard from "@/components/WelcomeCard";
import UserInfoCard from "@/components/UserInfoCard";

import getCurrentUserFromDb from "./actions/getCurrentUserFromDb";
import getAllCourses from "./actions/getAllCourses";
import CourseTable from "@/components/CourseTable";
import { Card, CardContent } from "@/components/ui/card";

export default async function Home() {
  const currentUser = await getCurrentUserFromDb();
  const courses = await getAllCourses();

  const hasRegistered = currentUser !== null;
  const isAdmin = currentUser?.isAdmin;
  const isCoordinator = currentUser?.isCoordinator;
  const isFaculty = currentUser?.isFaculty;
  const isStaff = currentUser?.isStaff;
  const hasNoRoles = !isAdmin && !isCoordinator && !isFaculty && !isStaff;

  let role;

  if (isAdmin) {
    role = "Admin";
  } else if (isCoordinator) {
    role = "Coordinator";
  } else if (isFaculty) {
    role = "Faculty";
  } else if (isStaff) {
    role = "Staff";
  } else {
    role = "Guest";
  }

  let alertContent;

  if (hasRegistered) {
    if (hasNoRoles) {
      alertContent = (
        <>
          <div className="text-bold text-center">Your Role: ---</div>
          <div className="text-slate-600 text-center">
            Please wait until the coordinator adds your role.
          </div>
        </>
      );
    } else {
      alertContent = (
        <div className="text-bold text-center">Your Role: {role}</div>
      );
    }
  } else {
    alertContent = (
      <SignedIn>
        <WelcomeCard />
      </SignedIn>
    );
  }

  return (
    <>
      {/* <div className="w-1/2 mx-auto pt-[85px]">{alertContent}</div> */}
      {/* <div className="pt-[65px]"></div> */}
      {/* <WelcomeCard /> */}
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical" className="pt-[65px]">
            <ResizablePanel defaultSize={17} minSize={17}>
              <div className="m-5 max-w-[500px] flex">
                <UserInfoCard currentUser={currentUser} />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={83}>
              <div className="m-10">
                <h1 className="text-2xl font-bold">Your Courses</h1>
                <CourseTable courses={courses} currentUser={currentUser} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20}>
          {/* <div className="pt-[65px] m-5">
            <h1 className="text-2xl font-bold">Your Courses</h1>
            <CourseTable courses={courses} currentUser={currentUser} />
          </div> */}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
