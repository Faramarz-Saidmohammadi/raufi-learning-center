import {
  adminSessionCookie,
  createAdminSession,
  getAdminConfiguration,
  verifyAdminCredentials,
} from "@/lib/admin-session";

function redirectResponse(request: Request, path: string, cookie?: string): Response {
  const response = Response.redirect(new URL(path, request.url), 303);
  if (cookie) response.headers.set("set-cookie", cookie);
  return response;
}

export async function POST(request: Request) {
  const configuration = await getAdminConfiguration();
  const formRequest = request.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ?? false;
  if (!configuration.configured) {
    return formRequest
      ? redirectResponse(request, "/admin?error=configuration")
      : Response.json({ error: "CMS authentication is not configured." }, { status: 503 });
  }

  let email = "";
  let password = "";
  try {
    if (formRequest) {
      const form = await request.formData();
      email = String(form.get("email") ?? "").slice(0, 180);
      password = String(form.get("password") ?? "").slice(0, 256);
    } else {
      const payload = await request.json() as Record<string, unknown>;
      email = String(payload.email ?? "").slice(0, 180);
      password = String(payload.password ?? "").slice(0, 256);
    }
  } catch {
    return Response.json({ error: "Invalid sign-in request." }, { status: 400 });
  }

  const user = await verifyAdminCredentials(email, password);
  if (!user) {
    return formRequest
      ? redirectResponse(request, "/admin?error=invalid")
      : Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createAdminSession(user);
  const cookie = adminSessionCookie(token, new URL(request.url).protocol === "https:");
  if (formRequest) return redirectResponse(request, "/admin", cookie);
  return Response.json({ ok: true, user }, { headers: { "set-cookie": cookie, "cache-control": "no-store" } });
}
