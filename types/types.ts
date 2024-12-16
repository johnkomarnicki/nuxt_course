export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
}

export interface RecipeResponse {
  recipes: Recipe[];
  total: number;
  skip: number;
  limit: number;
}

export interface ConvertKitData {
  subscription?: {
    id: number;
    state: string;
    created_at: string;
    source: string;
    referrer: string | null;
    subscribable_id: number;
    subscribable_type: string;
    subscriber: {
      id: number;
    };
  };
}

export interface SubscribersResponse {
  total_subscribers: number;
  page: number;
  total_pages: number;
  subscribers: {
    id: number;
    first_name: string;
    email_address: string;
    state: string;
    created_at: string;
    fields: {
      last_name: string;
    };
  }[];
}
