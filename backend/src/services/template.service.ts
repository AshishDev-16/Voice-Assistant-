export interface IndustryTemplate {
  personality: string;
  knowledgeBase: string;
  defaultExtractionSchema: Record<string, string>;
}

export const INDUSTRY_TEMPLATES: Record<string, IndustryTemplate> = {
  "Healthcare": {
    personality: "Professional, empathetic, and clinical. Prioritize patient confidentiality and urgent care coordination.",
    knowledgeBase: `Clinic Name: [Your Clinic Name]
Services: Routine Checkups, Emergency Consultations, Specialist Referrals.
Hours: Mon-Fri 9 AM - 5 PM.
Booking: Always ask for Patient Name, Phone Number, and Reason for Visit. 
Insurance: We accept most major providers including Aetna and BlueShield.`,
    defaultExtractionSchema: {
      "Patient Name": "Full name of the caller",
      "Condition": "Brief description of the medical issue",
      "Preferred Date": "When the patient wants to visit"
    }
  },
  "Real Estate": {
    personality: "Ambitious, knowledgeable, and inviting. Focus on property features and scheduling viewings for high-intent buyers.",
    knowledgeBase: `Agency: [Your Agency Name]
Properties: Luxury Condos, Suburban Homes, Commercial Spaces.
Price Range: $500k - $5M.
Goals: Qualify the buyer's budget and target location. Schedule the site visit.`,
    defaultExtractionSchema: {
      "Buyer Name": "Name of the potential lead",
      "Budget": "Max budget specified by caller",
      "Property Interest": "The property or area they asked about"
    }
  },
  "SaaS / Tech": {
    personality: "Technical, fast-paced, and problem-solving oriented. Focus on feature explanations and demo bookings.",
    knowledgeBase: `Product: [Your Product Name]
Platform: Cloud-based B2B solutions.
Pricing: Professional ($49/mo), Enterprise (Contact Sales).
Support: High-level technical FAQs and Demo scheduling.`,
    defaultExtractionSchema: {
      "Company Name": "Name of the business",
      "Platform Need": "What problem are they trying to solve",
      "Employee Count": "Scale of the business"
    }
  },
  "E-commerce": {
    personality: "Cheerful, helpful, and retail-focused. Prioritize order tracking and product availability info.",
    knowledgeBase: `Store: [Your Store Name]
Products: High-end electronics, apparel, and lifestyle.
Shipping: 2-3 business days. Free over $50.
Returns: 30-day window. Easy exchanges.`,
    defaultExtractionSchema: {
      "Customer Name": "Name for order look-up",
      "Product Link": "The specific item inquired about",
      "Order Number": "Existing order ID if provided"
    }
  }
};

export class TemplateService {
  static getTemplate(industry: string): IndustryTemplate {
    return INDUSTRY_TEMPLATES[industry] || INDUSTRY_TEMPLATES["Healthcare"];
  }
}
