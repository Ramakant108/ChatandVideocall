import { THEMES } from "../Constant/index.js";
import { useThemeStore } from "../Store/isThemeStore.js";

const Setting = () => {
  const { themes, setTheme } = useThemeStore();

  return (
    <div className="min-h-[calc(100vh-64px)] p-4 bg-base-200">
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-base-100 rounded-xl p-4 sm:p-6 space-y-6 shadow-lg border border-base-300">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Theme Settings</h2>
            <p className="mt-2 text-sm text-base-content/70">
              Choose a theme for your interface
            </p>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
                  ${themes === t ? "bg-base-200 ring-2 ring-primary/20" : "hover:bg-base-200/50"}
                `}
                onClick={() => setTheme(t)}   
              >
                <div className="relative h-8 w-full rounded-md overflow-hidden shadow-sm" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;

