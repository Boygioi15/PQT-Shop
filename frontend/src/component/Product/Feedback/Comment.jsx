import CommentItem from "./CommentItem";
import CommentReply from "./CommentReply";

const Comment = ({ commentIndex, replyIndex }) => {
  return (
    <div>
      <div>
        <CommentItem />
      </div>
    </div>
  );
};

export default Comment;
