import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-gray-500">页面不存在</p>
        <Link
          to="/"
          className="mt-4 text-blue-500 hover:underline"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
