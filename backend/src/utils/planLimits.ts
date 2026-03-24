export const PLAN_LIMITS: Record<string, {
  callsPerMonth: number;
  aiResponsesPerMonth: number;
  phoneNumbers: number;
  extractionFields: number;
  label: string;
  price: string;
}> = {
  starter: {
    callsPerMonth: 100,
    aiResponsesPerMonth: 500,
    phoneNumbers: 1,
    extractionFields: 5,
    label: 'Starter',
    price: '₹999/mo',
  },
  pro: {
    callsPerMonth: 1000,
    aiResponsesPerMonth: 5000,
    phoneNumbers: 3,
    extractionFields: 20,
    label: 'Pro',
    price: '₹2999/mo',
  },
  enterprise: {
    callsPerMonth: Infinity,
    aiResponsesPerMonth: Infinity,
    phoneNumbers: Infinity,
    extractionFields: Infinity,
    label: 'Enterprise',
    price: 'Custom',
  },
};

export function getPlanLimits(plan: string) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.starter;
}
