import React from 'react';
import { UserRole } from '../types';
import { User, Wrench, ShieldCheck, RefreshCw } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activePartnerName?: string;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  activePartnerName
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
            Trình chuyển đổi Phân quyền (3 Roles Demo):
          </span>
          <span className="text-slate-400 hidden sm:inline">
            Khám phá đầy đủ nghiệp vụ từ góc nhìn Khách hàng, Chủ tiệm/Kho và Quản trị viên
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => onRoleChange('user')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              currentRole === 'user'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. User (Khách hàng)</span>
          </button>

          <button
            onClick={() => onRoleChange('partner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              currentRole === 'partner'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>2. Partner (Tiệm & Kho)</span>
            {activePartnerName && currentRole === 'partner' && (
              <span className="hidden md:inline text-[10px] bg-cyan-900/40 text-cyan-200 px-1.5 py-0.5 rounded">
                {activePartnerName.split(' ')[0]}
              </span>
            )}
          </button>

          <button
            onClick={() => onRoleChange('system_admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              currentRole === 'system_admin'
                ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. System Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
