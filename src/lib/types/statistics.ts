export type StatisticsPeriod = 'daily' | 'weekly' | 'monthly';

export interface TopProduct {
  product_id: number;
  order_count: number;
}

export interface TopProductDetail {
  id: number;
  name: string;
  price: string;
  order_count: number;
}

export interface StatisticsBase {
  period: StatisticsPeriod;
  start_date: string;
  end_date: string;
  total_orders: number;
  total_sales_amount: string;
  average_order_value: string;
  total_ar_sessions: number;
  completed_ar_sessions: number;
  ar_conversion_rate: number;
  top_products: TopProduct[];
  top_products_details: TopProductDetail[];
}

export interface StatisticsSnapshot extends StatisticsBase {
  id: number;
  created_at: string;
}

export interface RealtimeStatistics extends StatisticsBase {}

export interface StatisticsApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
} 