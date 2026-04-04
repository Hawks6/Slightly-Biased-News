import { invalidateAll, invalidateAllNews, invalidateAllEvents, invalidateAllAnalyze, isRedisAvailable } from "@/lib/redis";

export async function POST(request) {
  if (!isRedisAvailable()) {
    return Response.json({ error: "Redis not configured" }, { status: 503 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const target = body.target || "all";

    let result;
    switch (target) {
      case "news":
        await invalidateAllNews();
        result = { invalidated: "news" };
        break;
      case "events":
        await invalidateAllEvents();
        result = { invalidated: "events" };
        break;
      case "analyze":
        await invalidateAllAnalyze();
        result = { invalidated: "analyze" };
        break;
      case "all":
      default:
        await invalidateAll();
        result = { invalidated: "all" };
    }

    return Response.json({ success: true, ...result });
  } catch (error) {
    console.error("[Cache Invalidate] Error:", error);
    return Response.json({ error: "Failed to invalidate cache" }, { status: 500 });
  }
}

export async function GET() {
  if (!isRedisAvailable()) {
    return Response.json({ configured: false });
  }
  return Response.json({ configured: true });
}
