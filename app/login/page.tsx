'use client';

import {useEffect, useState, FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {Eye, EyeOff, Orbit, ArrowRight} from 'lucide-react';
import {Button, Input} from '@/components/ui';
import AmbientMotion from '@/components/ambient-motion';

type Language = 'en' | 'ar';
const copy = {
  en: {
    chapter:'YOUR NEXT CHAPTER STARTS HERE', headlineA:'Great relationships.', headlineB:'Extraordinary growth.',
    storyA:'A little more clarity. A lot more possibility.', storyB:'Bring your customers, conversations, and next big wins into orbit.',
    growing:'Relationships that grow', together:'Better together.', built:'Built for your next big thing.',
    back:'Your relationships. One workspace.', welcome:'WELCOME TO YOUR WORKSPACE', greeting:'Good to see you again.',
    intro:'Sign in and pick up where you left off.', email:'Email address', password:'Password',
    passwordPlaceholder:'Enter your password', show:'Show password', hide:'Hide password',
    submit:'Sign in to Orbit', submitting:'Signing in…', admin:'Admin access',
    adminHelp:'Sign in with your dedicated Orbit admin email and password.', footer:'One workspace. Every relationship.',
    emailError:'Please enter a valid email address.', passwordError:'Your password must contain at least 8 characters.',
    unavailable:'Admin sign-in is being configured. Please try again later.', invalid:'Email or password is incorrect.',
    connection:'Could not sign in. Check your connection and try again.'
  },
  ar: {
    chapter:'بداية فصل جديد في عملك', headlineA:'علاقات أقوى.', headlineB:'نمو بلا حدود.',
    storyA:'وضوح أكثر، وفرص أكبر.', storyB:'اجمع عملاءك ومحادثاتك وصفقاتك القادمة في مساحة واحدة.',
    growing:'علاقات تنمو', together:'النجاح يجمعنا.', built:'صُمّم لخطوتك القادمة.',
    back:'علاقاتك كلها في مساحة واحدة.', welcome:'أهلًا بك في مساحة عملك', greeting:'سعداء بعودتك.',
    intro:'سجّل دخولك وأكمل عملك من حيث توقفت.', email:'البريد الإلكتروني', password:'كلمة المرور',
    passwordPlaceholder:'أدخل كلمة المرور', show:'إظهار كلمة المرور', hide:'إخفاء كلمة المرور',
    submit:'تسجيل الدخول إلى Orbit', submitting:'جارٍ تسجيل الدخول…', admin:'دخول المسؤول',
    adminHelp:'سجّل الدخول باستخدام بريد المسؤول وكلمة المرور المخصصين لـ Orbit.', footer:'مساحة واحدة لكل علاقاتك.',
    emailError:'أدخل بريدًا إلكترونيًا صحيحًا.', passwordError:'يجب أن تحتوي كلمة المرور على ٨ أحرف على الأقل.',
    unavailable:'يجري إعداد دخول المسؤول. حاول مرة أخرى لاحقًا.', invalid:'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    connection:'تعذّر تسجيل الدخول. تحقق من اتصالك وحاول مرة أخرى.'
  }
} as const;

export default function Login() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('en');
  const t = copy[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; form?: string}>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('orbit-preferences') || '{}');
      if (saved.language === 'ar') setLanguage('ar');
    } catch {}
  }, []);

  function switchLanguage() {
    const next:Language = language === 'en' ? 'ar' : 'en';
    setLanguage(next);
    setErrors({});
    try {
      const saved = JSON.parse(localStorage.getItem('orbit-preferences') || '{}');
      localStorage.setItem('orbit-preferences', JSON.stringify({...saved, language:next}));
    } catch {
      localStorage.setItem('orbit-preferences', JSON.stringify({language:next}));
    }
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = t.emailError;
    }
    if (password.length < 8) {
      nextErrors.password = t.passwordError;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      const response=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password})});
      if(!response.ok){setErrors({form:response.status===503?t.unavailable:t.invalid});return}
      router.replace('/dashboard/');router.refresh();
    } catch {setErrors({form:t.connection})}
    finally{setSubmitting(false)}
  }

  return <main className="login-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <section className="login-story"><AmbientMotion variant="login"/>
      <a href="/" className="brand"><Orbit size={33}/> orbit<span>CRM</span></a>
      <div>
        <span className="eyebrow">{t.chapter}</span>
        <h1>{t.headlineA}<br/>{t.headlineB}</h1>
        <p>{t.storyA}<br/>{t.storyB}</p>
        <div className="login-art" aria-hidden="true">
          <div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/>
          <div className="art-core"><Orbit size={74}/></div>
          <div className="art-stat">↗ &nbsp; {t.growing}<strong>{t.together}</strong></div>
        </div>
      </div>
      <small>© 2026 Orbit CRM &nbsp; · &nbsp; {t.built}</small>
    </section>
    <section className="login-form-area">
      <AmbientMotion variant="form"/>
      <button type="button" className="login-language" aria-label={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'} onClick={switchLanguage}>{language === 'en' ? 'العربية' : 'English'}</button>
      <span className="back-link">{t.back}</span>
      <form noValidate onSubmit={signIn}>
        <span className="eyebrow">{t.welcome}</span>
        <h2>{t.greeting}</h2>
        <p>{t.intro}</p>
        <label htmlFor="email">{t.email}</label>
        <Input
          id="email" name="email" autoComplete="email" type="email" dir="ltr" required
          placeholder="you@company.com" value={email}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
          onChange={event => {setEmail(event.target.value); setErrors(previous => ({...previous, email: undefined}))}}
        />
        {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email}</p>}
        <label htmlFor="password">{t.password}</label>
        <div className="password-field">
          <Input
            id="password" name="password" autoComplete="current-password" dir={language === 'ar' ? 'rtl' : 'ltr'}
            type={showPassword ? 'text' : 'password'} minLength={8} required
            placeholder={t.passwordPlaceholder} value={password}
            aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}
            onChange={event => {setPassword(event.target.value); setErrors(previous => ({...previous, password: undefined}))}}
          />
          <Button type="button" variant="text" aria-label={showPassword ? t.hide : t.show} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </Button>
        </div>
        {errors.password && <p id="password-error" className="form-error" role="alert">{errors.password}</p>}
        {errors.form&&<p className="form-error" role="alert">{errors.form}</p>}
        <Button type="submit" variant="primary" className="login-submit" disabled={submitting}>{submitting?t.submitting:t.submit} <ArrowRight size={17}/></Button>
        <div className="demo-note"><strong>{t.admin}</strong><br/>{t.adminHelp}</div>
      </form>
      <small className="login-footer">{t.footer}</small>
    </section>
  </main>;
}
