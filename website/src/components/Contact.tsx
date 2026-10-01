"use client";
import { useState, useSyncExternalStore } from "react";
const subscribe = () => () => {};
import { copy, type Locale } from "@/lib/site";
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
        setNotice(
          copy(
            locale,
            "Your message has not been sent. The contact channel is awaiting verification. No form data leaves this page.",
            "消息未发送。联系渠道尚待核实，表单内容不会离开此页面。",
          ),
        );
      }}
    >
      <p className="form-notice">
        {copy(
          locale,
          "Contact delivery is not yet connected. This form lets you prepare a message locally; nothing is transmitted or stored.",
          "联系渠道尚未接通。你可以在此准备消息，内容不会发送或保存。",
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
            "I understand this message stays in my browser and will not be sent.",
            "我了解此消息仅保留在当前页面，不会发送。",
          )}
        </label>
        <button className="solid-button" type="submit">
          {copy(locale, "Check message", "检查消息")} ↗
        </button>
      </fieldset>
      <p role="status">{notice}</p>
      <noscript>
        {copy(
          locale,
          "JavaScript is required for local form validation. There is no submission endpoint.",
          "本地表单检查需要 JavaScript。当前无提交端点。",
        )}
      </noscript>
    </form>
  );
}
