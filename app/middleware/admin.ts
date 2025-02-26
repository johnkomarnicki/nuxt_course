export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  if (!user.value?.app_metadata.claims_admin) {
    throw showError({
      statusCode: 403,
      statusMessage: "Unauthorized Access",
    });
  }
});
