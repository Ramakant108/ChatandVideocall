import { useRef, useState } from "react";
import { Send, Image, X, Smile } from "lucide-react";
import toast from "react-hot-toast";
import { useChatStore } from "../Store/isChatStore.js";
import EmojiPicker from 'emoji-picker-react';

const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const { sendMessages } = useChatStore();

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    // Insert emoji at cursor position or at end
    const cursor = document.querySelector('input[type="text"]').selectionStart;
    const textBeforeCursor = text.slice(0, cursor);
    const textAfterCursor = text.slice(cursor);
    setText(textBeforeCursor + emojiObject.emoji + textAfterCursor);
  };

  // Close emoji picker when clicking outside
  const handleClickOutside = (e) => {
    if (
      showEmojiPicker &&
      !e.target.closest('.emoji-picker-container') &&
      e.target !== emojiButtonRef.current
    ) {
      setShowEmojiPicker(false);
    }
  };

  // Add click outside listener
  useState(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showEmojiPicker]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    setLoading(true);
    await sendMessages({
      text: text.trim(),
      image: imagePreview,
    });
    
    setText("");
    setImagePreview(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-4 w-full bg-base-100 border-t border-base-300">
      {/* Image Preview Section */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Chat Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          {/* Emoji Picker */}
          <div className="relative">
            <button
              type="button"
              ref={emojiButtonRef}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="btn btn-circle btn-sm"
            >
              <Smile size={20} className={showEmojiPicker ? "text-primary" : ""} />
            </button>
            
            {/* Emoji Picker Dropdown */}
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 left-0 z-50 emoji-picker-container">
                <div className="shadow-lg rounded-lg">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={300}
                    height={400}
                    theme="dark"
                    searchDisabled
                    skinTonesDisabled
                    previewConfig={{ showPreview: true }}
                  />
                </div>
              </div>
            )}
          </div>

          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={(!text.trim() && !imagePreview) || loading}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
