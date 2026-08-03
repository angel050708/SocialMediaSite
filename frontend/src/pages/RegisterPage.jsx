import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout.jsx";
import { FormField } from "../components/ui/FormField.jsx";
import { Input } from "../components/ui/Input.jsx";
import { PasswordInput } from "../components/ui/PasswordInput.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ApiError } from "../lib/api.js";

const INITIAL_FORM = { username: "", email: "", displayName: "", password: "" };

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        setFieldErrors(Object.fromEntries(Object.entries(err.details).map(([key, msgs]) => [key, msgs[0]])));
      } else {
        setFormError(err instanceof ApiError ? err.message : "Couldn't create your account");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Join Grove"
      subtitle="Plant your first post today."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField label="Display name" htmlFor="displayName" error={fieldErrors.displayName}>
          <Input
            id="displayName"
            required
            value={form.displayName}
            onChange={(event) => updateField("displayName", event.target.value)}
          />
        </FormField>
        <FormField label="Username" htmlFor="username" error={fieldErrors.username}>
          <Input
            id="username"
            autoComplete="username"
            required
            value={form.username}
            onChange={(event) => updateField("username", event.target.value)}
          />
        </FormField>
        <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </FormField>
        <FormField label="Password" htmlFor="password" error={fieldErrors.password}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
          />
        </FormField>
        {formError && (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        )}
        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
