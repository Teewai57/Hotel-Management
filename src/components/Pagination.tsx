export default function Pagination() {
  return (
    <div className="flex justify-end items-center gap-2 mt-4 text-sm">
      <button className="px-3 py-1 border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50">
        Previous
      </button>
      
      <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-medium">
        1
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
        2
      </button>
      <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
        3
      </button>
       <span className="text-gray-400">...</span>
      <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
        25
      </button>

      <button className="px-3 py-1 border border-gray-200 rounded bg-white text-gray-600 hover:bg-gray-50">
        Next &gt;
      </button>
    </div>
  );
}
