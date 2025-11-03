'use client';

import { useState } from 'react';
import { CookieConsent } from './cookie-consent';
import { SignupModal } from './signup-modal';

export function CookieAndSignupFlow() {
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleCookieAccept = () => {
    setShowSignupModal(true);
  };

  const handleSignupModalClose = () => {
    setShowSignupModal(false);
  };

  return (
    <>
      <CookieConsent onAccept={handleCookieAccept} />
      <SignupModal trigger={showSignupModal} onClose={handleSignupModalClose} />
    </>
  );
}
