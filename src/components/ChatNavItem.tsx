// Simple Sidebar Navigation Item with Dynamic Badge
import { LucideMessageCircleDashed } from 'lucide-react';

export const ChatNavItem = ({ unreadCount = 0 }) => {
  return (
    <button
        className="flex items-center justify-between w-full max-w-[160px] rounded-lg border border-gray-200 bg-white px-3 py-2 transition hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <LucideMessageCircleDashed
            size={16}
            className="text-gray-600"
          />

          <span className="text-sm font-medium text-gray-700">
            Chat
          </span>
        </div>

        {unreadCount > 0 && (
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
  );
};