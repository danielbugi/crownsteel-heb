'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface Settings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;

  // Email Settings
  smtpFromEmail: string;
  smtpReplyToEmail?: string;
  emailNotificationsEnabled: boolean;
  adminNotificationEmail: string;

  // Shipping Settings
  shippingCost: number;
  freeShippingThreshold: number;
  shippingDescription: string;
  processingTime: string;
}

interface CachedSettings {
  settings: Settings;
  timestamp: number;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const CACHE_KEY = 'site-settings-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const getCachedSettings = (): Settings | null => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { settings, timestamp }: CachedSettings = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      return isExpired ? null : settings;
    } catch {
      return null;
    }
  };

  const setCachedSettings = (settings: Settings) => {
    if (typeof window === 'undefined') return;
    try {
      const cached: CachedSettings = { settings, timestamp: Date.now() };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch {
      // Ignore localStorage errors
    }
  };

  const fetchSettings = async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cached = getCachedSettings();
      if (cached) {
        setSettings(cached);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data.settings);
      setCachedSettings(data.settings);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings(true);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
