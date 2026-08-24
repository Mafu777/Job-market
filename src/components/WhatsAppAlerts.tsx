"use client";

import { useState } from "react";

export default function WhatsAppAlerts() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: { preventDefault: () => void }, optedIn: boolean) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/whatsapp/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, optedIn }),
      });
      const data = await response.json();
      setMessage(data.message ?? data.error ?? "Something went wrong.");
      if (response.ok && optedIn) setPhone("");
    } catch {
      setMessage("Could not update your alert subscription.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="border-y border-gray-200 bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl sm:flex sm:items-end sm:justify-between sm:gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">WhatsApp job alerts</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Get new opportunities sent to your phone</h2>
          <p className="mt-2 max-w-xl text-sm text-gray-600">Use your international WhatsApp number. You can unsubscribe at any time.</p>
        </div>
        <form onSubmit={(event) => submit(event, true)} className="mt-6 flex w-full flex-col gap-3 sm:mt-0 sm:max-w-md sm:flex-row">
          <label htmlFor="whatsapp-phone" className="sr-only">WhatsApp number</label>
          <input id="whatsapp-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+27 82 123 4567" required className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none" />
          <button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{submitting ? "Saving..." : "Subscribe"}</button>
        </form>
      </div>
      <div className="mx-auto mt-3 max-w-5xl sm:flex sm:justify-end">
        <button type="button" onClick={(event) => submit(event, false)} disabled={submitting || !phone} className="text-sm text-gray-500 underline hover:text-gray-800 disabled:opacity-50">Unsubscribe this number</button>
      </div>
      {message && <p className="mx-auto mt-3 max-w-5xl text-sm text-gray-700" aria-live="polite">{message}</p>}
    </section>
  );
}