import { useState } from "react";
import { useCommentsQuery } from "../store/server/comments/queries";
import { useCreateComment } from "../store/server/comments/mutations";
import { CommentModel } from "../store/server/comments/interfaces";
import useAuthedUserStore from "../store/client/useAuthedUserStore";


export default function CommentBox({parentUserId}: {parentUserId: string}) {
  const [text, setText] = useState("");
  const { data } = useCommentsQuery(parentUserId);
  const { mutateAsync: createComment, isPending } = useCreateComment();
  const { user, setAuthedUser } = useAuthedUserStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || isPending) return;
    await createComment({
      userId: parentUserId,
      comment: text.trim(),
    });
    
    setText("");
  };

  return (
        <div className="max-w-3xl mx-auto">
          {/* Comment Input */}
         {user?.userType !== 'Admin' &&   <form onSubmit={handleSubmit}>
              <label
                htmlFor="comment"
                className="block text-sm font-medium mb-2"
                style={{ color: "#718096" }}
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
                  color: "#1a202c",
                }}
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-60"
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "#3b82f6")
                  }
                >
                  {isPending ? "ᲘᲒᲖᲐᲕᲜᲔᲑᲐ..." : "ᲓᲐᲛᲐᲢᲔᲑᲐ"}
                </button>
              </div>
            </form>
}
          {/* Comments Section */}
          <div>
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#1a202c" }}
            >
              ყველა კომენტარი
            </h2>

            {data?.comments?.length === 0 ? (
              <div
                className="text-center py-12 flex flex-col items-center"
                style={{ color: "#718096" }}
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
                {data?.comments?.map((c: CommentModel) => (
                  <div
                    key={c.id}
                    className="comment-card p-4 rounded-lg shadow-sm border-l-4 transition-all"
                    style={{
                      backgroundColor: "#ffffff",
                      borderLeftColor: "#3b82f6",
                    }}
                  >
                    <p
                      className="comment-text mb-2"
                      style={{ color: "#1a202c" }}
                    >
                      {c.comment}
                    </p>
                    <p
                      className="comment-time text-sm"
                      style={{ color: "#718096" }}
                    >
                      {new Date(c.timeStamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </div>
    </div>
  );
}
