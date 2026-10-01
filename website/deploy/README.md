# 阿里云单服务器部署

本次目标为用户提供的 Ubuntu 24.04 x86_64 ECS、2 vCPU / 4GB RAM。正式 DNS/备案与 SSH 可达状态尚需核实。部署不能覆盖已有网站或终止已有服务。

## 上线条件

- SSH 密钥仅放在安全工作目录或服务器管理平台，不能提交至 Git。
- 使用实际 SSH 端口，核实服务器指纹和现有服务。
- `zaithe.com` 的 A 记录指向目标服务器。中国内地服务器的备案情况需核实后再上线；已有备案号不得猜写。
- 检查 80/443 是否被已有 Nginx、Caddy、容器或其他服务占用。如果已有入口，应接入现有反向代理，不能直接启动第二个入口。
- 安全组开放 HTTPS、HTTP 验证及管理员来源的 SSH；不公开 Next.js 3000 端口。
- 确认 Docker Engine / Compose 可用。本配置不自动安装系统软件或修改防火墙。

## 执行

在服务器的独立目录检出已验证提交，进入 `website/deploy`，复制 `.env.example` 为 `.env` 并设置已确认域名。`SITE_ORIGIN` 在镜像构建时用于 canonical、sitemap 和组织数据，因此更改域名必须重新构建。

```sh
docker compose --env-file .env config --quiet
docker compose --env-file .env build web
docker compose --env-file .env up -d web
docker compose --env-file .env ps
```

用户提供的端口输出证实现有Nginx占用80/443，且有多个既存Next应用。默认只启动web于127.0.0.1:3090，不启动Caddy。审计现有zaithe.com的Nginx站点配置与证书后，使用nginx-location.conf中的示例接入该站点；先备份，执行nginx -t通过后reload，保留旧上游以便回退。不可盲目替换整个Nginx配置。Caddy仅为全新空服务器的可选入口，显式fresh-server-only profile才会启动；现有机器不得启用该profile。首次构建需下载 Node 与依赖，2 vCPU / 4GB 无 swap 的服务器先查看可用内存；不要为了本网站杀掉其他进程。可改为在构建机器生成镜像、通过授权渠道传入服务器，减少生产服务器构建压力。

联系表单只创建访客自己的邮件草稿，不向服务器提交内容、不代发邮件、不自动回复。无需 SMTP 密码。现存 POST API 保持拒绝投递状态，作为旧端点的保护。

## 验收与回退

检查 `/api/health`、中英文页、HTTPS证书、canonical/hreflang、邮箱草稿、JS-off、motion fallback、手机与桌面错误日志。不要发送真实个人资料作为测试。

上线前记录原容器/反向代理配置与已运行镜像 ID。保留上一镜像及 Caddy 数据卷。回退时恢复已记录的镜像或旧入口配置，而不是 `docker compose down -v`。没有原生 Safari/iOS 设备结果时保留该验收缺口。

网站没有安装 RUM/统计脚本。上线后的实验室测试不能当作真实用户75分位；若增加RUM，先决定采集字段、保存期限与处理方，并相应更新隐私政策。
