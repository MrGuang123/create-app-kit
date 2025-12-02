import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">
          404
        </h1>
        <p className="mt-4 text-muted-foreground">
          页面不存在
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-primary hover:text-primary/80 hover:underline"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
