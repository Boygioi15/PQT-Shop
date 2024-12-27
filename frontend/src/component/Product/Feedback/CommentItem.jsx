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
  console.log("🚀 ~ CommentItem ~ comment:", comment);
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

  const indentClass = depth > 0 ? `ml-${Math.min(depth * 8, 40)} mt-4` : "";

  return (
    <div className={`group flex flex-col ${indentClass} animate-fadeIn`}>
      <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
        <img
          src={comment?.comment_userId?.usr_avatar}
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
          alt={comment?.comment_userId?.usr_name}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {comment?.isFromSystem
                ? "Từ hệ thống"
                : comment?.comment_userId?.usr_name}
            </h4>
            <span className="text-xs text-gray-500">•</span>
            <p className="text-xs text-gray-500">
              {formatDistance(new Date(comment.createdAt), new Date(), {
                addSuffix: true,
              })}
            </p>
          </div>

          {comment.comment_rating > 0 && (
            <div className="flex space-x-0.5 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < comment.comment_rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill={i < comment.comment_rating ? "currentColor" : "none"}
                />
              ))}
            </div>
          )}

          <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
            {comment?.comment_content}
          </p>

          <div className="flex items-center space-x-3 mt-3">
            <button
              onClick={handleLikeComment}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${
                  isLiked
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
            >
              <ThumbsUp
                className={`w-4 h-4 mr-1.5 ${isLiked ? "fill-blue-600" : ""}`}
              />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <Reply className="w-4 h-4 mr-1.5" />
              <span>Trả lời</span>
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-4 space-y-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                className="w-full p-3 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReplySubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Gửi
                </button>
              </div>
            </div>
          )}

          {haveReplyComment && (
            <button
              onClick={handleGetListComment}
              className="inline-flex items-center mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <ChevronDown
                className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                  showReplies ? "rotate-180" : ""
                }`}
              />
              {showReplies ? "Ẩn" : "Xem"} phản hồi
            </button>
          )}
        </div>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="space-y-4 mt-2">
          {replies.map((reply, index) => (
            <CommentItem key={index} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
