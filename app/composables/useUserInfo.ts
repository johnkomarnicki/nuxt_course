import type { Database, Tables } from "~~/types/database.types";

export const useUserInfo = () => {
  const client = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const userInfo = useState<Tables<"profiles">>("userInfo");

  async function setUserInfo(refetch = false) {
    if (!userInfo.value || refetch) {
      const { data } = await client
        .from("profiles")
        .select("*")
        .eq("id", user.value?.id as string)
        .maybeSingle();

      if (data) userInfo.value = data;
    }
  }

  return { userInfo, setUserInfo };
};
