export interface UserProfile {
    business_name: string;
    business_address: string | null;
    phone_number: string | null;
    tax_identification: string | null;
  }
  
  export interface User {
    id: number;
    email: string;
    role_name: string;
    email_verified: boolean;
    created_at: string;
    last_login_at: string;
    profile: UserProfile;
  }
  
  export interface AuthResponse {
    refresh: string;
    access: string;
    user: User;
    stores: any[]; // TODO: Replace with Store[] type
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface SignupData {
    email: string;
    password: string;
    password_confirm: string;
    role: string;
  }
  
  export interface UserProfileResponse {
    user: User & {
      profile: {
        business_name: string;
        business_address: string | null;
        phone_number: string | null;
        tax_identification: string | null;
        is_verified: boolean;
        verification_document_url: string | null;
        bio: string | null;
        profile_image_url: string | null;
      };
    };
    stores: any[]; // TODO: Replace with Store[] type
  }
  
  export interface UpdateProfileData {
    profile: {
      business_name?: string;
      business_address?: string | null;
      phone_number?: string | null;
      tax_identification?: string | null;
      is_verified?: boolean;
      verification_document_url?: string | null;
      bio?: string | null;
      profile_image_url?: string | null;
    };
  }
  
  export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }
  
  export interface ChangePasswordResponse {
    message: string;
  }
  
  export interface RequestPasswordResetResponse {
    message: string;
  }