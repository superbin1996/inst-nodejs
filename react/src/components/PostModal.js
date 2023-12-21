import { useEffect, useState } from "react";
import { BsBookmark, BsThreeDots } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { useAppContext } from "../context/appContext";
import { useNavigate, useParams } from "react-router-dom";
import { Loading, OptionModal } from "./index";
import moment from "moment";

const PostModal = () => {
  const {
    isLoading,
    post,
    // posts,
    user,
    postComments,
    togglePostModal,
    toggleOptionModal,
    getPostComments,
    changeImagePath,
    // Follow
    isFollow,
    toggleFollowCondition,
    authFetch,
    // customAxios,
    // Toggle modal
    showOptionModal,
    posts,
    profilePosts,
  } = useAppContext();

  const navigate = useNavigate();
  const params = useParams();
  const [comment, setComment] = useState("");
  const [isLike, setIsLike] = useState(false);
  const [likeSum, setLikeSum] = useState(0);

  let date = moment(post.timestamp);
  date = date.startOf("day").fromNow();

  const hidePostModal = () => {
    if (profilePosts.length !== 0 || posts.length !== 0) {
      togglePostModal("", true);
      navigate(-1);
      document.body.style.overflowY = "auto";
    }
    // window.history.back()
    // console.log('navigate back');

    // window.history.replaceState(null, "Instagram", "/")
  };

  const getLikeCondition = async () => {
    const url = `getLike/${params.postId}/`;
    try {
      const { data } = await authFetch(url);
      const { isLike, likeSum } = data;
      setIsLike(isLike);
      setLikeSum(likeSum);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleIsLike = async () => {
    const url = `like/`;
    try {
      const { data } = await authFetch.patch(url, {
        post: post._id,
        isLike: !isLike,
      });
      setLikeSum(data.likeSum);
      setIsLike(data.isLike);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const submitComment = async () => {
    const url = `comments/`;
    try {
      const { data } = await authFetch.post(url, {
        post: post._id,
        content: comment,
      });
      if (data.status === false) {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      getPostComments(params.postId);
      setComment("");
    }
  };

  const checkUser = () => {
    if (user) {
      if (String(user.username) === String(post.user.username)) {
        return true;
      } else {
        return false;
      }
    }
  };

  useEffect(() => {
    // document.body.style.overflowY = 'hidden'
    const { postId } = params;
    togglePostModal(postId);
    getPostComments(postId);
    // console.log(params);
    getLikeCondition();

    // Disable warning about useEffect dependences
    // eslint-disable-next-line
  }, [params]);

  if (isLoading) {
    <Loading center />;
  }

  if (Object.keys(post).length === 0) {
    return (
      <div className="modal" onClick={hidePostModal}>
        <div className="close" onClick={hidePostModal}>
          &times;
        </div>
        {/* Modal content */}
        <div
          className="modal-content-full-1"
          style={{ justifyContent: "center", alignItems: "center" }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>No jobs to display...</h2>
        </div>
      </div>
    );
  }

  return (
    // The Modal
    <div className="modal" onClick={hidePostModal}>
      <div onClick={(e) => e.stopPropagation()}>
        {showOptionModal && <OptionModal />}
      </div>
      <div className="close" onClick={hidePostModal}>
        &times;
      </div>
      {/* Modal content */}
      <div
        className="modal-content-full-1"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image and Caption */}
        <div className="modal-preview-1">
          {/* Image */}
          <div className="modal-image">
            <div className="modal-file-1">
              <img
                src={changeImagePath(post.image)}
                alt={"img"}
                onDoubleClick={toggleIsLike}
              />
            </div>
          </div>

          {/* Owner info */}
          <div className="modal-caption-cover">
            {/* Post owner info */}
            <div className="post-info-1">
              <img
                className="icon-user-1 icon"
                style={{ minWidth: "52px" }}
                src={changeImagePath(post.user.avatar)}
                alt={"avatar"}
                onClick={() => navigate(`/${post.user.username}`)}
              />

              {/* Follow Btn */}
              <div className="username-and-caption">
                <span onClick={() => navigate(`/${post.user.username}`)}>
                  {post.user.username}
                </span>{" "}
                {checkUser() || (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleFollowCondition(post.user.username)}
                  >
                    ・ {isFollow ? "Following" : "Follow"}
                  </span>
                )}
              </div>

              <BsThreeDots
                className="post-option"
                style={{ marginRight: "8px" }}
                onClick={() => toggleOptionModal(post)}
              />
            </div>

            {/* Caption and comment */}
            <div className="modal-caption-1">
              {/* Caption */}
              {post.status && (
                <div className="post-info-1">
                  <div>
                    <img
                      className="icon-user-1 icon"
                      src={changeImagePath(post.user.avatar)}
                      alt={"avatar"}
                      onClick={() => navigate(`/${post.user.username}`)}
                    />
                  </div>

                  <div className="username-and-caption">
                    <span onClick={() => navigate(`/${post.user.username}`)}>
                      {post.user.username}
                    </span>{" "}
                    <span style={{ fontWeight: "400" }}>{post.status}</span>
                    {/* ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss */}
                  </div>
                </div>
              )}

              {/* user comments */}
              {postComments
                .filter(
                  (comment) => String(comment.user._id) === String(user._id)
                )
                .map((comment) => {
                  return (
                    <div className="post-info-1" key={comment._id}>
                      <div>
                        <img
                          className="icon-user-1 icon"
                          src={changeImagePath(user.avatar)}
                          alt={user.avatar}
                          onClick={() => navigate(`/${user.username}`)}
                        />
                      </div>

                      <div className="username-and-caption">
                        <span onClick={() => navigate(`/${user.username}`)}>
                          {user.username}
                        </span>{" "}
                        <span style={{ fontWeight: "400" }}>
                          {comment.content}
                        </span>
                      </div>
                    </div>
                  );
                })}

              {/* Other comments */}
              {postComments
                .filter(
                  (comment) => String(comment.user._id) !== String(user._id)
                )
                .map((comment) => {
                  return (
                    <div className="post-info-1" key={comment._id}>
                      <div>
                        <img
                          className="icon-user-1 icon"
                          src={changeImagePath(comment.user.avatar)}
                          alt={"avatar"}
                          onClick={() => navigate(`/${comment.user.username}`)}
                        />
                      </div>

                      <div className="username-and-caption">
                        <span
                          onClick={() => navigate(`/${comment.user.username}`)}
                        >
                          {comment.user.username}
                        </span>{" "}
                        <span style={{ fontWeight: "400" }}>
                          {comment.content}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Like, comment, share, bookmark */}
            <div className="post-interact-container">
              <div
                className="post-interact"
                style={{
                  borderTop: "1px solid rgba(var(--b6a, 219, 219, 219), 1)",
                }}
              >
                <div className="post-interact-icon-list">
                  <AiOutlineHeart
                    className="post-interact-icon icon"
                    style={{ color: isLike ? "red" : "" }}
                    onClick={toggleIsLike}
                  />
                  <FaRegComment className="post-interact-icon icon" />
                  <FiSend className="post-interact-icon icon" />
                </div>
                <BsBookmark className="post-interact-icon icon" />
              </div>
            </div>

            {/* Like sum */}
            <div className="post-interact-info">
              <div className="post-interact-like-sum">
                {likeSum > 0 && `${likeSum} like${likeSum > 1 ? "s" : ""}`}
              </div>

              <div className="post-date">{date}</div>
            </div>

            {/* Input comment */}
            <div className="modal-comment">
              {/* <HiOutlineEmojiHappy className='modal-upload-emoji'/>
                <input type="text" value={comment} onChange={e=>setComment(e.target.value)} /> */}
              <div className="post-comment-icon">
                <HiOutlineEmojiHappy className="HiOutlineEmojiHappy" />
                <input
                  disabled={user ? false : true}
                  placeholder="Add comment..."
                  name="comment"
                  value={comment}
                  onChange={handleCommentChange}
                />
              </div>

              <div className="post-comment-post" onClick={submitComment}>
                Post
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
