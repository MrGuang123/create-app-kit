import { useState, memo } from "react";
import { useStudyStore } from "../../stores/studyStore";
import { useCourses } from "@/services/useCourses";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/shadcn/ui/dialog";

const StudyList = memo(() => {
  const {
    data: courses = [],
    isLoading,
    error,
  } = useCourses();
  // const courses = useStudyStore((s) => s.courses);
  const subTitle = useStudyStore((s) => s.subTitle);
  const updateProgress = useStudyStore(
    (s) => s.updateProgress
  );
  const [count, setCount] = useState(0);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <button
        onClick={() => setCount((c) => c + 1)}
        className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Force Re-render ({count}) {subTitle}
      </button>
      <Dialog>
        <DialogTrigger asChild>
          <Button>打开弹窗</Button>
        </DialogTrigger>
        <DialogContent>
          <p>弹窗内容</p>
        </DialogContent>
      </Dialog>
      {courses.map((course) => (
        <div
          key={course.title}
          className="flex flex-col gap-3 p-4 rounded-lg bg-card ring-1 ring-border"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {course.tag}
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                {course.title}
              </h3>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
              {course.level}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1 text-xs text-muted-foreground">
              <span>进度</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
          <button className="self-start text-sm font-semibold text-primary hover:text-primary/80">
            继续学习 →
          </button>
          <button
            data-testid="progress-button"
            className="self-start text-sm font-semibold text-primary hover:text-primary/80"
            onClick={() => updateProgress(course.id, 5)}
          >
            进度 +5%
          </button>
        </div>
      ))}
    </div>
  );
});

StudyList.whyDidYouRender = true;

export default StudyList;
