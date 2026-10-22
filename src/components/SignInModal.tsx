import React, { useState } from 'react';
import {
  X,
  Lock,
  User as UserIcon,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { AppUserSession } from '../types';
import { STUDIO_OWNER_EMAIL } from '../firebase';
import { PrimeNestLogoMark } from './Navbar';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: (session: AppUserSession) => void;
  onGoogleAdminLogin?: () => Promise<void>;
  configuredAdminPassword?: string;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
  onGoogleAdminLogin,
  configuredAdminPassword,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const isAdminEmailTyped =
    normalizedEmail === STUDIO_OWNER_EMAIL.toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isAdminEmailTyped) {
      // Admin login requires password
      if (!password.trim()) {
        setError('Please enter the admin password to log in as Admin.');
        return;
      }

      const validPasswords = [
        'aarifkhaleel786',
        ...(configuredAdminPassword && configuredAdminPassword !== 'primenest123'
          ? [configuredAdminPassword]
          : []),
      ];

      if (!validPasswords.includes(password.trim())) {
        setError('Incorrect admin password. Please try again.');
        return;
      }

      onSignInSuccess({
        name: 'PrimeNEST Admin',
        email: STUDIO_OWNER_EMAIL,
        role: 'admin',
      });
      setPassword('');
      onClose();
      return;
    }

    // Customer Sign-In: No email password needed!
    const customerDisplayName =
      name.trim() ||
      (normalizedEmail ? normalizedEmail.split('@')[0] : 'Valued Customer');

    onSignInSuccess({
      name: customerDisplayName,
      email: normalizedEmail || 'customer@primenest.guest',
      role: 'customer',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0B14]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#0B0B14] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PrimeNestLogoMark className="w-7 h-7" />
            <div>
              <h2 className="font-display text-lg font-extrabold leading-none">
                Sign In to PrimeNEST
              </h2>
              <p className="text-[11px] text-white/60 mt-1">
                {isAdminEmailTyped
                  ? 'Studio Administrator Authentication'
                  : 'Instant Customer Access — No Password Required'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Sign In Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          {/* Mode Indicator Banner */}
          {isAdminEmailTyped ? (
            <div className="p-3.5 bg-[#6C4EFF]/10 border border-[#6C4EFF]/30 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#6C4EFF] shrink-0 mt-0.5" />
              <div className="text-xs text-[#0B0B14]">
                <strong className="font-bold block">Admin Email Detected</strong>
                <span className="text-slate-600">
                  Please enter your admin password below to log in to the PrimeNEST Admin Dashboard.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950">
                <strong className="font-bold block">
                  Customer Quick Sign-In
                </strong>
                <span className="text-emerald-800">
                  Customers do not need an email or password to sign in. Enter your name (or email) to continue!
                </span>
              </div>
            </div>
          )}

          {/* Customer Name Field (Hidden when logging in as Admin) */}
          {!isAdminEmailTyped && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm text-[#0B0B14] outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {isAdminEmailTyped ? 'Admin Email ID' : 'Email ID'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#6C4EFF] focus:bg-white rounded-xl text-sm text-[#0B0B14] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password Field — ONLY shown when primenestonlinemart@gmail.com is typed */}
          {isAdminEmailTyped && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-semibold text-[#0B0B14] mb-1.5">
                Admin Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6C4EFF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-[#6C4EFF] rounded-xl text-sm text-[#0B0B14] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-5 bg-[#6C4EFF] hover:bg-[#5B3DF5] text-white text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-[#6C4EFF]/25 cursor-pointer"
          >
            <span>
              {isAdminEmailTyped ? 'Login as Admin' : 'Continue as Customer'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {isAdminEmailTyped && onGoogleAdminLogin && (
            <button
              type="button"
              onClick={async () => {
                try {
                  await onGoogleAdminLogin();
                  onClose();
                } catch {
                  // Ignore popup cancellation
                }
              }}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#0B0B14] text-xs font-semibold rounded-full transition-colors cursor-pointer"
            >
              Or Sign In with Google ({STUDIO_OWNER_EMAIL})
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
