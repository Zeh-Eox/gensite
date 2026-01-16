import React from "react";

const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);

  return (
    <>
      <nav className="z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur border-b text-white border-slate-800">
        <a href="/" className="flex gap-2">
          <img src="/logo.svg" alt="" />
          <h1 className="text-4xl font-bold">Gensite</h1>
        </a>

        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <a href="#products" className="hover:text-slate-300 transition">
            Home
          </a>
          <a href="#resources" className="hover:text-slate-300 transition">
            Projects
          </a>
          <a href="#stories" className="hover:text-slate-300 transition">
            Community
          </a>
          <a href="#pricing" className="hover:text-slate-300 transition">
            Pricing
          </a>
        </div>

        <div className="hidden md:block space-x-3">
          <button className="active:scale-95 hover:bg-indigo-600/20 transition px-4 py-2 border border-indigo-600 rounded-md">
            Sign in
          </button>
          <button className="px-6 py-2 bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded-md">
            Get started
          </button>
        </div>

        <button
          id="open-menu"
          className="md:hidden active:scale-90 transition"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300">
          <a href="#products" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#resources" onClick={() => setMenuOpen(false)}>
            Projects
          </a>
          <a href="#stories" onClick={() => setMenuOpen(false)}>
            Community
          </a>
          <a href="#pricing" onClick={() => setMenuOpen(false)}>
            Pricing
          </a>

          <button
            className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default Navigation;
