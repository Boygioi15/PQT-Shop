import React, { useEffect, useState } from "react";
import { Star, ThumbsUp, Reply, ChevronDown } from "lucide-react";
import {
  createComment,
  getListCommentBySpuId,
  toggleLikeComment,
} from "../../../config/api";
import { formatDistance } from "date-fns";
import { useSelector } from "react-redux";
const CommentItem = ({ comment, depth = 0 }) => {
  console.log("🚀 ~ CommentItem ~ depth:", depth);
  const userId = useSelector((state) => state.account?.user?._id);

  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [isLiked, setIsLiked] = useState(
    comment?.comment_user_likes?.includes(userId)
  );
  const [likeCount, setLikeCount] = useState(comment.comment_likes || 0);
  const [haveReplyComment, setHaveReplyComment] = useState(
    comment?.comment_right - comment?.comment_left > 1
  );

  const handleReplySubmit = async () => {
    if (replyText.trim()) {
      const newReply = await createComment({
        productId: comment.comment_productId,
        parentCommentId: comment._id,
        userId: userId,
        content: replyText.trim(),
      });

      await handleGetListComment();
      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);
      setHaveReplyComment(true);
    }
  };

  const handleGetListComment = async () => {
    setShowReplies(!showReplies);
    const response = await getListCommentBySpuId({
      productId: comment.comment_productId,
      parentCommentId: comment._id,
    });
    console.log("🚀 ~ handleGetListComment ~ response:", response);

    if (response.status === 200) {
      setReplies(response.metadata);
    }
  };

  const handleLikeComment = async () => {
    try {
      const response = await toggleLikeComment(comment._id);

      if (response.status === 200) {
        setIsLiked(response.metadata.liked);
        setLikeCount(response.metadata.likeCount);
      }
    } catch (error) {
      console.error("Lỗi like comment:", error);
    }
  };

  const indentClasses = [
    "ml-8 mt-3",
    "ml-16 mt-3",
    "ml-24 mt-3",
    "ml-32 mt-3",
    "ml-40 mt-3",
  ];
  const indentClass =
    depth > 0 && depth < indentClasses.length ? indentClasses[depth] : "";

  return (
    <div className={`flex flex-col ${indentClass}`}>
      <div className="flex items-start">
        <img
          src={comment?.comment_userId?.usr_avatar}
          className="w-12 h-12 rounded-full border-2 border-white"
          alt="Reviewer"
        />
        <div className="ml-3 w-full">
          <h4 className="text-sm font-bold text-gray-800">
            {comment?.comment_userId?.usr_name}
          </h4>
          <div className="flex space-x-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 3 ? "text-blue-600" : "text-[#CED5D8]"
                }`}
                fill={i < 3 ? "currentColor" : "none"}
              />
            ))}
            <p className="text-xs !ml-2 font-semibold text-gray-800">
              {formatDistance(new Date(comment.createdAt), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>
          <p className="text-pretty mt-2 text-gray-800">
            {comment?.comment_content}
          </p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleLikeComment}
              className={`flex flex-row justify-center items-center gap-2 px-2 py-1 text-sm 
        ${
          isLiked
            ? "text-blue-600 border-blue-600"
            : "text-gray-600 hover:text-blue-600 border-[#d1d5db]"
        } 
        border-2 rounded-full`}
            >
              <ThumbsUp
                className={`w-4 h-4 
          ${isLiked ? "fill-blue-600" : ""}
        `}
              />
              {likeCount}
            </button>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex flex-row justify-center items-center gap-2 px-2 py-1 text-sm text-gray-600 hover:text-blue-600 border-2 rounded-full border-[#d1d5db]"
            >
              <Reply className="w-4 h-4" />
              Trả lời
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-4 border-t pt-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                className="w-full p-2 border rounded-md min-h-[100px] text-sm"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-sm text-gray-600 border rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md"
                >
                  Gửi
                </button>
              </div>
            </div>
          )}

          {haveReplyComment && (
            <button
              onClick={() => handleGetListComment()}
              className="flex items-center text-sm text-blue-600 mt-2 hover:underline"
            >
              <ChevronDown
                className={`mr-1 transform ${showReplies ? "rotate-180" : ""}`}
                size={16}
              />
              {showReplies ? "Ẩn" : "Xem"} phản hồi
            </button>
          )}
        </div>
      </div>

      {showReplies &&
        replies.map((reply, index) => (
          <CommentItem key={index} comment={reply} depth={depth + 1} />
        ))}
    </div>
  );
};

export default CommentItem;
