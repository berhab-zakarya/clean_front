export interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
  frequency: "monthly" | "yearly";
  features: {
    storage: string;
    projects: number;
  };
  is_best_value: boolean;
  is_popular: boolean;
  created_at: string; // ISO timestamp
  updated_at: string;
}

  
  export interface PlanFeatures {
    features: string[];
  }
  
  export interface ParsedPlan extends Omit<Plan, 'features'> {
    features: PlanFeatures;
  }