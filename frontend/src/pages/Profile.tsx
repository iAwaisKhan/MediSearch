import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { useLang } from "../context/LangContext";
import PageHeader from "../components/ui/PageHeader";
import toast from "react-hot-toast";

function Section({ title, children }) {
  return (
    <div className="card p-6 mb-5">
      <h2 className="font-semibold text-slate-700 text-base mb-5 pb-3 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  );
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { t, switchLang } = useLang();

  const [profile, setProfile] = useState({ name: user?.name || "", preferredLang: user?.preferredLang || "en" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmNew: "" });
  const [savingPwd,  setSavingPwd]  = useState(false);
  const [showPwd,    setShowPwd]    = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authAPI.updateProfile(profile);
      updateUser(res.data.data.user);
      switchLang(profile.preferredLang);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNew) {
      toast.error("New passwords do not match."); return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters."); return;
    }
    setSavingPwd(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: "", newPassword: "", confirmNew: "" });
      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error(err.message || "Could not change password.");
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <PageHeader eyebrow="Account" title={t("profile")} />

      {/* Account info card */}
      <div className="card p-5 mb-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center text-brand-500 text-2xl font-bold font-display shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="text-sm text-slate-400">{user?.email}</p>
          <span className="badge-slate mt-1">{user?.role}</span>
        </div>
      </div>

      {/* Edit profile */}
      <Section title="Edit Profile">
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="label">{t("name")}</label>
            <input
              type="text" required value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="label">{t("email")}</label>
            <input type="email" value={user?.email} disabled className="input opacity-60 cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="label">Preferred Language</label>
            <select
              value={profile.preferredLang}
              onChange={(e) => setProfile((p) => ({ ...p, preferredLang: e.target.value }))}
              className="input"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile ? "Saving…" : t("save")}
          </button>
        </form>
      </Section>

      {/* Change password */}
      <Section title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {["currentPassword", "newPassword", "confirmNew"].map((field) => (
            <div key={field}>
              <label className="label">
                {field === "currentPassword" ? t("currentPass") : field === "newPassword" ? t("newPass") : t("confirmPass")}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} required
                  value={passwords[field]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [field]: e.target.value }))}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                {field === "currentPassword" && (
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPwd ? "🙈" : "👁"}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" disabled={savingPwd} className="btn-primary">
            {savingPwd ? "Changing…" : "Change Password"}
          </button>
        </form>
      </Section>

      {/* Danger zone */}
      <Section title="Account">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-700">Member since</p>
              <p className="text-xs text-slate-400">{new Date(user?.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <button onClick={logout} className="btn-danger self-start">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1" />
            </svg>
            {t("logout")}
          </button>
        </div>
      </Section>
    </div>
  );
}
