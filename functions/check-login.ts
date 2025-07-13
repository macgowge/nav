export async function onRequest(context) {
  // 简单实现：实际生产建议用 JWT 或 session
  // 这里只做演示，直接返回 success
  return Response.json({ success: true });
}
