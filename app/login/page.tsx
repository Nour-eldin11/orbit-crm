'use client';

import {useState, FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {Eye, EyeOff, Orbit, ArrowRight} from 'lucide-react';
import {Button, Input} from '@/components/ui';
import AmbientMotion from '@/components/ambient-motion';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; form?: string}>({});
  const [submitting, setSubmitting] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < 8) {
      nextErrors.password = 'Your password must contain at least 8 characters.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      const response=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password})});
      if(!response.ok){setErrors({form:response.status===503?'Admin sign-in is being configured. Please try again later.':'Email or password is incorrect.'});return}
      router.replace('/dashboard/');router.refresh();
    } catch {setErrors({form:'Could not sign in. Check your connection and try again.'})}
    finally{setSubmitting(false)}
  }

  return <main className="login-page">
    <section className="login-story"><AmbientMotion variant="login"/>
      <a href="/" className="brand"><Orbit size={33}/> orbit<span>CRM</span></a>
      <div>
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>Great relationships.<br/>Extraordinary growth.</h1>
        <p>A little more clarity. A lot more possibility.<br/>Bring your customers, conversations, and next big wins into orbit.</p>
        <div className="login-art" aria-hidden="true">
          <div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/>
          <div className="art-core"><Orbit size={74}/></div>
          <div className="art-stat">↗ &nbsp; Relationships that grow<strong>Better together.</strong></div>
        </div>
      </div>
      <small>© 2026 Orbit CRM &nbsp; · &nbsp; Built for your next big thing.</small>
    </section>
    <section className="login-form-area">
      <AmbientMotion variant="form"/>
      <span className="back-link">Your relationships. One workspace.</span>
      <form noValidate onSubmit={signIn}>
        <span className="eyebrow">WELCOME TO YOUR WORKSPACE</span>
        <h2>Good to see you again.</h2>
        <p>Sign in and pick up where you left off.</p>
        <label htmlFor="email">Email address</label>
        <Input
          id="email" name="email" autoComplete="email" type="email" required
          placeholder="you@company.com" value={email}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
          onChange={event => {setEmail(event.target.value); setErrors(previous => ({...previous, email: undefined}))}}
        />
        {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}
        <label htmlFor="password">Password</label>
        <div className="password-field">
          <Input
            id="password" name="password" autoComplete="current-password"
            type={showPassword ? 'text' : 'password'} minLength={8} required
            placeholder="Enter your password" value={password}
            aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}
            onChange={event => {setPassword(event.target.value); setErrors(previous => ({...previous, password: undefined}))}}
          />
          <Button type="button" variant="text" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </Button>
        </div>
        {errors.password && <p id="password-error" className="form-error" role="alert">{errors.password}</p>}
        {errors.form&&<p className="form-error" role="alert">{errors.form}</p>}
        <Button type="submit" variant="primary" className="login-submit" disabled={submitting}>{submitting?'Signing in…':'Sign in to Orbit'} <ArrowRight size={17}/></Button>
        <div className="demo-note"><strong>Admin access</strong><br/>Sign in with your dedicated Orbit admin email and password.</div>
      </form>
      <small className="login-footer">One workspace. Every relationship.</small>
    </section>
  </main>;
}
