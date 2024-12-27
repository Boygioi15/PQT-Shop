import React, { useEffect, useState } from "react";
import {
  createComment,
  getCommentWithRating,
  getListCommentBySpuId,
} from "../../../config/api";
import NoAvatar from "../../NoAvatar";
import { formatDistance } from "date-fns";
import { useSelector } from "react-redux";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const ProductComments = ({ productId }) => {
  const [replyInput, setReplyInput] = useState(null);
  const [currentReply, setCurrentReply] = useState("");
  const [comments, setComments] = useState([]);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái "Đang gửi"
  const ITEMS_PER_PAGE = 5;
  const userId = useSelector((state) => state.account?.user?._id);

  useEffect(() => {
    handleGetComments();
  }, [productId]);

  const handleGetComments = async () => {
    const response = await getCommentWithRating({ productId });
    if (response && response.status === 200) {
      const enrichedComments = await Promise.all(
        response.metadata.map(async (comment) => {
          const replyResponse = await getListCommentBySpuId({
            productId,
            parentCommentId: comment._id,
          });

          return {
            ...comment,
            replies: replyResponse.status === 200 ? replyResponse.metadata : [],
          };
        })
      );
      setComments(enrichedComments);
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    if (currentReply.trim()) {
      setIsSubmitting(true); // Bắt đầu gửi
      try {
        const response = await createComment({
          userId,
          productId,
          parentCommentId,
          content: currentReply.trim(),
        });

        if (response && response.status === 200) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === parentCommentId
                ? {
                    ...comment,
                    replies: [
                      ...(comment.replies || []),
                      {
                        _id: response.metadata._id,
                        comment_content: currentReply,
                        comment_userId: {
                          usr_name: "Từ hệ thống",
                        },
                        createdAt: new Date().toISOString(),
                      },
                    ],
                  }
                : comment
            )
          );
          setCurrentReply("");
          setReplyInput(null);
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
      } finally {
        setIsSubmitting(false); // Hoàn tất gửi
      }
    }
  };

  const handleReplyClick = (id) => {
    setReplyInput(id);
    setCurrentReply("");
  };

  const toggleRepliesVisibility = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const paginatedComments = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return comments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full ml-6 min-h-[500px] bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Đánh giá
      </h2>
      <div className="space-y-6">
        {paginatedComments().map((comment) => (
          <div
            key={comment._id}
            className="p-6 border rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  {comment.comment_userId?.usr_avatar ? (
                    <img
                      src={comment.comment_userId.usr_avatar}
                      alt="avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <NoAvatar />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {comment.isFromSystem
                      ? "Từ hệ thống"
                      : comment.comment_userId?.usr_name || "Ẩn danh"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatDistance(new Date(comment.createdAt), new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="text-yellow-500 text-base">
                {"⭐".repeat(comment.rating)}
              </div>
            </div>
            <p className="mt-4 text-gray-800 text-base">
              {comment.comment_content}
            </p>

            {/* Toggle Replies Button */}
            {comment.replies?.length > 0 && (
              <div className="mt-6">
                <button
                  className="text-blue-500 hover:underline text-base"
                  onClick={() => toggleRepliesVisibility(comment._id)}
                >
                  {visibleReplies[comment._id]
                    ? "Ẩn phản hồi"
                    : "Hiện phản hồi"}
                </button>
              </div>
            )}

            {/* Replies */}
            {visibleReplies[comment._id] &&
              comment.replies?.map((reply) => (
                <div
                  key={reply._id}
                  className="ml-12 mt-6 p-4 border-l-4 border-gray-200 text-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <NoAvatar />
                    <div>
                      <p className="text-base font-semibold">
                        {reply.isFromSystem
                          ? "Từ hệ thống"
                          : reply.comment_userId?.usr_name || "Ẩn danh"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDistance(new Date(reply.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-base">{reply.comment_content}</p>
                </div>
              ))}

            {/* Reply Input */}
            {replyInput === comment._id ? (
              <div className="mt-6">
                <textarea
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                  value={currentReply}
                  onChange={(e) => setCurrentReply(e.target.value)}
                  placeholder="Trả lời đánh giá của người dùng"
                  disabled={isSubmitting}
                ></textarea>
                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setReplyInput(null)}
                    disabled={isSubmitting}
                  >
                    Trở lại
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-white ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => handleReplySubmit(comment._id)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang gửi..." : "Lưu"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end mt-6">
                <button
                  className="text-blue-500 hover:underline text-base"
                  onClick={() => handleReplyClick(comment._id)}
                >
                  Phản hồi
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Phân Trang */}
        <ul className="flex space-x-5 justify-center mt-6">
          <li
            className={`flex items-center justify-center bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          >
            <AiOutlineLeft className="text-gray-500" />
          </li>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <li
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center justify-center w-9 h-9 rounded-md cursor-pointer ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-800 hover:bg-gray-200"
                }`}
              >
                {page}
              </li>
            )
          )}

          <li
            className={`flex items-center justify-center bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
          >
            <AiOutlineRight className="text-gray-500" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductComments;
