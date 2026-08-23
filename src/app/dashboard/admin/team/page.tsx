"use client";

import { FormEvent, useEffect, useState } from "react";

type Admin = { id: string; email: string; createdAt: string };

export default function AdminTeamPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAdmins() {
    const response = await fetch("/api/admin/users");
    if (response.ok) setAdmins((await response.json()).admins);
  }

  useEffect(() => {
    void Promise.resolve().then(loadAdmins);
  }, []);

  async function addAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not add administrator.");
      return;
    }
    setMessage(`${email} can now sign in as an administrator.`);
    setEmail("");
    setPassword("");
    await loadAdmins();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Team access</h1>
      <p className="mt-2 text-gray-600">Add trusted administrators who can publish jobs and review safety reports.</p>
      <form onSubmit={addAdmin} className="mt-8 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">New admin email</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Temporary password</label>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm" required />
          <p className="mt-1 text-xs text-gray-500">Use at least 8 characters and share it securely with the new administrator.</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <button type="submit" className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Add administrator</button>
      </form>
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">Current administrators</h2>
        <ul className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
          {admins.map((admin) => <li key={admin.id} className="flex justify-between px-5 py-4 text-sm"><span className="font-medium text-gray-900">{admin.email}</span><span className="text-gray-500">Added {new Date(admin.createdAt).toLocaleDateString()}</span></li>)}
        </ul>
      </section>
    </main>
  );
}
