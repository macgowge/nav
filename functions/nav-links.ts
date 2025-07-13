export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 获取所有导航链接
  if (request.method === 'GET') {
    const res = await env.DB.prepare('SELECT * FROM nav_links ORDER BY created_at DESC').all();
    return Response.json(res.results);
  }

  // 新增导航链接
  if (request.method === 'POST') {
    const { title, url: linkUrl, category, description } = await request.json();
    if (!title || !linkUrl) {
      return Response.json({ error: '缺少必填字段' }, { status: 400 });
    }
    await env.DB.prepare(
      'INSERT INTO nav_links (title, url, category, description) VALUES (?, ?, ?, ?)'
    ).bind(title, linkUrl, category || '', description || '').run();
    return Response.json({ success: true });
  }

  // 删除导航链接
  if (request.method === 'DELETE') {
    const { id } = await request.json();
    if (!id) return Response.json({ error: '缺少ID' }, { status: 400 });
    await env.DB.prepare('DELETE FROM nav_links WHERE id = ?').bind(id).run();
    return Response.json({ success: true });
  }

  return Response.json({ error: '不支持的请求方法' }, { status: 405 });
}
