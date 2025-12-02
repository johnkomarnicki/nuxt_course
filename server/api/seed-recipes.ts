import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);

  try {
    // Fetch recipes from dummyjson
    const response = await fetch("https://dummyjson.com/recipes?limit=12");
    const data = await response.json();

    const recipesToInsert = data.recipes.map((recipe: any) => ({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookTimeMinutes: recipe.cookTimeMinutes,
      caloriesPerServing: recipe.caloriesPerServing,
      rating: recipe.rating,
      reviewCount: recipe.reviewCount,
      image: recipe.image,
      user_id: null, // null = public recipe
    }));

    const { data: insertedData, error } = await client
      .from("recipes")
      .insert(recipesToInsert)
      .select();

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to seed recipes",
        data: error,
      });
    }

    return {
      success: true,
      count: insertedData?.length,
      message: `Successfully seeded ${insertedData?.length} recipes`,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to seed recipes",
      data: error,
    });
  }
});
