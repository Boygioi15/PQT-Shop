import React, { useEffect, useState } from "react";
import {
  checkExistCommentofPurchaser,
  checkPurchase,
  createComment,
} from "../../../config/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const NewComment = ({ spuId, handleGetListComment }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const maxLength = 500;

  const [hasPurchased, setHasPurchased] = useState(false);
  const [isCommented, setIsCommented] = useState(false);

  const handleCheckPurchase = async () => {
    const response = await checkPurchase({ userId, spuId });
    setHasPurchased(response.metadata);
  };

  const checkIsCommentedByPurchaser = async () => {
    const response = await checkExistCommentofPurchaser({
      userId,
      productId: spuId,
    });
    setIsCommented(response.metadata);
  };
  const userId = useSelector((state) => state.account?.user?._id);

  const handleRatingChange = (score) => {
    if (!hasPurchased) {
      setShowAlert(true);
      return;
    }
    setRating(score);
  };

  const handleCommentChange = (e) => {
    const input = e.target.value;
    if (input.length <= maxLength) {
      setComment(input);
      setCharacterCount(input.length);
    }
  };

  const handleMouseEnter = async (score) => {
    if (!hasPurchased) return;
    setHoverRating(score);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert("Vui lòng chia sẻ đánh giá của bạn về sản phẩm.");
      return;
    }

    const newComment = await createComment({
      productId: spuId,
      rating: rating || 0,
      userId,
      content: comment,
    });

    if (newComment && newComment.metadata) {
      await handleGetListComment();
      toast.success("Gửi đánh giá thành công");
    } else {
      toast.error("Lỗi không thể gửi bình luận lúc này ");
    }

    // Reset form
    setRating(0);
    setComment("");
    setCharacterCount(0);
  };

  useEffect(() => {
    handleCheckPurchase();
    checkIsCommentedByPurchaser();
  }, [rating]);

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg space-y-6">
      <div className="flex flex-col space-y-4">
        {hasPurchased && !isCommented && (
          <div className="flex items-center flex-wrap">
            <p className="text-lg font-semibold text-gray-800 mr-4">
              Đánh giá của bạn:
            </p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-8 h-8 ${
                    hasPurchased ? "cursor-pointer" : "cursor-not-allowed"
                  } 
                    transform hover:scale-110 transition-all duration-300 
                    ${
                      rating >= star || hoverRating >= star
                        ? "fill-yellow-400 drop-shadow-md"
                        : "fill-gray-300"
                    }`}
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => handleMouseEnter(star)}
                  onMouseLeave={handleMouseLeave}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927C9.366 2.017 10.634 2.017 10.951 2.927l1.696 3.432 3.79.553c.669.097.935.92.451 1.391l-2.737 2.664.645 3.766c.116.677-.598 1.213-1.219.891l-3.389-1.781-3.388 1.781c-.62.322-1.335-.214-1.219-.891l.645-3.766-2.737-2.664c-.484-.471-.218-1.294.451-1.391l3.79-.553 1.696-3.432z" />
                </svg>
              ))}
            </div>
          </div>
        )}

        {
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="text-lg font-semibold text-gray-800"
            >
              Chia sẻ đánh giá của bạn:
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={handleCommentChange}
              placeholder={"Hãy chia sẻ trải nghiệm của bạn về sản phẩm..."}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none transition-colors duration-200`}
            />
            <div className="flex justify-end text-sm text-gray-500">
              {characterCount}/{maxLength} ký tự
            </div>
          </div>
        }
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className={`px-8 py-3 text-lg font-semibold rounded-full shadow-md
              transform hover:-translate-y-0.5 transition-all duration-300 
              focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg focus:ring-blue-500 cursor-pointer
             `}
          disabled={!hasPurchased}
        >
          Gửi đánh giá
        </button>
      </div>
    </div>
  );
};

export default NewComment;
