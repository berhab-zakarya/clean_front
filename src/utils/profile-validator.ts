export const isProfileComplete = (profile: any): boolean => {
  if (!profile) return false;

  const requiredFields = [
    'business_name',
    'business_address',
    'phone_number',
    'tax_identification'
  ];

  return requiredFields.every(field => 
    profile[field] && profile[field].trim().length > 0
  );
};