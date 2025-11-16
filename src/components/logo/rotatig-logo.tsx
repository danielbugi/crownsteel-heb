'use client';
import Image from 'next/image';
import styles from './rotating-logo.module.css';

export default function RotatingLogo() {
  return (
    <div className={styles.container}>
      <div className={styles.circle}>
        <span>BOGA ROYAL JEWELS ✦ CROWNSTEEL ✦ </span>
      </div>
      <Image
        src="/images/logo/logo-2-white.png"
        alt="Logo"
        width={120}
        height={120}
        className={styles.logo}
      />
    </div>
  );
}
