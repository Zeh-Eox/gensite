import React from "react";
import Navigation from "../components/Navigation";
import toast from "react-hot-toast";

const Home: React.FC = () => {
  const [input, setInput] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input === "") {
      toast.error("Please enter a description");
      return;
    }
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Presentation created successfully!");
    }, 3000);
  };

  return (
    <>
      <Navigation />

      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
        {/* BACKGROUND IMAGE */}
        <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png"
          className="absolute inset-0 -z-10 size-full opacity"
          alt=""
        />

        <a
          href="#"
          className="flex items-center gap-2 border border-slate-700 rounded-full p-1 pr-3 text-sm mt-20"
        >
          <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full">
            NEW
          </span>
          <p className="flex items-center gap-2">
            <span>Try 30 days free trial option</span>
            <svg
              className="mt-px"
              width="6"
              height="9"
              viewBox="0 0 6 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m1 1 4 3.5L1 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
        </a>

        <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
          From idea to live website. Powered by AI.
        </h1>

        <p className="text-center text-base max-w-md mt-2">
          Create, customize, and present faster than ever with AI-powered
          intelligent design.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all"
        >
          <textarea
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent outline-none text-gray-300 resize-none w-full"
            rows={4}
            placeholder="Describe your presentation in details"
            required
          />
          <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#CB52D4] to-indigo-600 rounded-md px-4 py-2">
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Create with AI"
            )}
          </button>
        </form>
      </section>
    </>
  );
};

export default Home;
