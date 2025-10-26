'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Auto-redirect to order confirmation after 2 seconds
    const timer = setTimeout(() => {
      router.push(`/order-confirmation?orderId=${orderId}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [orderId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Order #{orderId}</p>
        <p className="text-sm text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
