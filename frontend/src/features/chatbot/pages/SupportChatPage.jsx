import EmptyState from "../../../components/common/EmptyState";

export default function SupportChatPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Support Chat</h2>
      <EmptyState title="Chat UI pending" subtitle="Next we will mount ChatWidget + connect chatbotApi." />
    </div>
  );
}