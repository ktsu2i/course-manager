// import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";

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
    const supabase = createClient();
    const user = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      id,
      recordKey,
      department,
      courseNum,
      section,
      title,
      crn,
      credits,
      instructorId,
      isNewInstructor,
      days,
      startHour,
      startMin,
      startAmOrPm,
      endHour,
      endMin,
      endAmOrPm,
      semester,
      year,
      customYear,
      classType,
      roomNum,
      hasSecuredRoom,
      specialInfo,
      notes,
    } = await request.json();

    const startDate = new Date(2000, 0, 1, Number(startHour), Number(startMin));
    if (startAmOrPm === "am" && startHour === "12") {
      startDate.setHours(0);
    }
    if (startAmOrPm === "pm") {
      startDate.setHours(startDate.getHours() + 12);
    }

    const endDate = new Date(2000, 0, 1, Number(endHour), Number(endMin));
    if (endAmOrPm === "am" && endHour === "12") {
      endDate.setHours(0);
    }
    if (endAmOrPm === "pm") {
      endDate.setHours(endDate.getHours() + 12);
    }

    const startUTC = startDate.toISOString();
    const endUTC = endDate.toISOString();

    const schedule: ISchedule = {};
    days.forEach((day: string) => {
      schedule[day] = { start: startUTC, end: endUTC };
    });

    const padCourseNum = String(courseNum).padStart(4, "0");
    const label = `${department.toUpperCase()} ${padCourseNum} (${section})`;

    let yearValue: number;
    if (year === "other") {
      yearValue = customYear;
    } else {
      yearValue = Number(year);
    }

    let course;

    if (id) {
      // add an updated course
      if (classType === "online") {
        course = await axios.post(`http:localhost:8080/api/courses`, {
          record_key: recordKey,
          department: department,
          course_number: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          instructor_id: instructorId,
          schedule: schedule,
          semester: semester,
          year: yearValue,
          class_type: classType,
          special_info: specialInfo,
          notes: notes,
          label: label,
          status: "updated"
        });
      } else {
        course = await axios.post(`http:localhost:8080/api/courses`, {
          record_key: recordKey,
          department: department,
          course_number: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          instructor_id: instructorId,
          schedule: schedule,
          semester: semester,
          year: yearValue,
          class_type: classType,
          room_number: roomNum,
          has_secured_room: hasSecuredRoom,
          special_info: specialInfo,
          notes: notes,
          label: label,
          status: "updated"
        });
      }
    } else {
      // add a new course
      if (classType === "online") {
        course = await axios.post(`http:localhost:8080/api/courses`, {
          record_key: recordKey,
          department: department,
          course_number: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          instructor_id: instructorId,
          schedule: schedule,
          semester: semester,
          year: yearValue,
          class_type: classType,
          special_info: specialInfo,
          notes: notes,
          label: label,
          status: "updated"
        });
      } else {
        course = await axios.post(`http:localhost:8080/api/courses`, {
          record_key: recordKey,
          department: department,
          course_number: courseNum,
          section: section,
          title: title,
          crn: crn,
          credits: Number(credits),
          instructor_id: instructorId,
          schedule: schedule,
          semester: semester,
          year: yearValue,
          class_type: classType,
          room_number: roomNum,
          has_secured_room: hasSecuredRoom,
          special_info: specialInfo,
          notes: notes,
          label: label,
          status: "updated"
        });
      }
    }

    return NextResponse.json(course);

  } catch (error) {
    console.log("[COURSES] - POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    // const user = await currentUser();
    const supabase = createClient();
    const user = await supabase.auth.getUser();

    const { recordKey } = await request.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await axios.delete(`http:localhost:8080/api/courses/${recordKey}`);

    return NextResponse.json({ message: "Success" });

  } catch (error) {
    console.log("[COURSES] - DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}