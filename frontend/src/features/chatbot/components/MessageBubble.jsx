export default function MessageBubble({ from, text }) {
  const mine = from === "user";
  return (
    <div
      className={`p-2 px-3 rounded-4 ${mine ? "bubble-user" : "bubble-bot"}`}
      style={{
        justifySelf: mine ? "end" : "start",
        maxWidth: "85%",
      }}
    >
      <div className="small">{text}</div>
    </div>
  );
}