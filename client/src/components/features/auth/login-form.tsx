import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthFormHeader } from "@/components/features/auth/auth-form-header";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/axios";

export function LoginForm() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <AuthFormHeader title="Sign In" />
      <label>Email<Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {error && <p role="alert" className="bad">{error}</p>}
      <Button type="submit" variant="primary">Sign In</Button>
      <p className="center">
        <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Ask your administrator to reset your password."); }}>
          Forgot password?
        </a>
      </p>
    </form>
  );
}