export const useLogout = async () => {
  const { auth } = useSupabaseClient();
  await auth.signOut();
};
