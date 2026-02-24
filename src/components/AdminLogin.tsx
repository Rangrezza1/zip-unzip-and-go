import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => Promise<{ error: any }>;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await onLogin(email, password);
    if (error) setError(error.message || 'Invalid credentials');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-card border rounded-lg p-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Admin Login</h1>
          <p className="text-xs text-muted-foreground text-center">Sign in with your admin credentials to access the dashboard.</p>
        </div>

        {error && (
          <div className="text-xs text-destructive bg-destructive/10 rounded px-3 py-2 text-center">{error}</div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 bg-primary text-primary-foreground font-semibold text-sm rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
