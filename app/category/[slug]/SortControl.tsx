"use client";

export default function SortControl({
  slug,
  sort,
}: {
  slug: string;
  sort: string;
}) {
  function handleChange(value: string) {
    if (value === "default") {
      window.location.href = `/category/${slug}`;
      return;
    }

    window.location.href = `/category/${slug}?sort=${value}`;
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort"
        className="text-sm font-semibold text-gray-600"
      >
        সাজান:
      </label>

      <select
        id="sort"
        value={sort}
        onChange={(event) =>
          handleChange(event.target.value)
        }
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 outline-none focus:border-green-600"
      >
        <option value="default">
          ডিফল্ট
        </option>

        <option value="low">
          দাম: কম থেকে বেশি
        </option>

        <option value="high">
          দাম: বেশি থেকে কম
        </option>
      </select>
    </div>
  );
}