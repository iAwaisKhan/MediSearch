import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", preferredLang: "en" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => { setForm((p) => ({ ...p, [e.target.name]: e.target.value })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); return;
    }
    if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      setError("Password must contain an uppercase letter and a number."); return;
    }
    setLoading(true);
    setError("");
    try {
      await register({ name: form.name, email: form.email, password: form.password, preferredLang: form.preferredLang });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-brand-300", "bg-brand-400"][strength];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-2xl mb-4 text-4xl">
            💊
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-800">Create account</h1>
          <p className="text-slate-400 text-sm mt-1">Free forever. No credit card needed.</p>
        </div>

        <div className="card p-7 shadow-lg">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="label">Full Name</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange}
                className="input" placeholder="Rahul Sharma" autoFocus />
            </div>

            <div>
              <label className="label">Email</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange}
                className="input" placeholder="you@example.com" />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} name="password" required
                  value={form.password} onChange={handleChange}
                  className="input pr-10" placeholder="Min 8 chars, 1 uppercase, 1 number" />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">{strengthLabel}</p>
                </div>
              )}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input type={showPwd ? "text" : "password"} name="confirmPassword" required
                value={form.confirmPassword} onChange={handleChange}
                className="input" placeholder="Re-enter your password" />
            </div>

            <div>
              <label className="label">Preferred Language</label>
              <select name="preferredLang" value={form.preferredLang} onChange={handleChange} className="input">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
                : "Create Account"}
            </button>
          </form>

          <div className="divider my-5" />

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
