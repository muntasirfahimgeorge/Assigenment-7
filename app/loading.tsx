export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <header className="bazar-header">
        <div className="bazar-container">
          <div className="bazar-header-top">
            <div className="h-10 w-32 rounded-lg bazar-skeleton" />
            <div className="h-9 w-24 rounded-lg bazar-skeleton" />
          </div>

          <div className="flex gap-2 py-3">
            <div className="h-8 w-14 rounded-lg bazar-skeleton" />
            <div className="h-8 w-14 rounded-lg bazar-skeleton" />
            <div className="h-8 w-14 rounded-lg bazar-skeleton" />
            <div className="h-8 w-14 rounded-lg bazar-skeleton" />
            <div className="h-8 w-14 rounded-lg bazar-skeleton" />
          </div>
        </div>
      </header>

      <div className="bazar-container">
        <div className="mt-10 h-72 rounded-2xl bazar-skeleton" />

        <section className="mt-12">
          <div className="mb-5 h-10 w-48 rounded-lg bazar-skeleton" />

          <div className="bazar-product-grid">
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
        </section>
      </div>
    </main>
  );
}
