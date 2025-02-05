export default defineNuxtRouteMiddleware((to, from) => {
  const isAuth = useCookie("user");
  if (!isAuth.value) {
    throw showError({
      statusCode: 403,
      statusMessage: "Unauthorized Access",
    });
  }
});
