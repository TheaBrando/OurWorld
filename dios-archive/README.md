# DIO's Archive

一个可部署到 GitHub Pages / Cloudflare Pages 的 React + Vite 个人互动网站原型。

## 本地运行

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages

1. 将解压后的项目文件上传到 GitHub 仓库。
2. 如果仓库地址是 `https://用户名.github.io/仓库名/`，编辑 `vite.config.js`，将 `base: "/"` 改为 `base: "/仓库名/"`。
3. 仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。
4. 推送代码后，Actions 会自动构建并部署。
5. 如果使用 `用户名.github.io` 仓库或自定义域名根目录，`base: "/"` 即可。

## Supabase 接入

默认未配置 Supabase 时，留言和涂鸦使用浏览器本地演示模式（只保存在当前浏览器，不会被站长远程看到）。

1. 在 Supabase 创建项目。
2. 在 SQL Editor 执行 `supabase/schema.sql`。
3. Storage 创建公开读取的 `guestbook-images` 与 `doodles` bucket（或按需改为私有并使用签名 URL）。
4. 在本地创建 `.env.local`，填写：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`（或 Supabase 新版 publishable key）
5. 管理员通过 Supabase Auth Dashboard 邀请/创建用户；不要开放访客注册。
6. 在 Supabase SQL Editor 将管理员 UID 加入 `public.admins`：
   `insert into public.admins(user_id) values ('你的-auth-user-uuid');`
7. 配置 GitHub Actions Secrets：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`。若直接在 GitHub Pages 静态站点运行，前端变量必须在构建时注入，不能依赖服务器运行时环境变量。

**安全提醒：** 浏览器端只能使用 anon/publishable key；绝不能将 `service_role` 密钥提交到 GitHub。RLS 才是权限边界。公开留言上传会受到 bucket 限制和 SQL 策略约束；上线前请按实际需求设置验证码、速率限制与内容审核。静态网站无法安全隐藏管理员入口，安全性依赖 Supabase Auth + RLS。

## 内容定制

- 题目与角色立绘：`src/features/quiz/quizData.js`
- 颜色、字体、间距：`src/styles/variables.css`
- 首页个人资料：`src/App.jsx` 中的 profile 区块
- 动画：`src/styles/animations.css`
- Supabase 数据表与权限：`supabase/schema.sql`

## 当前版本范围

已实现响应式个人主页、五题严格签名 Quiz、隐藏崩坏结局、便签一次性交互、SAN 指令与觉醒特效、留言板、Canvas 涂鸦、管理员登录/管理界面。未配置 Supabase 时自动进入本地演示模式。
