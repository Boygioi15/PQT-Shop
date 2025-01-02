import { useEffect, useState } from "react";
import NewComment from "./NewComment";
import { createComment, getListCommentBySpuId } from "../../../config/api";
import { useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import Pagination from "../../Pagiantion";

const ITEMS_PER_PAGE = 7;

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const userId = useSelector((state) => state.account?.user?._id);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleSendNewComment = async (comment) => {
    const newComment = await createComment({
      productId,
      userId,
      content: comment,
    });
    if (newComment && newComment.metadata) {
      await handleGetListComment();
    } else {
      throw new Error("Không thể tạo bình luận");
    }
  };

  const handleGetListComment = async () => {
    const response = await getListCommentBySpuId({
      productId,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    });
    if (response.status === 200) {
      setComments(response.metadata.comments);
      setTotalPages(response.metadata.pagination.totalPages);
    }
  };

  useEffect(() => {
    handleGetListComment();
  }, []);

  useEffect(() => {
    handleGetListComment();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-10">
      <div>
        <NewComment
          onSend={handleSendNewComment}
          spuId={productId}
          handleGetListComment={handleGetListComment}
        />
      </div>

      <div className="flex flex-col gap-4">
        {comments.length > 0 &&
          comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
