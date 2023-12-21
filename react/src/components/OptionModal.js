import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appContext'



const OptionModal = () => {
  const {
    toggleOptionModal,
    post,
    user,
    toggleEditModal,
    deletePost,
    hideOptionModal,
    // profileUser,
    togglePostModal,
  } = useAppContext()
  const navigate = useNavigate()

  const postDelete = () => {
    togglePostModal('', true)
    // if (Object.keys(profileUser).length === 0) {
    //   navigate('/')
    // }
    // else {
    //   navigate(`/${profileUser.username}`)
    // }
    navigate(-1)
    deletePost(post._id)
    // window.location.reload()
  }

  function selfPostOption(userId) {
    // user._id is string, so change it to integer
    if (String(userId) === String(user._id)) {
      return true
    }
    else {
      return false
    }
  }

  function goToPost() {
    navigate(`/p/${post._id}`)
    toggleOptionModal(post)  
  }

  return (
    <div className="modal" onClick={hideOptionModal}>
      <div className='option-content' onClick={e => e.stopPropagation()}>
        {selfPostOption(post.user._id) ?
          // Self post
          <div>
            <div className="option-content-item" style={{ color: 'red' }} onClick={postDelete}>
              Delete
            </div>

            <div className="option-content-item" style={{ color: 'red' }} onClick={toggleEditModal} >
              Edit
            </div>

            <div className="option-content-item">Hide like count</div>
            <div className="option-content-item">Turn off commenting</div>

          </div>
          :
          // Others post
          <div>
            <div className="option-content-item">
              Report
            </div>

            <div className="option-content-item" style={{ color: 'red' }}>
              {true ? `Following` : `Follow`}
            </div>
          </div>
        }

        <div className="option-content-item" onClick={goToPost}>Go to post</div>
        <div className="option-content-item">Share to...</div>
        <div className="option-content-item">Copy Link</div>
        <div className="option-content-item">Embed</div>

        <div className="option-content-item" style={{ border: 'none', color: 'red' }} onClick={hideOptionModal}>
          Cancel
        </div>

      </div>

    </div>
  )
}

export default OptionModal