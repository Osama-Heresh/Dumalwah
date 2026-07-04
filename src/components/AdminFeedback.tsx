import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { FeedbackTicket } from "../types";

export function AdminFeedback() {
  const [feedback, setFeedback] = useState<FeedbackTicket[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const q = query(collection(db, "feedback"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      setFeedback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedbackTicket)));
    };
    fetchFeedback();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Feedback Admin</h1>
      {feedback.map(item => (
        <div key={item.id} className="border p-4 mb-4 rounded">
          <p><strong>Type:</strong> {item.type}</p>
          <p><strong>Sender:</strong> {item.senderName} ({item.senderEmail})</p>
          <p><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
          <p><strong>Content:</strong> {item.text}</p>
        </div>
      ))}
    </div>
  );
}
