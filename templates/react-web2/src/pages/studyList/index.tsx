import React from 'react';

const courses = [
  { title: 'Modern JS Patterns', level: '中级', progress: 72, tag: '前端' },
  { title: 'System Design Primer', level: '高级', progress: 40, tag: '架构' },
  { title: 'TypeScript Deep Dive', level: '中级', progress: 85, tag: '语言' },
  { title: 'UI/UX Essentials', level: '初级', progress: 55, tag: '设计' },
];

const StudyList = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <div
          key={course.title}
          className="flex flex-col gap-3 rounded-lg bg-white/5 p-4 ring-1 ring-white/5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-300">{course.tag}</p>
              <h3 className="text-lg font-semibold text-white">{course.title}</h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
              {course.level}
            </span>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>进度</span>
              <span>{course.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
          <button className="self-start text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            继续学习 →
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudyList;
