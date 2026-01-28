import { Menu, User } from 'lucide-react';


export default function Header() {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Using a simple briefcase-like icon or box for the logo as per image */}
          <div className="bg-white text-blue-900 p-1 rounded-sm">
             <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Hotel Management System</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
               <User className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline">Manager</span>
          </div>
          <button className="p-1 hover:bg-white/10 rounded">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
