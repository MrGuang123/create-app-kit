const items = [
  { title: "实验功能 A", desc: "快速接入的尝鲜特性" },
  { title: "实验功能 B", desc: "正在灰度的流程优化" },
  { title: "实验功能 C", desc: "等待反馈的交互改进" },
];

const NewFeature = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-lg bg-card p-4 ring-1 ring-border"
        >
          <h3 className="text-lg font-semibold text-foreground">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.desc}
          </p>
          <button className="mt-3 text-sm font-semibold text-primary hover:text-primary/80">
            查看详情 →
          </button>
        </div>
      ))}
    </div>
  );
};

export default NewFeature;
