function SearchBar({ searchTerm, setSearchTerm, fromDate, toDate, setFromDate, setToDate, user }) {
  const showHint = user?.role === 'user' || user?.role === 'staff';

  return (
    <div className="mb-4 flex md:flex-row flex-col items-center gap-8">
      <div className="w-full md:w-1/3 relative flex gap-2 items-center sm:mr-44 md:mr-72 lg:mr-96">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="Search to view your data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="border px-3 py-2 pl-10 pr-10 rounded w-full"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-2 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* ✅ Added From and To date filter */}
      <div className="flex flex-row sm:flex-row gap-3 mt-3 md:text-base sm:text-sm text-xs ">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 sm:text-sm text-xs">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-gray-700 sm:text-sm text-xs">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate('');
              setToDate('');
            }}
            className="bg-blue-500 hover:bg-blue-600 text-sm px-3 py-1 rounded"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
