"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendEnquiryReply } from "./actions";

type ReplyFormProps = {
  enquiryId: string;
  customerName: string;
  senderEmail?: string;
};

export function ReplyForm({ enquiryId, customerName, senderEmail }: ReplyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(sendEnquiryReply, {});

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-3">
      <input type="hidden" name="enquiryId" value={enquiryId} />
      <div>
        <label htmlFor="reply-subject" className="text-sm text-text-muted mb-1 block">
          Subject
        </label>
        <input
          id="reply-subject"
          name="subject"
          defaultValue="Your enquiry — TDH Motors"
          maxLength={180}
          required
          className="w-full px-3 py-2 bg-bg border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="reply-message" className="text-sm text-text-muted mb-1 block">
          Message
        </label>
        <textarea
          id="reply-message"
          name="message"
          rows={7}
          maxLength={5000}
          required
          placeholder={`Write your reply to ${customerName}...`}
          className="w-full px-3 py-2 bg-bg border border-border text-text text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none leading-relaxed"
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={pending}
          className="w-full px-4 py-2.5 bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors disabled:opacity-50"
        >
          {pending ? "Sending..." : "Send reply"}
        </button>
        {senderEmail && (
          <p className="text-sm text-text-muted">
            Sends as {senderEmail}
          </p>
        )}
        {state.success && (
          <p className="text-sm text-brand dark:text-brand-light">{state.success}</p>
        )}
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </div>
    </form>
  );
}
