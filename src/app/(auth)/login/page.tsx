"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setLoading(true);

		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			setError("Invalid email or password.");
			setLoading(false);
			return;
		}

		router.push("/dashboard/admin");
	}

	return (
		<main className="mx-auto max-w-md px-6 py-16">
			<h1 className="text-2xl font-bold text-gray-900">Admin login</h1>
			<p className="mt-1 text-sm text-gray-600">Sign in to manage job listings.</p>

			<form onSubmit={handleSubmit} className="mt-8 space-y-5">
				<div>
					<label className="block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Password</label>
					<input
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
						required
					/>
				</div>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<button
					type="submit"
					disabled={loading}
					className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
				>
					{loading ? "Signing in..." : "Sign in"}
				</button>
			</form>
		</main>
	);
}
