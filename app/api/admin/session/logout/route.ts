import { expiredAdminSessionCookie } from "@/lib/admin-session";

export async function POST(request: Request) {
  const response = Response.redirect(new URL("/admin", request.url), 303);
  response.headers.set("set-cookie", expiredAdminSessionCookie(new URL(request.url).protocol === "https:"));
  return response;
}
