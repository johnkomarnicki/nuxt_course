export const useIsAdmin = () => {
  const user = useSupabaseUser();
  return user.value?.app_metadata.claims_admin;
};
