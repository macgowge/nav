import bcrypt from 'bcryptjs';

export async function onRequest(context) {
  const { request, env } = context;
  const { username, password } = await request.json();
  if (!username || !password) {
    return Response.json({ error: '请输入用户名和密码' }, { status: 400 });
  }
  const admin = await env.DB.prepare('SELECT * FROM admin WHERE username = ?').bind(username).first();
  if (!admin) {
    return Response.json({ error: '用户名不存在' }, { status: 403 });
  }
  const match = await bcrypt.compare(password, admin.password_hash);
  if (match) {
    // 简单返回登录成功，实际可以设置 session/cookie
    return Response.json({ success: true, username });
  } else {
    return Response.json({ error: '密码错误' }, { status: 403 });
  }
}
