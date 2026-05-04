import { useState } from "react";
import Button from "../../../components/common/Button";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const submit = () => {
    onSend?.(text);
    setText("");
  };

  return (
    <div className="d-flex gap-2">
      <input
        className="input-premium flex-grow-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask about visits, pets, appointments..."
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <Button onClick={submit}>Send</Button>
    </div>
  );
}