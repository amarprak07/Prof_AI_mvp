import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/**
 * CoursesPage
 * - Fetches courses from `http://127.0.0.1:5001/api/courses` (your provided endpoint)
 * - Normalizes the response to a common shape so UI code stays tidy
 * - Shows loading skeletons, error state, empty state
 * - Client-side search (by title) — easy to expand later
 *
 * Your API response example:
 * [
 *   {
 *     "course_id": "1",
 *     "course_title": "Comprehensive Study of Nutrition and Changes in Matter"
 *   }
 * ]
 */
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://127.0.0.1:5001/api/courses", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : [];
        // Normalize to a common internal shape: { id, title }
        const normalized = data.map((c) => ({
          id: c.course_id ?? c.id ?? c.slug ?? String(Math.random()),
          title: c.course_title ?? c.title ?? "Untitled course",
          // Placeholders for future fields from your API
          description: c.description ?? "",
          thumbnail: c.thumbnail ?? "",
          level: c.level ?? "",
          duration: c.duration ?? "",
          price: c.price,
        }));
        if (isMounted) setCourses(normalized);
      } catch (err) {
        if (isMounted) setError(err?.message || "Failed to load courses");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => !q || c.title.toLowerCase().includes(q));
  }, [courses, query]);

  return (
    <div className="min-h-screen bg-gray-800">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <h1 className="text-3xl text-white font-bold tracking-tight text-neutral-900">Courses</h1>
        {/* <p className="mt-2 text-neutral-600">Fetched from <code className="px-1 py-0.5 bg-neutral-200 rounded">http://127.0.0.1:5001/api/courses</code></p> */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title"
            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            onClick={() => setQuery("")}
            className="rounded-2xl bg-neutral-900 text-white px-4 py-3 font-medium hover:bg-neutral-800 active:scale-[.99]"
          >
            Clear search
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-neutral-200 bg-white">
                <div className="h-40 w-full rounded-t-2xl bg-neutral-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 w-2/3 bg-neutral-200 rounded" />
                  <div className="h-4 w-full bg-neutral-200 rounded" />
                  <div className="h-4 w-5/6 bg-neutral-200 rounded" />
                  <div className="h-9 w-28 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Could not load courses</p>
            <p className="text-sm mt-1">{error}</p>
            <div className="mt-4 text-sm text-neutral-600">
              <p>If you're running the API locally, verify it's up on <code className="px-1 py-0.5 bg-neutral-200 rounded">http://127.0.0.1:5001/api/courses</code> and that CORS allows your frontend origin.</p>
              <p className="mt-1">For Vite, you can also proxy <code className="px-1 py-0.5 bg-neutral-200 rounded">/api</code> to avoid CORS during local dev.</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-lg font-medium text-neutral-800">No courses found</p>
            <p className="text-neutral-600 mt-1">Try clearing your search or add courses to the backend.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {filtered.map((course) => (
              <li key={course.id} className="group">
                <article className="h-full rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-40 w-full bg-neutral-100 flex items-center justify-center">
                    <span className="text-neutral-400 text-sm">Course {course.id}</span>
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">{course.title}</h3>
                    {course.description && (
                      <p className="text-sm text-neutral-600 line-clamp-3">{course.description}</p>
                    )}

                    <div className="mt-2">
                      <Link
                        to={`/chat`}
                        className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-white text-sm font-medium hover:bg-neutral-800 active:scale-[.99]"
                      >
                        Enter Course
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
