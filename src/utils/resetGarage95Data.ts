const RESETTABLE_KEYS = [
  'garage95_accounts_db',
  'garage95_user',
  'garage95_authenticated',
  'garage95_onboarding_step',
  'garage95_pending_user',
  'garage95_friends'
] as const;

export function resetGarage95Data(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  RESETTABLE_KEYS.forEach((key) => localStorage.removeItem(key));
}

declare global {
  interface Window {
    resetGarage95Data: typeof resetGarage95Data;
  }
}

if (typeof window !== 'undefined') {
  window.resetGarage95Data = resetGarage95Data;
}
