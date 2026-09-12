import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <span className="text-3xl font-bold text-naano-dark">naano</span>
      <h1 className="text-3xl md:text-4xl font-bold text-naano-dark mt-4 max-w-xl">
        The B2B LinkedIn Creator Marketplace
      </h1>
      <p className="text-gray-500 mt-3 max-w-md">
        Brands book sponsored LinkedIn posts from creators. Creators turn their audience into revenue.
      </p>
      <div className="flex gap-3 mt-8">
        <Link
          to="/register"
          className="bg-naano-blue text-white font-medium px-6 py-2.5 rounded-xl hover:bg-naano-blue/90"
        >
          Get started
        </Link>
        <Link
          to="/login"
          className="border border-gray-200 text-naano-dark font-medium px-6 py-2.5 rounded-xl hover:bg-gray-50"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
