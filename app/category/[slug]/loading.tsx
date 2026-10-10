export default function Loading() {
  return (
    <main className="min-h-screen bg-[#fafbf8]">
      <header className="bazar-header">
        <div className="bazar-container">
          <div className="bazar-header-top">
            <div className="h-10 w-32 rounded-lg bazar-skeleton" />
            <div className="h-9 w-24 rounded-lg bazar-skeleton" />
          </div>
        </div>
      </header>

      <div className="bazar-container py-10">
        <div className="h-10 w-56 rounded-lg bazar-skeleton" />

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="h-32 rounded-lg bazar-skeleton" />

              <div className="mt-4 h-4 w-24 rounded bazar-skeleton" />

              <div className="mt-2 h-3 w-16 rounded bazar-skeleton" />

              <div className="mt-5 h-5 w-20 rounded bazar-skeleton" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
