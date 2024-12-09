export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-gray-500">
          Have questions or feedback?{" "}
          <a
            href="mailto:kylem70698@gmail.com"
            className="hover:text-indigo-600 transition-colors"
          >
            Email me
          </a>
          . Also check out{" "}
          <a
            href="https://massapply.io"
            className="underline hover:text-indigo-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            massapply.io
          </a>{" "}
          - apply to hundreds of SWE jobs in minutes
        </p>
      </div>
    </footer>
  );
}
