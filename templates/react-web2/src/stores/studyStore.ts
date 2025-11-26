import { createStore } from "@/utils/createStore";
import { createJSONStorage } from "zustand/middleware";

type Course = {
  id: string;
  title: string;
  level: string;
  progress: number;
  tag: string;
};
type StudyState = { courses: Course[]; loading: boolean };
type StudyActions = {
  addCourse: (course: Course) => void;
  updateProgress: (id: string, delta: number) => void;
  reset: () => void;
};

const seed: Course[] = [
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

// set(fn, shouldReplace, actionName)
export const useStudyStore = createStore<
  StudyState,
  StudyActions
>(
  (set) => ({
    courses: seed,
    loading: false,
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
          state.courses = seed;
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
