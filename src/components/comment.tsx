import { useEffect, useState } from "react";

const defaultConfig = {
  page_title: "Comments",
  input_placeholder: "Share your thoughts...",
  button_text: "Send",
  background_color: "#f0f4f8",
  card_color: "#ffffff",
  text_color: "#1a202c",
  primary_button_color: "#3b82f6",
  secondary_text_color: "#718096",
  font_family: "system-ui",
  font_size: 16,
};

export default function CommentBox() {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    // document.body.style.fontFamily = `${config.font_family}, system-ui, -apple-system, sans-serif`;
    // document.body.style.fontSize = `${config.font_size}px`;
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;

    if (comments.length >= 999) {
      alert("Maximum limit of 999 comments reached.");
      return;
    }

    setIsSubmitting(true);

    const newComment: Comment = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Simulate async save
    await new Promise((res) => setTimeout(res, 500));

    setComments([newComment, ...comments]);
    setText("");
    setIsSubmitting(false);
  };

  return (
        <div className="max-w-3xl mx-auto">
          {/* Comment Input */}
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="comment"
                className="block text-sm font-medium mb-2"
                style={{ color: config.secondary_text_color }}
              >
                დაწერეთ კომენტარი
              </label>
              <textarea
                id="comment"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="დაწერეთ კომენტარი"
                className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                style={{
                  borderColor: "#cbd5e0",
                  color: config.text_color,
                }}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-60"
                  style={{
                    backgroundColor: config.primary_button_color,
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      config.primary_button_color)
                  }
                >
                  {isSubmitting ? "ᲘᲒᲖᲐᲕᲜᲔᲑᲐ..." : "ᲓᲐᲛᲐᲢᲔᲑᲐ"}
                </button>
              </div>
            </form>

          {/* Comments Section */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: config.text_color }}
            >
              ყველა კომენტარი
            </h2>

            {comments.length === 0 ? (
              <div
                className="text-center py-12 flex flex-col items-center"
                style={{ color: config.secondary_text_color }}
              >
                <svg
                  className="h-12 w-12 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p>კომენტარები ჯერ არ აქვს. დაწერეთ პირველი კომენტარი!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c, i) => (
                  <div
                    key={c.id}
                    className="comment-card p-4 rounded-lg shadow-sm border-l-4 transition-all"
                    style={{
                      backgroundColor: config.card_color,
                      borderLeftColor: config.primary_button_color,
                    }}
                  >
                    <p
                      className="comment-text mb-2"
                      style={{ color: config.text_color }}
                    >
                      {c.text}
                    </p>
                    <p
                      className="comment-time text-sm"
                      style={{ color: config.secondary_text_color }}
                    >
                      {new Date(c.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </div>
    </div>
  );
}
