import React, { useState } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
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
      handleFirestoreError(error, OperationType.WRITE, "feedback");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-[#FDFBF7] border border-[#EADFC9] p-6 rounded-2xl w-full max-w-md text-[#1F1106] shadow-2xl relative">
        <h2 className="text-xl font-serif font-bold mb-4 border-b border-[#EADFC9]/40 pb-2 text-[#1F1106]">{language === "ar" ? "تقديم اقتراح أو شكوى" : "Suggestions & Complaints"}</h2>
        
        <label className="block text-[11px] font-bold text-[#1F1106]/60 uppercase tracking-wider mb-1">{language === "ar" ? "النوع" : "Type"}</label>
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full mb-3 p-2.5 border border-[#EADFC9] focus:border-[#D4AF37] rounded-xl text-[#1F1106] bg-[#FDFBF7] outline-none transition">
          <option value="suggestion">{language === "ar" ? "اقتراح" : "Suggestion"}</option>
          <option value="complaint">{language === "ar" ? "شكوى" : "Complaint"}</option>
        </select>

        <label className="block text-[11px] font-bold text-[#1F1106]/60 uppercase tracking-wider mb-1">{language === "ar" ? "الاسم كامل *" : "Name *"}</label>
        <input type="text" placeholder={language === "ar" ? "الاسم" : "Name"} value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full mb-3 p-2.5 border border-[#EADFC9] focus:border-[#D4AF37] rounded-xl text-[#1F1106] bg-[#FDFBF7] outline-none transition" required />
        
        <label className="block text-[11px] font-bold text-[#1F1106]/60 uppercase tracking-wider mb-1">{language === "ar" ? "البريد الإلكتروني *" : "Email *"}</label>
        <input type="email" placeholder={language === "ar" ? "البريد الإلكتروني" : "Email"} value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className="w-full mb-3 p-2.5 border border-[#EADFC9] focus:border-[#D4AF37] rounded-xl text-[#1F1106] bg-[#FDFBF7] outline-none transition" required />
        
        <label className="block text-[11px] font-bold text-[#1F1106]/60 uppercase tracking-wider mb-1">{language === "ar" ? "رقم الهاتف" : "Phone"}</label>
        <input type="tel" placeholder={language === "ar" ? "الهاتف" : "Phone"} value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} className="w-full mb-3 p-2.5 border border-[#EADFC9] focus:border-[#D4AF37] rounded-xl text-[#1F1106] bg-[#FDFBF7] outline-none transition" />
        
        <label className="block text-[11px] font-bold text-[#1F1106]/60 uppercase tracking-wider mb-1">{language === "ar" ? "التفاصيل والرسالة *" : "Details *"}</label>
        <textarea placeholder={language === "ar" ? "يرجى كتابة التفاصيل هنا..." : "Details"} value={text} onChange={(e) => setText(e.target.value)} className="w-full mb-4 p-2.5 border border-[#EADFC9] focus:border-[#D4AF37] rounded-xl text-[#1F1106] bg-[#FDFBF7] outline-none transition h-24 resize-none" required />
        
        <div className="flex justify-end gap-2 border-t border-[#EADFC9]/40 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-[#EADFC9]/50 hover:bg-[#EADFC9] text-[#1F1106] font-semibold rounded-xl transition cursor-pointer">{language === "ar" ? "إلغاء" : "Cancel"}</button>
          <button type="submit" className="px-5 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-[#1F1106] font-bold rounded-xl shadow transition cursor-pointer">{language === "ar" ? "إرسال" : "Submit"}</button>
        </div>
      </form>
    </div>
  );
}
