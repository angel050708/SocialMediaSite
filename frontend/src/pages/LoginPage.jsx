import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Sprout } from "lucide-react";
import { FormField } from "../components/ui/FormField.jsx";
import { Input } from "../components/ui/Input.jsx";
import { PasswordInput } from "../components/ui/PasswordInput.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ApiError } from "../lib/api.js";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1600&q=80&auto=format&fit=crop";

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
    <div className="flex min-h-[100dvh] w-full flex-col md:h-[100dvh] md:flex-row">
      <section className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft">
            <Leaf size={26} />
          </span>
          <h1 className="font-heading text-4xl font-semibold leading-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-muted-foreground">A calmer corner of the internet.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
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
              <PasswordInput
                id="password"
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

          <Button type="button" variant="outline" className="w-full" loading={guestLoading} onClick={handleGuest}>
            <Sprout size={18} />
            Continue as guest
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden flex-1 p-4 md:block">
        <div
          className="absolute inset-4 rounded-[2rem_5rem_2rem_2rem] bg-cover bg-center shadow-soft-lg"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 rounded-[2rem_5rem_2rem_2rem] bg-gradient-to-t from-foreground/60 via-foreground/0 to-foreground/0" />
          <div className="absolute bottom-10 left-10 right-10">
            <p className="font-heading text-3xl font-medium leading-snug text-white">
              Plant a thought.
              <br />
              Watch a community grow.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
