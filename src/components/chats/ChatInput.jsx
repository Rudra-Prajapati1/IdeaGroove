import { Send, Paperclip, X, FileText, Image } from "lucide-react";
import React, { useState, useRef } from "react";
import api from "../../api/axios";

const ChatInput = ({
  activeRoom = null,
  sendMessage,
  sendFileMessage,
  startTyping,
  stopTyping,
}) => {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null); // { url, type, name }
  const fileInputRef = useRef(null);

  if (!activeRoom) return null;

  const handleSend = () => {
    if (previewFile) {
      sendFileMessage(activeRoom.Room_ID, previewFile.url, previewFile.type);
      if (message.trim()) {
        // Send caption as separate text message if provided (WhatsApp-style)
        sendMessage(activeRoom.Room_ID, message.trim());
      }
      setPreviewFile(null);
      setMessage("");
      if (stopTyping) stopTyping(activeRoom.Room_ID);
      return;
    }
    if (!message.trim()) return;
    sendMessage(activeRoom.Room_ID, message);
    if (stopTyping) stopTyping(activeRoom.Room_ID);
    setMessage("");
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (startTyping) startTyping(activeRoom.Room_ID);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setPreviewFile({
          url: res.data.url,
          type: isPdf ? "file" : "image",
          name: file.name,
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const cancelPreview = () => setPreviewFile(null);

  return (
    <div className="border-t">
      {/* File preview bar */}
      {previewFile && (
        <div className="p-3 bg-primary/5 border-b flex items-center gap-3">
          {previewFile.type === "image" ? (
            <img
              src={previewFile.url}
              alt="preview"
              className="h-10 w-10 object-cover rounded-lg shrink-0"
            />
          ) : (
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          )}
          <span className="flex-1 text-sm text-primary font-inter truncate">
            {previewFile.name || "File"}
          </span>
          <button
            onClick={cancelPreview}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="p-4 flex items-center gap-3">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpg,image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Attach button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 text-primary hover:bg-primary/10 rounded-xl transition disabled:opacity-40"
          title="Attach image or PDF"
        >
          {uploading ? (
            <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin block" />
          ) : (
            <Paperclip className="w-5 h-5" />
          )}
        </button>

        <input
          type="text"
          placeholder={
            previewFile ? "Add a caption (optional)..." : "Type a message..."
          }
          className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={uploading}
        />
        <button
          onClick={handleSend}
          disabled={uploading || (!message.trim() && !previewFile)}
          className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
