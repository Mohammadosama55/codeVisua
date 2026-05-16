import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function Field({ label, icon: Icon, type, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400">{label}</label>
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-900 border transition-colors ${
        error ? 'border-red-700' : 'border-gray-700 focus-within:border-violet-600'
      }`}>
        <Icon className="w-4 h-4 text-gray-500 shrink-0" />
        <input
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-600"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)} className="text-gray-600 hover:text-gray-400">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab]           = useState('signin');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError]   = useState('');

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const reset = () => { setEmail(''); setPassword(''); setUsername(''); setDisplayName(''); setFormError(''); };

  const handleTab = (t) => { setTab(t); reset(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      if (tab === 'signin') {
        await login(email, password);
      } else {
        await register(username, email, password, displayName);
      }
      onClose();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      />
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-base">DSALearn</h2>
                <p className="text-gray-500 text-xs">Your AI learning companion</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-gray-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Tab switcher */}
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
              {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => handleTab(id)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    tab === id
                      ? 'bg-violet-600 text-white shadow'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <AnimatePresence mode="wait">
                {tab === 'signup' && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-3.5 overflow-hidden"
                  >
                    <Field label="Username" icon={User} type="text" value={username}
                      onChange={e => setUsername(e.target.value)} placeholder="coolcoder42" />
                    <Field label="Display name (optional)" icon={User} type="text" value={displayName}
                      onChange={e => setDisplayName(e.target.value)} placeholder="Alex" />
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email" icon={Mail} type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              <Field label="Password" icon={Lock} type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" />

              {formError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-xl px-3 py-2">
                  {formError}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30"
              >
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {tab === 'signin' ? 'Signing in…' : 'Creating account…'}</>
                  : tab === 'signin' ? 'Sign In' : 'Create Account'
                }
              </button>
            </form>

            <p className="text-center text-xs text-gray-600">
              {tab === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => handleTab(tab === 'signin' ? 'signup' : 'signin')}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                {tab === 'signin' ? 'Sign up free' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
