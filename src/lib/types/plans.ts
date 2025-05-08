export interface Plan {
    id: number;
    name: string;
    description: string;
    price: string;
    frequency: 'monthly' | 'yearly';
    features: string;
    is_best_value: boolean;
    is_popular: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface PlanFeatures {
    features: string[];
  }
  
  export interface ParsedPlan extends Omit<Plan, 'features'> {
    features: PlanFeatures;
  }