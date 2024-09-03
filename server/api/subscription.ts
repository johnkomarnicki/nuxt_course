export default defineEventHandler(async (event) => {
  try {
    // Obtain body & and convertkit api key
    const body = await readBody(event);
    const { convertKitKey } = useRuntimeConfig();

    // Check for email
    if (!body.email) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email address is required",
      });
    }

    // Make request to convertKit
    const res: any = await $fetch("https://api.convertkit.com/v3/forms/6688199/subscrib", {
      method: "POST",
      body: {
        api_key: convertKitKey,
        email: body.email,
      },
    });

    // Check if user is active
    if (res.subscription.state === "active") {
      return {
        title: "Opps",
        message: "It looks like you're already subscribed!",
      };
    }
    // Return success message
    return {
      title: "Welcome to the newsletter",
      message: "Thank's for joining! Please check your email to confirm your subscription.",
    };
  } catch {
    // Handle network errors
    throw createError({ statusCode: 500, statusMessage: "Internal server error" });
  }
});
