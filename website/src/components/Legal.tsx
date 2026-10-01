import { contactEmail, legalOperator, copy, type Locale } from "@/lib/site";
import { Label } from "./Shell";
const privacySections = [
  [
    "Information and purpose",
    "信息与用途",
    "You can browse without an account. The contact form prepares a draft in your chosen email app; it does not submit its fields to this website. If you send the email, we receive your name, address, optional company, topic and message to answer your enquiry. Do not include passwords, financial or medical information, or other confidential data.",
    "你可以无需账号浏览网站。联系表单在你选择的邮件应用中准备草稿，不向本网站提交字段。你发送邮件后，我们收到姓名、邮箱、选填公司、主题及消息，仅用于处理和回复咨询。请勿填写密码、财务或医疗信息以及其他保密资料。",
  ],
  [
    "Providers and technical data",
    "服务提供方与技术数据",
    "The selected hosting provider is Alibaba Cloud; the enquiry mailbox uses Tencent Enterprise Email. Network services process connection information to deliver and protect the website. Your email app and mail provider handle the message under their own policies. Website code does not log form contents or store them in a database. We do not use them to train AI models or send automated marketing replies.",
    "托管服务方案为阿里云，咨询收件邮箱使用腾讯企业邮箱。网络服务为提供和保护网站处理连接信息。你选择的邮件应用与邮箱服务按其自身政策处理邮件。网站代码不记录表单内容，也不将其存入数据库。我们不使用咨询内容训练 AI 模型或发送自动营销回复。",
  ],
  [
    "Storage and retention",
    "保存与期限",
    "Unsent drafts stay in the current page or your email app and are not saved by this website. Received enquiries remain in our company mailbox only for the time necessary to handle the enquiry; once no longer needed, they should be deleted or anonymised, unless a separate agreement or legal obligation requires retention. Infrastructure providers may process operational records according to their applicable service settings and obligations.",
    "未发送草稿停留在当前页面或你的邮件应用中，本网站不保存。收到的咨询邮件仅在处理咨询所需期间保留；不再需要时予以删除或匿名化，另有约定或法定义务要求保留的除外。基础设施服务方可能按其适用的服务设置与义务处理运行记录。",
  ],
  [
    "Cookies and choices",
    "Cookie 与选择",
    "No advertising, analytics scripts, tracking cookies or third-party form widgets are installed. You can browse without using the contact form. Preparing a draft does not send it; you can edit or discard it in your email app.",
    "网站未安装广告、统计脚本、跟踪 Cookie 或第三方表单组件。你可以不使用联系表单而正常浏览。创建草稿并不发送邮件，你可以在邮件应用中修改或放弃发送。",
  ],
  [
    "Your requests",
    "你的请求",
    "Email us to request access, correction or deletion of your enquiry, or to withdraw consent for further handling. We may ask for information necessary to verify that the enquiry belongs to you. Requests do not affect processing already performed lawfully or records that must be retained by law.",
    "你可通过下方邮箱请求查阅、更正、删除咨询信息，或撤回对后续处理的同意。为确认咨询属于你，我们可能请求必要的验证信息。请求不影响已依法完成的处理，或依法必须保留的记录。",
  ],
];
const termsSections = [
  [
    "Scope",
    "适用范围",
    "These terms concern this public informational website. Product accounts, paid services and Studio engagements require their own agreements; browsing or sending an enquiry does not create such an agreement.",
    "本条款适用于此公开信息网站。产品账号、付费服务及 Studio 合作需另行约定；浏览或发送咨询不构成此类协议。",
  ],
  [
    "Demonstrations and availability",
    "演示与开放状态",
    "Interfaces marked DEMO use deterministic examples. They do not run live AI inference, access your business systems or prove a product is available. Scientific visualisations illustrate a direction and are not experimental or clinical results. Confirm current availability and scope with us before relying on a product or service.",
    "标注 DEMO 的界面使用确定性示例，不执行实时 AI 推理，不访问你的业务系统，也不证明产品已开放。科学视觉表达方向，不是实验或临床结果。依赖产品或服务前，请与我们确认实际开放状态和范围。",
  ],
  [
    "Permitted use",
    "使用边界",
    "You may browse and link to public pages. Do not interfere with the site, attempt unauthorised access, misuse contact facilities or submit information you have no right to disclose.",
    "你可以浏览并链接公开页面。请勿干扰网站、尝试未经授权的访问、滥用联系功能，或提交无权披露的信息。",
  ],
  [
    "Intellectual property",
    "知识产权",
    "ZAITHE branding and website materials are protected by applicable intellectual property rights. Public source availability does not itself grant rights to trademarks or other separately licensed assets. Open-source code and third-party fonts remain subject to their accompanying licences. For reuse beyond those permissions, contact us.",
    "ZAITHE 品牌与网站内容受适用的知识产权保护。源码公开本身不授予商标或其他独立授权资产的使用权。开源代码与第三方字体遵循随附许可证。超出既有许可的使用，请与我们联系。",
  ],
  [
    "Accuracy, changes and contact",
    "准确性、变更与联系",
    "We aim to keep information accurate and may update the website or these terms. Information here does not guarantee a particular commercial, technical or scientific outcome. These terms do not exclude obligations that cannot lawfully be excluded. Contact us about inaccuracies, rights or use of the site.",
    "我们力求信息准确，并可能更新网站或条款。网站信息不保证特定商业、技术或科学结果。本条款不排除依法不得排除的义务。如发现信息错误，或对权利与网站使用有疑问，请联系我们。",
  ],
];
export function Legal({
  locale,
  privacy,
}: {
  locale: Locale;
  privacy: boolean;
}) {
  return (
    <section className="reading page-hero">
      <Label>{privacy ? "PRIVACY" : "TERMS"}</Label>
      <h1>
        {copy(
          locale,
          privacy ? "Privacy." : "Terms.",
          privacy ? "隐私。" : "条款。",
        )}
      </h1>
      <p className="lead">{legalOperator}</p>
      <p>
        {copy(locale, "Updated: 1 October 2026", "更新日期：2026年10月1日")}
      </p>
      <p>
        {copy(locale, "Contact: ", "联系邮箱：")}
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </p>
      {(privacy ? privacySections : termsSections).map(
        ([enTitle, zhTitle, en, zh]) => (
          <div key={enTitle}>
            <h2>{copy(locale, enTitle, zhTitle)}</h2>
            <p>{copy(locale, en, zh)}</p>
          </div>
        ),
      )}
    </section>
  );
}
