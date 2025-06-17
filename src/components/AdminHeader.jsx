import React from 'react';
import { BellIcon, LogOutIcon } from 'lucide-react';

export function AdminHeader() {
  return (<header className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div className="text-xl font-bold">읽담 관리자</div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button className="relative p-1 rounded-full hover:bg-gray-700">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-0 right-0 bg-[#E88D67] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-sm">
              관
            </div>
            <div className="text-sm">
              <div>관리자</div>
            </div>
            <button className="p-1 rounded hover:bg-gray-700">
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
    );
};
export default AdminHeader;