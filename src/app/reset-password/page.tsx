'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Invalid reset link');
      router.push('/');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      function ResetPasswordForm() {
        const router = useRouter();
        const searchParams = useSearchParams();
        const [token, setToken] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
          const tokenParam = searchParams.get('token');
          if (!tokenParam) {
            toast.error('קישור איפוס לא תקין');
            router.push('/');
          } else {
            setToken(tokenParam);
          }
        }, [searchParams, router]);

        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (password !== confirmPassword) {
            toast.error('הסיסמאות אינן תואמות');
            return;
          }

          if (password.length < 6) {
            toast.error('הסיסמה חייבת להיות לפחות 6 תווים');
            return;
          }

          setIsLoading(true);

          try {
            const response = await fetch('/api/auth/reset-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
              toast.success('הסיסמה אופסה בהצלחה');
              router.push('/');
            } else {
              toast.error(data.error || 'נכשל איפוס הסיסמה');
            }
          } catch (error) {
            toast.error('אירעה שגיאה');
          } finally {
            setIsLoading(false);
          }
        };

        return (
          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            <div>
              <Label htmlFor="password">סיסמה חדשה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">אישור סיסמה</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'מאפס...' : 'אפס סיסמה'}
            </Button>
          </form>
        );
      }
