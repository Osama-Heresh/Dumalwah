import React, { useEffect, useState } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FeedbackTicket } from "../types";

export function AdminFeedback({ language }: { language: string }) {
  const [feedback, setFeedback] = useState<FeedbackTicket[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const q = query(collection(db, "feedback"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        setFeedback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackTicket)));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "feedback");
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="p-6 bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl max-w-4xl mx-auto my-8 shadow-xl text-[#1F1106]">
      <h1 className="text-2xl font-serif font-bold mb-4 border-b border-[#EADFC9] pb-3 text-[#1F1106]">{language === "ar" ? "إدارة الاقتراحات والشكاوى" : "Feedback Admin"}</h1>
      {feedback.length === 0 ? (
        <p className="text-sm text-[#1F1106]/50 italic">{language === "ar" ? "لا توجد أي اقتراحات أو شكاوى حالياً." : "No feedback submitted yet."}</p>
      ) : (
        feedback.map(item => (
          <div key={item.id} className="bg-[#FDFBF7] border border-[#EADFC9] p-5 mb-4 rounded-xl shadow-xs relative overflow-hidden hover:border-[#D4AF37] transition">
            <span className={`absolute top-4 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${item.type === "complaint" ? "bg-red-500/10 text-red-600 border border-red-200" : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"}`}>
              {item.type === "complaint" ? (language === "ar" ? "شكوى" : "Complaint") : (language === "ar" ? "اقتراح" : "Suggestion")}
            </span>
            <p className="text-sm font-semibold mb-1 text-[#1F1106]">👥 <strong className="font-bold">{item.senderName}</strong> <span className="text-[#1F1106]/60 text-xs">({item.senderEmail} {item.senderPhone ? `| ${item.senderPhone}` : ""})</span></p>
            <p className="text-[11px] text-[#1F1106]/40 font-mono mb-3">{new Date(item.date).toLocaleString()}</p>
            <div className="bg-[#FDFBF7] border border-[#EADFC9]/50 p-3 rounded-lg text-sm leading-relaxed text-[#1F1106]/90">
              {item.text}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
