"use client";
import { useState, useSyncExternalStore } from "react";
const subscribe = () => () => {};
import { contactEmail, copy, localPath, type Locale } from "@/lib/site";
import { contactMailto } from "@/lib/contact-mailto";
export function Contact({ locale }: { locale: Locale }) {
  const [notice, setNotice] = useState("");
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const fields = new FormData(e.currentTarget);
        const value = (key: string) => String(fields.get(key) || "").trim();
        const link = document.createElement("a");
        link.href = contactMailto({
          name: value("name"),
          email: value("email"),
          company: value("company"),
          topic: value("topic"),
          message: value("message"),
        });
        document.body.append(link);
        link.click();
        link.remove();
        setNotice(
          copy(
            locale,
            "Your message has not been sent. Send the draft in your email app. If it did not open, email zaithe@zaithe.com directly.",
            "消息尚未发送。请在邮件应用中确认并发送；若未打开邮件应用，请直接联系 zaithe@zaithe.com。",
          ),
        );
      }}
    >
      <p className="form-notice">
        {copy(
          locale,
          "Create an email draft, then send it in your email app. Form contents are not uploaded to this website.",
          "填写后创建邮件草稿，再在你的邮件应用中发送。表单内容不会上传至本网站。",
        )}
      </p>
      <fieldset disabled={!hydrated}>
        <div className="form-grid">
          <label>
            {copy(locale, "Name", "姓名")}
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            {copy(locale, "Email", "邮箱")}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </label>
          <label>
            {copy(locale, "Company (optional)", "公司（选填）")}
            <input name="company" autoComplete="organization" maxLength={150} />
          </label>
          <label>
            {copy(locale, "Topic", "主题")}
            <select name="topic">
              <option>General</option>
              <option>Product</option>
              <option>Studio</option>
              <option>Partnership</option>
              <option>Press</option>
            </select>
          </label>
        </div>
        <label>
          {copy(locale, "Message", "消息")}
          <textarea name="message" rows={5} maxLength={5000} required />
        </label>
        <label className="consent">
          <input type="checkbox" required />
          {copy(
            locale,
            "I agree to place these details in an email draft for my enquiry.",
            "我同意将这些信息填入咨询邮件草稿。",
          )}
        </label>
        <button className="solid-button" type="submit">
          {copy(locale, "Create email", "创建邮件")} ↗
        </button>
      </fieldset>
      <p>
        <a href={localPath(locale, "privacy")}>
          {copy(locale, "Read privacy policy", "阅读隐私政策")}
        </a>{" "}
        · <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
      </p>
      <p role="status">{notice}</p>
      <noscript>
        {copy(
          locale,
          "To prepare a draft without JavaScript, use the email link above.",
          "未启用 JavaScript 时，请使用上方邮箱链接撰写邮件。",
        )}
      </noscript>
    </form>
  );
}
