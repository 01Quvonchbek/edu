
import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (status: boolean) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin(true);
      } else {
        setError('Login yoki parol noto\'g\'ri!');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] w-full max-w-md shadow-2xl animate-fadeIn">
        <button 
          onClick={onCancel}
          className="text-white/60 hover:text-white flex items-center space-x-2 mb-8 transition"
        >
          <ArrowLeft size={18} />
          <span>Orqaga</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white">Xush kelibsiz</h2>
          <p className="text-white/60 mt-2">Boshqaruv paneliga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Login</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Parol</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <span>Kirish</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
