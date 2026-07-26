import { useEffect, useState, type FormEvent } from "react";
import Layout from "../../components/Layout";
import { userApi } from "../../lib/api";
import type { User } from "../../types";

export default function Setting() {
  const [profile, setProfile] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getUser()
      .then((user) => {
        setProfile(user);
        setName(user.name || "");
        setPhone(user.phone || "");
        setBio(user.bio || "");
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("bio", bio);
      if (photo) formData.append("photo", photo);

      const updated = await userApi.updateUser(formData);
      setProfile(updated.data);
      setMessage("Profile updated successfully.");
      setPhoto(null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile.";
      setError(msg);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await userApi.changePassword(oldPassword, newPassword);
      setMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to change password.";
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Layout title="Settings" subtitle="Manage your account and preferences">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="settings-grid">
        <section className="card">
          <h2>Profile</h2>
          <form onSubmit={handleProfileUpdate} className="form-stack">
            <div className="profile-photo-row">
              <img
                src={
                  photo
                    ? URL.createObjectURL(photo)
                    : profile?.photo ||
                      "https://res.cloudinary.com/dduozzr2g/image/upload/v1777920605/default-user_nscsn1.jpg"
                }
                alt="Profile"
                className="profile-avatar"
              />
              <label className="file-label">
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
              Email
              <input value={profile?.email || ""} disabled />
            </label>
            <label>
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </label>
            <label>
              Bio
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </label>
            <button type="submit" className="btn btn-primary">
              Save profile
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Change password</h2>
          <form onSubmit={handlePasswordChange} className="form-stack">
            <label>
              Current password
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
            <button type="submit" className="btn btn-secondary">
              Update password
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}
