'use client';

import { useState, useEffect } from 'react';
import {
  X, User, Mail, Shield, Calendar, Lock,
  Pencil, Check, Eye, EyeOff, LogOut,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/authStore';
import { getUserProfile, updateUserProfile, changePassword, type UserProfile } from '@/lib/profileApi';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge }  from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { logout } = useAuthStore();

  const [profile, setProfile]     = useState<UserProfile | null>(null);
  const [loading, setLoading]     = useState(false);

  /* ── Infos ── */
  const [editing, setEditing]     = useState(false);
  const [name,    setName]        = useState('');
  const [email,   setEmail]       = useState('');
  const [saving,  setSaving]      = useState(false);

  /* ── Mot de passe ── */
  const [oldPwd,      setOldPwd]      = useState('');
  const [newPwd,      setNewPwd]      = useState('');
  const [confirmPwd,  setConfirmPwd]  = useState('');
  const [showOld,     setShowOld]     = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  /* ── Charger le profil à l'ouverture ── */
  useEffect(() => {
    if (!open) return;
    setEditing(false);
    setOldPwd(''); setNewPwd(''); setConfirmPwd('');

    const load = async () => {
      setLoading(true);
      try {
        const p = await getUserProfile();
        setProfile(p);
        setName(p.name);
        setEmail(p.email);
      } catch {
        toast.error('Impossible de charger le profil');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Enregistrer les infos ── */
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error('Le nom doit comporter au moins 2 caractères');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateUserProfile({ name: name.trim(), email: email.trim() });
      setProfile(updated);
      setEditing(false);
      toast.success('Profil mis à jour !');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  /* ── Changer le mot de passe ── */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (newPwd.length < 8)    { toast.error('Minimum 8 caractères requis'); return; }
    setChangingPwd(true);
    try {
      await changePassword(oldPwd, newPwd);
      setOldPwd(''); setNewPwd(''); setConfirmPwd('');
      toast.success('Mot de passe changé avec succès !');
    } catch (err: any) {
      toast.error(err?.message ?? 'Erreur lors du changement de mot de passe');
    } finally {
      setChangingPwd(false);
    }
  };

  /* ── Initiales avatar ── */
  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  /* ── Force du mot de passe ── */
  const pwdStrength = newPwd.length === 0 ? 0
    : newPwd.length < 8  ? 1
    : newPwd.length < 12 ? 2
    : newPwd.length < 16 ? 3 : 4;
  const pwdColors = ['bg-border', 'bg-red-500', 'bg-amber-500', 'bg-amber-400', 'bg-green-500'];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 max-w-md overflow-hidden border-border"
      >
        {/* ── En-tête gradient ── */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 px-6 pt-6 pb-10">
          {/* Bouton fermer */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="absolute top-3 right-3 text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="size-4" />
            <span className="sr-only">Fermer</span>
          </Button>

          <div className="flex items-center gap-4">
            {/* Avatar initiales */}
            <div className="size-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0 select-none">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="text-white font-black text-lg leading-tight truncate">
                {profile?.name ?? '—'}
              </p>
              <p className="text-amber-300/80 text-xs font-medium truncate mt-0.5">
                {profile?.email ?? '—'}
              </p>
              <div className="mt-2">
                <Badge
                  variant={profile?.role === 'admin' ? 'secondary' : 'default'}
                  className={
                    profile?.role === 'admin'
                      ? 'bg-purple-500/30 text-purple-200 border-purple-500/20'
                      : 'bg-amber-500/25 text-amber-200 border-amber-500/20'
                  }
                >
                  <Shield className="size-3" />
                  {profile?.role === 'admin' ? 'Administrateur' : 'Client'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* ── Onglets ── */}
        <Tabs defaultValue="info" className="px-6 -mt-4 relative z-10">
          <TabsList
            variant="default"
            className="w-full h-auto rounded-xl bg-background border border-border p-1"
          >
            <TabsTrigger value="info" className="flex-1 gap-1.5 py-2 text-xs font-bold">
              <User className="size-3.5" />
              Mes informations
            </TabsTrigger>
            <TabsTrigger value="password" className="flex-1 gap-1.5 py-2 text-xs font-bold">
              <Lock className="size-3.5" />
              Mot de passe
            </TabsTrigger>
          </TabsList>

          {/* ── Chargement ── */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="size-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              {/* ───────────── ONGLET INFOS ───────────── */}
              <TabsContent value="info" className="mt-5 pb-2 space-y-4">
                <form onSubmit={handleSaveInfo} className="space-y-4">

                  {/* Nom */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name" className="text-xs text-muted-foreground">
                      <User className="size-3.5" />
                      Nom complet
                    </Label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={!editing}
                      className={!editing ? 'bg-muted/50 cursor-default' : ''}
                      minLength={2}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-email" className="text-xs text-muted-foreground">
                      <Mail className="size-3.5" />
                      Email
                    </Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={!editing}
                      className={!editing ? 'bg-muted/50 cursor-default' : ''}
                      required
                    />
                  </div>

                  {/* Membre depuis */}
                  {!editing && profile?.created_at && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">
                        <Calendar className="size-3.5" />
                        Membre depuis
                      </Label>
                      <Input
                        value={new Date(profile.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                        disabled
                        className="bg-muted/50 cursor-default"
                        readOnly
                      />
                    </div>
                  )}

                  {/* Boutons */}
                  {editing ? (
                    <div className="flex gap-2 pt-1">
                      <Button type="submit" disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black">
                        {saving
                          ? <span className="size-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          : <Check className="size-4" />
                        }
                        Enregistrer
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEditing(false);
                          setName(profile?.name ?? '');
                          setEmail(profile?.email ?? '');
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={() => setEditing(true)}
                    >
                      <Pencil className="size-3.5" />
                      Modifier mes informations
                    </Button>
                  )}
                </form>
              </TabsContent>

              {/* ───────────── ONGLET MOT DE PASSE ───────────── */}
              <TabsContent value="password" className="mt-5 pb-2 space-y-4">
                <form onSubmit={handleChangePassword} className="space-y-4">

                  {/* Ancien mot de passe */}
                  <div className="space-y-1.5">
                    <Label htmlFor="old-pwd" className="text-xs text-muted-foreground">
                      Mot de passe actuel
                    </Label>
                    <div className="relative">
                      <Input
                        id="old-pwd"
                        type={showOld ? 'text' : 'password'}
                        value={oldPwd}
                        onChange={e => setOldPwd(e.target.value)}
                        placeholder="••••••••"
                        className="pr-9"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOld(v => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showOld ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div className="space-y-1.5">
                    <Label htmlFor="new-pwd" className="text-xs text-muted-foreground">
                      Nouveau mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="new-pwd"
                        type={showNew ? 'text' : 'password'}
                        value={newPwd}
                        onChange={e => setNewPwd(e.target.value)}
                        placeholder="Minimum 8 caractères"
                        className="pr-9"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(v => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {/* Barre de force */}
                    {newPwd.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${i <= pwdStrength ? pwdColors[pwdStrength] : 'bg-border'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirmation */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-pwd" className="text-xs text-muted-foreground">
                      Confirmer le mot de passe
                    </Label>
                    <Input
                      id="confirm-pwd"
                      type="password"
                      value={confirmPwd}
                      onChange={e => setConfirmPwd(e.target.value)}
                      placeholder="••••••••"
                      aria-invalid={confirmPwd.length > 0 && confirmPwd !== newPwd}
                      required
                    />
                    {confirmPwd.length > 0 && confirmPwd !== newPwd && (
                      <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={changingPwd || newPwd !== confirmPwd || newPwd.length < 8}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                  >
                    {changingPwd
                      ? <span className="size-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      : <Lock className="size-4" />
                    }
                    Changer le mot de passe
                  </Button>
                </form>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* ── Pied — déconnexion ── */}
        <div className="px-6 pb-5 pt-3">
          <Separator className="mb-4" />
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={() => { onClose(); logout(); }}
          >
            <LogOut className="size-4" />
            Se déconnecter
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
