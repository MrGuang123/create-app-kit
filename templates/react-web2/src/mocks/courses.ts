import { MockType } from "@/types/request";
import { Course } from "@/services/api/courses";

// 模拟课程数据
export const mockCourses: Course[] = [
  {
    id: "modern-js",
    title: "Modern JS Patterns",
    level: "中级",
    progress: 72,
    tag: "前端",
  },
  {
    id: "system-design",
    title: "System Design Primer",
    level: "高级",
    progress: 40,
    tag: "架构",
  },
  {
    id: "ts-deep-dive",
    title: "TypeScript Deep Dive",
    level: "中级",
    progress: 85,
    tag: "语言",
  },
  {
    id: "ui-ux",
    title: "UI/UX Essentials",
    level: "初级",
    progress: 55,
    tag: "设计",
  },
];

export const coursesMock: MockType[] = [
  {
    method: "GET",
    path: /^\/api\/courses$/,
    handler: () => [...mockCourses],
  },
  {
    method: "GET",
    path: /^\/api\/courses\/(\w+)$/,
    handler: (matches) => {
      const id = matches[1];
      const course = mockCourses.find((c) => c.id === id);
      if (!course)
        throw { status: 404, message: "Not found" };
      return course;
    },
  },
  {
    method: "POST",
    path: /^\/api\/courses$/,
    handler: (_, body) => {
      const data = body as Omit<Course, "id">;
      const newCourse = {
        id: Date.now().toString(),
        ...data,
      };
      mockCourses.push(newCourse);
      return newCourse;
    },
  },
  {
    method: "PUT",
    path: /^\/api\/courses\/(\w+)$/,
    handler: (matches, body) => {
      const id = matches[1];
      const data = body as Omit<Course, "id">;
      const index = mockCourses.findIndex(
        (c) => c.id === id
      );
      if (index === -1)
        throw { status: 404, message: "Not found" };
      mockCourses[index] = {
        ...mockCourses[index],
        ...data,
      };
      return mockCourses[index];
    },
  },
  {
    method: "DELETE",
    path: /^\/api\/courses\/(\w+)$/,
    handler: (matches) => {
      const id = matches[1];
      const index = mockCourses.findIndex(
        (c) => c.id === id
      );
      if (index !== -1) mockCourses.splice(index, 1);
      return null;
    },
  },
];
