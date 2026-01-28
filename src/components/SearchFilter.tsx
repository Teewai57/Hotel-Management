import { Calendar, Plus } from 'lucide-react';

interface SearchFilterProps {
  searchName: string;
  setSearchName: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  room: string;
  setRoom: (val: string) => void;
  onReset: () => void;
  onAddGuest: () => void;
}

export default function SearchFilter({ 
  searchName, setSearchName,
  checkIn, setCheckIn,
  checkOut, setCheckOut,
  room, setRoom,
  onReset,
  onAddGuest
}: SearchFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center mb-6">
      <div className="w-full md:w-1/4">
        <input
          type="text"
          placeholder="Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      <div className="w-full md:w-1/4 relative">
         {/* If type='date', the placeholder might not show depending on browser. 
             If we use type='text' with onFocus->type='date', custom value might be tricky.
             Let's just use type='text' for simplicity or 'date' if possible. 
             Ideally type='date' but placeholder issue. Keeping text->date trick or just date.
         */}
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Check-In Date"
          onFocus={(e) => (e.target.type = 'date')}
          onBlur={(e) => (e.target.value === '' ? e.target.type = 'text' : e.target.type = 'date')}
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 text-sm appearance-none"
        />
      </div>

      <div className="w-full md:w-1/4 relative">
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Calendar className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Check-Out Date"
           onFocus={(e) => (e.target.type = 'date')}
           onBlur={(e) => (e.target.value === '' ? e.target.type = 'text' : e.target.type = 'date')}
           value={checkOut}
           onChange={(e) => setCheckOut(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

       <div className="w-full md:w-1/6 relative">
         <select 
            value={room} 
            onChange={(e) => setRoom(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500 text-sm bg-white cursor-pointer"
         >
            <option value="">Room</option>
            <option value="101">101</option>
            <option value="102">102</option>
            <option value="202">202</option>
            <option value="208">208</option>
            <option value="212">212</option>
            <option value="310">310</option>
            <option value="318">318</option>
            <option value="405">405</option>
            <option value="507">507</option>
         </select>
       </div>

      <div className="w-full md:w-auto flex gap-2 ml-auto">
        <button 
          onClick={onReset}
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded bg-white hover:bg-blue-50 text-sm font-medium"
        >
          Reset
        </button>
        <button 
            onClick={onAddGuest}
            className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 text-sm font-medium flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          Add Guest
        </button>
      </div>
    </div>
  );
}
