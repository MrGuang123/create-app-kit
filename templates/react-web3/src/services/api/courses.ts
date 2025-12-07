import { request } from "@/utils/request";

export type Course = {
  id: string;
  title: string;
  level: string;
  progress: number;
  tag: string;
};

export const coursesApi = {
  getAll: () => request.get<Course[]>("courses"),

  getById: (id: string) =>
    request.get<Course>(`courses/${id}`),

  create: (data: Omit<Course, "id">) =>
    request.post<Course>("courses", data),

  update: (id: string, data: Partial<Course>) =>
    request.put<Course>(`courses/${id}`, data),

  delete: (id: string) =>
    request.delete<void>(`courses/${id}`),
};
