'use client';
// v3 — variables CSS thème

import { useState, useEffect } from 'react';
import {
  X, User, Mail, Shield, Calendar, Lock,
  Pencil, Check, Eye, EyeOff, LogOut, ClipboardList, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile, updateUserProfile, changePassword, type UserProfile } from '@/lib/profileApi';
import OrdersDrawer from '@/components/OrdersDrawer';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'info' | 'password';

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { logout } = useAuthStore();

  const [profile, setProfile]       = useState<UserProfile | null>(null);
  const [loading, setLoading]       = useState(false);
  const [tab, setTab]               = useState<Tab>('info');
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [mounted, setMounted]       = useState(false);

  const [editing, setEditing] = useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [saving,  setSaving]  = useState(false);

  const [oldPwd,      setOldPwd]      = useState('');
  const [newPwd,      setNewPwd]      = useState('');
  const [confirmPwd,  setConfirmPwd]  = useState('');
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setTab('info'); setEditing(false);
    setOldPwd(''); setNewPwd(''); setConfirmPwd('');
    setLoading(true);
    getUserProfile()
      .then((p) => { setProfile(p); setName(p.name); setEmail(p.email); })
      .catch(() => { toast.error('Impossible de charger le profil'); onClose(); })
      .finally(() => setLoading(false));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) { toast.error('Le nom doit comporter au moins 2 caractères'); return; }
    setSaving(true);
    try {
      const updated = await updateUserProfile({ name: name.trim(), email: email.trim() });
      setProfile(updated); setEditing(false);
      toast.success('Profil mis à jour !');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur lors de la mise à jour');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (newPwd.length < 8) { toast.error('Minimum 8 caractères'); return; }
    setChangingPwd(true);
    try {
      await changePassword(oldPwd, newPwd);
      setOldPwd(''); setNewPwd(''); setConfirmPwd('');
      toast.success('Mot de passe changé !');
      setTab('info');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur');
    } finally { setChangingPwd(false); }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const pwdStrength = newPwd.length === 0 ? 0 : newPwd.length < 8 ? 1 : newPwd.length < 12 ? 2 : newPwd.length < 16 ? 3 : 4;
  const pwdColor   = ['', '#EF4444', '#F59E0B', '#F59E0B', '#10B981'][pwdStrength];
  const pwdLabel   = ['', 'Trop court', 'Correct', 'Bon', 'Fort'][pwdStrength];

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] transition-all duration-300"
        style={{
          backgroundColor: open ? 'rgba(0,0,0,0.6)' : 'transparent',
          backdropFilter:   open ? 'blur(3px)' : 'none',
          pointerEvents:    open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-[101] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out bg-[var(--bg-card)] border-l border-[var(--border)]"
        style={{
          width: 'min(400px, 88vw)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* En-tête gradient */}
        <div
          className="shrink-0 px-5 pt-5 pb-6 border-b border-[var(--border)]"
          style={{ background: 'linear-gradient(135deg, #0F1A2E 0%, #1a1f3a 50%, #2d1a0a 100%)' }}
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0 select-none"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-black text-lg leading-tight truncate text-white">
                {profile?.name ?? '—'}
              </p>
              <p className="text-xs truncate mt-0.5 text-white/60">
                {profile?.email ?? '—'}
              </p>
              <span
                className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                style={profile?.role === 'admin'
                  ? { backgroundColor: 'rgba(168,85,247,0.25)', color: '#D8B4FE', border: '1px solid rgba(168,85,247,0.3)' }
                  : { backgroundColor: 'rgba(245,158,11,0.2)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)' }
                }
              >
                <Shield className="w-3 h-3" />
                {profile?.role === 'admin' ? 'Administrateur' : 'Client'}
              </span>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex shrink-0 mx-4 mt-4 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg-page)]">
          {(['info', 'password'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setEditing(false); }}
              className="flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1.5"
              style={{
                backgroundColor: tab === t ? 'var(--bg-card)' : 'transparent',
                color: tab === t ? '#F59E0B' : 'var(--text-body)',
                borderBottom: tab === t ? '2px solid #F59E0B' : '2px solid transparent',
              }}
            >
              {t === 'info'
                ? <><User className="w-3.5 h-3.5" />Mes infos</>
                : <><Lock className="w-3.5 h-3.5" />Mot de passe</>}
            </button>
          ))}
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>

          ) : tab === 'info' ? (
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div>
                <label className="text-xs font-bold mb-1.5 flex items-center gap-1.5 text-[var(--text-body)]">
                  <User className="w-3.5 h-3.5" /> Nom complet
                </label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={!editing}
                  minLength={2} required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-amber-500/40 bg-[var(--bg-page)] text-[var(--text-dark)] placeholder-[var(--text-muted)]"
                  style={{
                    border: editing ? '1px solid #F59E0B' : '1px solid var(--border)',
                    opacity: editing ? 1 : 0.7,
                    cursor: editing ? 'text' : 'default',
                    fontSize: '16px',
                  }}
                />
              </div>

              <div>
                <label className="text-xs font-bold mb-1.5 flex items-center gap-1.5 text-[var(--text-body)]">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={!editing} required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-amber-500/40 bg-[var(--bg-page)] text-[var(--text-dark)] placeholder-[var(--text-muted)]"
                  style={{
                    border: editing ? '1px solid #F59E0B' : '1px solid var(--border)',
                    opacity: editing ? 1 : 0.7,
                    cursor: editing ? 'text' : 'default',
                    fontSize: '16px',
                  }}
                />
              </div>

              {!editing && profile?.created_at && (
                <div>
                  <label className="text-xs font-bold mb-1.5 flex items-center gap-1.5 text-[var(--text-body)]">
                    <Calendar className="w-3.5 h-3.5" /> Membre depuis
                  </label>
                  <input
                    readOnly
                    value={new Date(profile.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-[var(--bg-page)] text-[var(--text-dark)] border border-[var(--border)] opacity-60 cursor-default"
                    style={{ fontSize: '16px' }}
                  />
                </div>
              )}

              {!editing && (
                <button
                  type="button"
                  onClick={() => setOrdersOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-semibold text-sm"
                  style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}
                >
                  <span className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Mes commandes
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <div className="pt-1">
                {editing ? (
                  <div className="flex gap-2">
                    <button
                      type="submit" disabled={saving}
                      className="flex-1 py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
                      style={{ backgroundColor: '#F59E0B', color: '#0A1128' }}
                    >
                      {saving
                        ? <span className="w-4 h-4 border-2 border-[#0A1128]/30 border-t-[#0A1128] rounded-full animate-spin" />
                        : <Check className="w-4 h-4" />}
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditing(false); setName(profile?.name ?? ''); setEmail(profile?.email ?? ''); }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-sm transition bg-[var(--bg-page)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text-dark)]"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    type="button" onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition bg-[var(--bg-page)] text-[var(--text-dark)] border border-[var(--border)] hover:border-amber-500"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Modifier mes informations
                  </button>
                )}
              </div>
            </form>

          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { id: 'old-pwd', label: 'Mot de passe actuel', val: oldPwd, set: setOldPwd, show: showOld, toggle: () => setShowOld(v => !v) },
                { id: 'new-pwd', label: 'Nouveau mot de passe', val: newPwd, set: setNewPwd, show: showNew, toggle: () => setShowNew(v => !v), minLength: 8, placeholder: 'Minimum 8 caractères' },
              ].map(({ id, label, val, set, show, toggle, minLength, placeholder }) => (
                <div key={id}>
                  <label className="text-xs font-bold mb-1.5 block text-[var(--text-body)]">{label}</label>
                  <div className="relative">
                    <input
                      id={id} type={show ? 'text' : 'password'} value={val}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder ?? '••••••••'}
                      minLength={minLength} required
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl outline-none transition focus:ring-2 focus:ring-amber-500/40 bg-[var(--bg-page)] border border-[var(--border)] text-[var(--text-dark)] placeholder-[var(--text-muted)]"
                      style={{ fontSize: '16px' }}
                    />
                    <button type="button" onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition text-[var(--text-muted)] hover:text-[var(--text-dark)]">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {id === 'new-pwd' && newPwd.length > 0 && (
                    <div className="mt-1.5">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all"
                            style={{ backgroundColor: i <= pwdStrength ? pwdColor : 'var(--border)' }} />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold" style={{ color: pwdColor }}>{pwdLabel}</span>
                    </div>
                  )}
                </div>
              ))}

              <div>
                <label className="text-xs font-bold mb-1.5 block text-[var(--text-body)]">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password" value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full px-3.5 py-2.5 rounded-xl outline-none transition focus:ring-2 focus:ring-amber-500/40 bg-[var(--bg-page)] text-[var(--text-dark)] placeholder-[var(--text-muted)]"
                  style={{
                    border: confirmPwd && confirmPwd !== newPwd ? '1px solid #EF4444' : '1px solid var(--border)',
                    fontSize: '16px',
                  }}
                />
                {confirmPwd && confirmPwd !== newPwd && (
                  <p className="text-xs mt-1 text-red-500">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <button
                type="submit"
                disabled={changingPwd || newPwd !== confirmPwd || newPwd.length < 8}
                className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0A1128', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}
              >
                {changingPwd
                  ? <span className="w-4 h-4 border-2 border-[#0A1128]/30 border-t-[#0A1128] rounded-full animate-spin" />
                  : <Lock className="w-4 h-4" />}
                Changer le mot de passe
              </button>
            </form>
          )}
        </div>

        {/* Pied — déconnexion */}
        <div className="px-4 pb-5 pt-3 shrink-0 border-t border-[var(--border)]">
          <button
            onClick={() => { onClose(); logout(); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/25"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>

      <OrdersDrawer open={ordersOpen} onClose={() => setOrdersOpen(false)} />
    </>
  );
}
