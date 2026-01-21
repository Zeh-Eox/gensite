import React from "react";
import { Loader2Icon } from "lucide-react";

const Home: React.FC = () => {
  const [input, setInput] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input === "") {
      return;
    }
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <>
      <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
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

        <h1 className="text-center text-[40px] leading-12 md:text-6xl md:leading-17.5 mt-8 font-semibold max-w-3xl">
          From idea to live website. Powered by AI.
        </h1>

        <p className="text-center text-base max-w-md mt-6">
          Create, customize, and present faster than ever with AI-powered
          intelligent design.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-16 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all"
        >
          <textarea
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent outline-none text-gray-300 resize-none w-full"
            rows={4}
            placeholder="Describe your presentation in details"
            required
          />
          <button className="ml-auto flex items-center gap-2 bg-indigo-600 rounded-md px-4 py-2">
            {!loading ? (
              "Create with AI"
            ) : (
              <>
                Creating{" "}
                <Loader2Icon className="animate-spin size-4 text-white" />
              </>
            )}
          </button>
        </form>
      </section>
    </>
  );
};

export default Home;
