import React, { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { FeedbackTicket } from "../types";

export function FeedbackForm({ onClose, language }: { onClose: () => void, language: string }) {
  const [type, setType] = useState<"complaint" | "suggestion">("suggestion");
  const [text, setText] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderPhone, setSenderPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "feedback"), {
        type,
        text,
        senderName,
        senderEmail,
        senderPhone,
        date: new Date().toISOString(),
        status: "pending"
      } as Partial<FeedbackTicket>);
      onClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg w-full max-w-md text-gray-900">
        <h2 className="text-xl font-bold mb-4">{language === "ar" ? "اقتراحات وشكاوى" : "Suggestions & Complaints"}</h2>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full mb-2 p-2 border rounded text-gray-900">
          <option value="suggestion">{language === "ar" ? "اقتراح" : "Suggestion"}</option>
          <option value="complaint">{language === "ar" ? "شكوى" : "Complaint"}</option>
        </select>
        <input type="text" placeholder={language === "ar" ? "الاسم" : "Name"} value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full mb-2 p-2 border rounded text-gray-900" required />
        <input type="email" placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"} value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className="w-full mb-2 p-2 border rounded text-gray-900" required />
        <input type="tel" placeholder={language === "ar" ? "الهاتف" : "Phone"} value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="w-full mb-2 p-2 border rounded text-gray-900" />
        <textarea placeholder={language === "ar" ? "التفاصيل" : "Details"} value={text} onChange={(e) => setText(e.target.value)} className="w-full mb-4 p-2 border rounded text-gray-900" required />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{language === "ar" ? "إلغاء" : "Cancel"}</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{language === "ar" ? "إرسال" : "Submit"}</button>
        </div>
      </form>
    </div>
  );
}
