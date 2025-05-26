export interface Attribute {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAttributeRequest {
  name: string;
  slug: string;

}

export interface AttributeValue {
  id: number;
  value: string;
  color_code?: string;
  created_at: string;
  updated_at: string;
}

export interface AddAttributeValuesRequest {
  values: Array<{
    value: string;
    color_code?: string;
  }>;
} 