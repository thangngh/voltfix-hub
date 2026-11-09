import React from 'react';
import { NotificationItem, UserRole } from '../types';
import { Bell, X, Check, Clock, AlertTriangle, Activity, Package, CheckCheck } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateToBookingOrOrder: (code?: string) => void;
  currentRole: UserRole;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateToBookingOrOrder,
  currentRole
}) => {
  if (!isOpen) return null;

  // Filter notifications visible to current role
  const visibleNotifications = notifications.filter(
    n => n.roleTarget === 'all' || n.roleTarget === currentRole
  );

  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl border-l border-slate-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Thông Báo Thời Gian Thực
            </h3>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Phân quyền: <strong className="text-slate-800 uppercase">{currentRole}</strong></span>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Đọc tất cả</span>
            </button>
          )}
        </div>

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {visibleNotifications.map((notif) => {
            const isBooking = notif.type === 'booking';
            const isInventory = notif.type === 'inventory';

            return (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  if (notif.actionUrl) {
                    onNavigateToBookingOrOrder(notif.actionUrl);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 ${
                  notif.read 
                    ? 'border-slate-100 bg-white hover:bg-slate-50' 
                    : 'border-emerald-200 bg-emerald-50/40 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    {isBooking ? (
                      <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : isInventory ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    )}
                    <span className="line-clamp-1">{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {notif.timestamp.split(' ')[0]}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{notif.timestamp}</span>
                  </span>

                  {!notif.read && (
                    <span className="text-emerald-700 font-semibold text-[10px]">
                      Mới
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {visibleNotifications.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Hiện không có thông báo nào.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
