"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_LIMITS = void 0;
exports.getPlanLimits = getPlanLimits;
exports.PLAN_LIMITS = {
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
function getPlanLimits(plan) {
    return exports.PLAN_LIMITS[plan] || exports.PLAN_LIMITS.starter;
}
