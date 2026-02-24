import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export async function currentUser() {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();
    const groups = (session.tokens?.accessToken?.payload["cognito:groups"] as string[] | undefined) ?? [];
    return { user, groups };
  } catch {
    return null;
  }
}

export function hasRole(groups: string[] | undefined, role: "Admin" | "Editor") {
  const g = groups ?? [];
  if (role === "Admin") return g.includes("Admin");
  return g.includes("Admin") || g.includes("Editor");
}
