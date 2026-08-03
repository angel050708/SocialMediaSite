import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { FormField } from "../components/ui/FormField.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ApiError } from "../lib/api.js";

export function LoginPage() {
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't sign you in");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGuest() {
    setGuestLoading(true);
    setError("");
    try {
      await guestLogin();
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't start a guest session");
      setGuestLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="A calmer corner of the internet."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField label="Username" htmlFor="username">
          <Input
            id="username"
            autoComplete="username"
            required
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
          />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </FormField>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        loading={guestLoading}
        onClick={handleGuest}
      >
        <Sprout size={18} />
        Continue as guest
      </Button>
    </AuthLayout>
  );
}
