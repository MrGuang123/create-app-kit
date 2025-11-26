import { useStudyStore } from "../../stores/studyStore";

const StudyList = () => {
  const courses = useStudyStore((s) => s.courses);
  const updateProgress = useStudyStore(
    (s) => s.updateProgress
  );
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <div
          key={course.title}
          className="flex flex-col gap-3 p-4 rounded-lg bg-white/5 ring-1 ring-white/5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-300">
                {course.tag}
              </p>
              <h3 className="text-lg font-semibold text-white">
                {course.title}
              </h3>
            </div>
            <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80">
              {course.level}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1 text-xs text-slate-300">
              <span>进度</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
          <button className="self-start text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            继续学习 →
          </button>
          <button
            className="self-start text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            onClick={() => updateProgress(course.id, 5)}
          >
            进度 +5%
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudyList;
