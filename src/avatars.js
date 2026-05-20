export const AVATARS = {
  female: [
    { id: 'f1', emoji: '🌸', label: 'Blossom',  bg: 'linear-gradient(135deg,#3d1a2e,#5c2040)' },
    { id: 'f2', emoji: '🌺', label: 'Ruby',      bg: 'linear-gradient(135deg,#2e1a1a,#4a1a28)' },
    { id: 'f3', emoji: '💫', label: 'Starlight', bg: 'linear-gradient(135deg,#1e1a3d,#2e2060)' },
    { id: 'f4', emoji: '🌼', label: 'Sunny',     bg: 'linear-gradient(135deg,#3a300a,#5a4810)' },
    { id: 'f5', emoji: '🦋', label: 'Fly Free',  bg: 'linear-gradient(135deg,#1a2e3d,#1a3a55)' },
    { id: 'f6', emoji: '👑', label: 'Crown',     bg: 'linear-gradient(135deg,#2e2a0a,#4a4010)' },
  ],
  male: [
    { id: 'm1', emoji: '🌊', label: 'Ocean',   bg: 'linear-gradient(135deg,#0a1a3d,#102050)' },
    { id: 'm2', emoji: '⚡', label: 'Thunder', bg: 'linear-gradient(135deg,#3d2e0a,#503810)' },
    { id: 'm3', emoji: '🌿', label: 'Forest',  bg: 'linear-gradient(135deg,#0a2e1a,#103a22)' },
    { id: 'm4', emoji: '🌙', label: 'Night',   bg: 'linear-gradient(135deg,#1a0a3d,#220a55)' },
    { id: 'm5', emoji: '🔥', label: 'Ember',   bg: 'linear-gradient(135deg,#3d0a0a,#550a10)' },
    { id: 'm6', emoji: '⭐', label: 'Nova',    bg: 'linear-gradient(135deg,#2e2e0a,#3a3a10)' },
  ],
};

export function getAvatarByProfile(profile) {
  if (!profile?.avatarId) return null;
  const all = [...AVATARS.female, ...AVATARS.male];
  return all.find(a => a.id === profile.avatarId) ?? null;
}
