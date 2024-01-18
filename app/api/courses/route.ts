import { db } from "@/lib/db";

import { currentUser } from "@clerk/nextjs";
import { addHours, setHours } from "date-fns";
import { NextResponse } from "next/server";

interface ISchedule {
  [day: string]: {
    start: string;
    end: string;
  }
};

export async function POST(
  request: Request
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      department,
      courseNum,
      section,
      title,
      crn,
      credits,
      instructorId,
      isNewInstructor,
      dayAndTime,
      days,
      startHour,
      startMin,
      startAmOrPm,
      endHour,
      endMin,
      endAmOrPm,
      semester,
      year,
      classType,
      roomNum,
      hasSecuredRoom,
      specialInfo,
      notes,
    } = await request.json();

    const startDate = new Date(2000, 1, 1, Number(startHour), Number(startMin));
    if (startAmOrPm === "am" && startHour === "12") {
      setHours(startDate, 0);
    }
    if (startAmOrPm === "pm") {
      addHours(startDate, 12);
    }

    const endDate = new Date(2000, 1, 1, Number(endHour), Number(endMin));
    if (endAmOrPm === "am" && endHour === "12") {
      setHours(endDate, 0);
    }
    if (endAmOrPm === "pm") {
      addHours(endDate, 12);
    }

    const startUTC = startDate.toISOString();
    const endUTC = endDate.toISOString();

    const schedule: ISchedule = {};
    days.forEach((day: string) => {
      schedule[day] = { start: startUTC, end: endUTC };
    });

    const padCourseNum = String(courseNum).padStart(4, "0");
    const label = `${department.toUpperCase()} ${padCourseNum} (${section})`;

    let course;

    if (classType === "online") {
      course = await db.course.create({
        data: {
          department: department,
          courseNum: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          userId: instructorId,
          isNewInstructor: isNewInstructor,
          dayAndTime: dayAndTime,
          schedule: schedule,
          semester: semester,
          year: year,
          classType: classType,
          specialInfo: specialInfo,
          notes: notes,
          label: label,
        },
      });
    } else {
      course = await db.course.create({
        data: {
          department: department,
          courseNum: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          userId: instructorId,
          isNewInstructor: isNewInstructor,
          dayAndTime: dayAndTime,
          schedule: schedule,
          semester: semester,
          year: year,
          classType: classType,
          roomNum: roomNum,
          hasSecuredRoom: hasSecuredRoom,
          specialInfo: specialInfo,
          notes: notes,
          label: label,
        },
      });
    }

    return NextResponse.json(course);

  } catch (error) {
    console.log("[COURSES] - POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
) {
  try {
    const user = await currentUser();
    const {
      id,
      department,
      courseNum,
      section,
      title,
      crn,
      credits,
      instructorId,
      isNewInstructor,
      dayAndTime,
      semester,
      year,
      customYear,
      classType,
      roomNum,
      hasSecuredRoom,
      specialInfo,
      notes,
      status,
    } = await request.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(status);
    const padCourseNum = String(courseNum).padStart(4, '0');
    const updatedLabel = `${department.toUpperCase()} ${padCourseNum} (${section})`;

    let yearValue: number;
    if (year === "other") {
      yearValue = customYear;
    } else {
      yearValue = Number(year);
    }

    let course;

    if (classType === "online") {
      course = await db.course.update({
        where: {
          id: id,
        },
        data: {
          department: department,
          courseNum: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          userId: instructorId,
          isNewInstructor: isNewInstructor,
          dayAndTime: dayAndTime,
          semester: semester,
          year: yearValue,
          classType: classType,
          roomNum: undefined,
          hasSecuredRoom: undefined,
          specialInfo: specialInfo,
          notes: notes,
          label: updatedLabel,
          status: status,
        },
      });
    } else {
      course = await db.course.update({
        where: {
          id: id,
        },
        data: {
          department: department,
          courseNum: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          userId: instructorId,
          isNewInstructor: isNewInstructor,
          dayAndTime: dayAndTime,
          semester: semester,
          year: yearValue,
          classType: classType,
          roomNum: roomNum,
          hasSecuredRoom: hasSecuredRoom,
          specialInfo: specialInfo,
          notes: notes,
          label: updatedLabel,
          status: status,
        },
      });
    }

    return NextResponse.json(course);

  } catch (error) {
    console.log("[COURSES] - PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    const user = await currentUser();
    const { courseId } = await request.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json({ message: "Success" });

  } catch (error) {
    console.log("[COURSES] - DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}