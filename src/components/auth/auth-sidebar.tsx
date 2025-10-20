'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface AuthSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthSidebar({ isOpen, onClose }: AuthSidebarProps) {
  const router = useRouter();
  const { t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: signInEmail,
        password: signInPassword,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Logged in successfully!');
        setSignInEmail('');
        setSignInPassword('');
        onClose();

        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpPassword !== signUpConfirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Account created! Logging you in...');

      await new Promise((resolve) => setTimeout(resolve, 500));

      const result = await signIn('credentials', {
        email: signUpEmail,
        password: signUpPassword,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Account created but login failed. Please try signing in.');
      } else {
        toast.success('Welcome!');
        setSignUpName('');
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpConfirmPassword('');
        onClose();

        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 transition-all duration-300',
          isOpen
            ? 'opacity-100 z-50'
            : 'opacity-0 pointer-events-none invisible -z-10'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl transition-all duration-300 ease-in-out',
          direction === 'rtl' ? 'left-0' : 'right-0',
          isOpen
            ? 'translate-x-0 z-50 visible'
            : direction === 'rtl'
              ? '-translate-x-full invisible z-50'
              : 'translate-x-full invisible z-50'
        )}
        dir={direction}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black uppercase tracking-wide">
            {t('auth.welcome')}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-black hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('signin')}
            className={cn(
              'flex-1 py-4 text-sm font-light uppercase tracking-wide transition-colors',
              activeTab === 'signin'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-gray-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
          >
            {t('auth.signin')}
          </button>

          <button
            onClick={() => setActiveTab('signup')}
            className={cn(
              'flex-1 py-4 text-sm font-light uppercase tracking-wide transition-colors',
              activeTab === 'signup'
                ? 'text-gray-800 border-b-2 border-gray-800 bg-gray-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            )}
          >
            {t('auth.signup')}
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-9rem)] p-6">
          {activeTab === 'signin' && (
            <div className="space-y-6">
              {/* Google Sign In */}
              <Button
                variant="outline"
                className="w-full border-gray-300 text-black hover:bg-gray-50 font-light"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('auth.continueWithGoogle')}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-light tracking-wide">
                    {t('auth.orContinueWithEmail')}
                  </span>
                </div>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="signin-email"
                    className="text-sm font-light uppercase tracking-wide text-gray-700"
                  >
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="example@email.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signin-password"
                    className="text-sm font-light uppercase tracking-wide text-gray-700"
                  >
                    {t('auth.password')}
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-gray-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white font-light uppercase tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.signingIn') : t('auth.signinButton')}
                </Button>
                <div className="text-center text-sm">
                  <Link
                    href="/forgot-password"
                    onClick={onClose}
                    className="text-gray-600 hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
              </form>

              {/* Switch to Sign Up */}
              <div className="text-center text-sm">
                <span className="text-gray-600">
                  {t('auth.dontHaveAccount')}{' '}
                </span>
                <button
                  onClick={() => setActiveTab('signup')}
                  className="text-black font-medium hover:underline"
                >
                  {t('auth.signup')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-6">
              {/* Google Sign In */}
              <Button
                variant="outline"
                className="w-full border-gray-300 text-black hover:bg-gray-50 font-light"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('auth.continueWithGoogle')}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 font-light tracking-wide">
                    {t('auth.orContinueWithEmail')}
                  </span>
                </div>
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="signup-name"
                    className="text-sm font-light uppercase tracking-wide text-gray-700"
                  >
                    {t('auth.fullName')}
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-email"
                    className="text-sm font-light uppercase tracking-wide text-gray-700"
                  >
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@email.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-password"
                    className="text-sm font-light uppercase tracking-wide text-gray-700"
                  >
                    {t('auth.password')}
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    minLength={6}
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-500">
                    {t('auth.passwordMinLength')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="signup-confirm"
                    className="text-sm font-light uppercase tracking-wide text-gray-700"
                  >
                    {t('auth.confirmPassword')}
                  </Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="border-gray-300"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white font-light uppercase tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading
                    ? t('auth.creatingAccount')
                    : t('auth.signupButton')}
                </Button>
              </form>

              {/* Switch to Sign In */}
              <div className="text-center text-sm">
                <span className="text-gray-600">
                  {t('auth.alreadyHaveAccount')}{' '}
                </span>
                <button
                  onClick={() => setActiveTab('signin')}
                  className="text-black font-medium hover:underline"
                >
                  {t('auth.signin')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
