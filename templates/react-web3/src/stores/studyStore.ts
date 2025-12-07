import { createStore } from "@/utils/createStore";
import { createJSONStorage } from "zustand/middleware";
import { Course } from "@/services/api/courses";

type StudyState = {
  courses: Course[];
  loading: boolean;
  subTitle: string;
};
type StudyActions = {
  addCourse: (course: Course) => void;
  updateProgress: (id: string, delta: number) => void;
  reset: () => void;
};

// set(fn, shouldReplace, actionName)
export const useStudyStore = createStore<
  StudyState,
  StudyActions
>(
  (set) => ({
    courses: [],
    loading: false,
    subTitle: "学习中心",
    addCourse: (course) =>
      set(
        (state) => {
          state.courses.push(course);
        },
        false,
        "addCourse"
      ),
    updateProgress: (id, delta) =>
      set(
        (state) => {
          const c = state.courses.find(
            (item) => item.id === id
          );
          if (c)
            c.progress = Math.min(
              100,
              Math.max(0, c.progress + delta)
            );
        },
        false,
        `updateProgress/${id}/${
          delta > 0 ? "+" : ""
        }${delta}`
      ),
    reset: () =>
      set(
        (state) => {
          state.courses = [];
          state.loading = false;
        },
        false,
        "reset"
      ),
  }),
  {
    name: "study-store",
    persistOptions: {
      // 本地存储使用localStorage还是sessionStorage
      storage: createJSONStorage(() => sessionStorage),
      // 希望存储的字段有哪些
      partialize: (state) => ({
        courses: state.courses,
      }),
    },
  }
);
