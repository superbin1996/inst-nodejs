import { useState, useEffect } from "react";
import { BsThreeDots } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { VscCircleSmallFilled } from "react-icons/vsc";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import moment from "moment";

const Post = ({ post, lastPostElementRef }) => {
  const navigate = useNavigate();
  const {
    // showProfile,
    toggleOptionModal,
    changeImagePath,
    authFetch,
    // customAxios,
    user,
  } = useAppContext();

  const [userComments, setUserComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isLike, setIsLike] = useState(false);
  const [likeSum, setLikeSum] = useState(0);

  const getLikeCondition = async () => {
    const url = `getLike/${post._id}/`;
    try {
      const { data } = await authFetch(url);
      const { isLike, likeSum } = data;
      // console.log(isLike);
      setIsLike(isLike);
      setLikeSum(likeSum);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleIsLike = async () => {
    if (user) {
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
    }
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const submitComment = async (e) => {
    e.preventDefault();

    const url = `comments/`;
    try {
      // Don't destructure data to get `comment` because `comment` is also state
      const { data } = await authFetch.post(url, {
        post: post._id,
        content: comment,
      });
      // if (!data.comment) {
        console.log(data);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      getUserComments(post._id);
      setComment("");
    }
  };

  const navigateProfile = (username) => {
    // showProfile(userId)
    // getProfilePosts(userId)
    // showProfile(userId)
    navigate(`/${username}`);
  };

  const showPostModal = () => {
    // togglePostModal(post._id)
    navigate(`p/${post._id}/`);
    // window.history.replaceState(null, "Instagram", `/p/${post._id}`)
  };

  const getUserComments = async (postId) => {
    if (user) {
      // const url = `/data/userComments.json`
      const url = `comments/userComments/${postId}/`;
      const {
        data: { comments },
      } = await authFetch(url);
      // console.log(`usersComments:`, comments);
      setUserComments(comments);
    }
  };

  let date = moment(post.updatedAt);
  date = date.startOf("day").fromNow();

  useEffect(() => {
    getUserComments(post._id);
    // document.body.style.overflowY = 'auto'
    getLikeCondition();
    // dont't add isLike to dependencies
    // eslint-disable-next-line
  }, [navigate]);

  return (
    <article className="post-cover" ref={lastPostElementRef}>
      <div>
        {/* Post info */}
        <div className="post-info-cover">
          {/* Post's owner */}
          <div className="post-info">
            <img
              className="icon-user-1 icon"
              src={changeImagePath(post.user.avatar)}
              alt="haku"
              onClick={() => navigateProfile(post.user.username)}
            />
            <div
              style={{ fontWeight: "500" }}
              onClick={() => navigateProfile(post.user.username)}
            >
              {post.user.username}
            </div>
          </div>
          <BsThreeDots
            className="post-option"
            onClick={() => toggleOptionModal(post)}
          />
        </div>

        {/* Post picture */}
        <div className="post-picture">
          <img
            src={changeImagePath(post.image)}
            alt={"img"}
            onDoubleClick={toggleIsLike}
          />
          <div className="post-picture-number">
            <VscCircleSmallFilled style={{ transform: "scale(1.5)" }} />
          </div>
        </div>

        {/* Post interactive option */}
        <div className="post-interact">
          <div className="post-interact-icon-list">
            <AiOutlineHeart
              className="post-interact-icon icon"
              style={{ color: isLike ? "red" : "" }}
              onClick={toggleIsLike}
            />
            <FaRegComment
              className="post-interact-icon icon"
              onClick={showPostModal}
            />
            <FiSend className="post-interact-icon icon" />
          </div>
          <BsBookmark className="post-interact-icon icon" />
        </div>

        {/* Post interactive info */}
        <div className="post-interact-info">
          <div className="post-interact-caption">
            {post.user.username}{" "}
            <span className="post-interact-caption-content">{post.status}</span>
          </div>

          <div className="post-date" onClick={showPostModal}>
            View all comments
          </div>

          <div>
            {userComments.map((comment) => {
              return (
                <div
                  className="post-interact-caption"
                  key={comment._id}
                  onClick={() =>
                    navigateProfile(
                      userComments.user.username,
                      userComments.user._id
                    )
                  }
                >
                  {comment.user.username}{" "}
                  <span className="post-interact-caption-content">
                    {comment.content}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="post-interact-like-sum">
            {likeSum > 0 && (likeSum > 1 ? `${likeSum} likes` : `1 like`)}
          </div>

          <div className="post-date">{date}</div>
        </div>

        {/* Post comment */}
        <div className="post-comment-cover">
          <div className="post-comment-icon">
            <HiOutlineEmojiHappy className="HiOutlineEmojiHappy" />
            <input
              disabled={user ? false : true}
              placeholder="Add comment..."
              value={comment}
              onChange={handleChange}
            />
          </div>

          <div className="post-comment-post" onClick={submitComment}>
            Post
          </div>
        </div>
      </div>
    </article>
  );
};
export default Post;
