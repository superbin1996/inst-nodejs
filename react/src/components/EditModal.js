import React, {useState} from 'react'
import {HiOutlineEmojiHappy} from 'react-icons/hi';
// import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const EditModal = () => {
  const {
    toggleEditModal,
    editPost,
    user,
    changeImagePath,
    post,
    // caption,
    // setCaption,
    // showPostModal,
  } = useAppContext()

  // const navigate = useNavigate()

  // const [caption, setCaption] = useState(post.status)

  
  // Count text length in textarea
  const [eCaptionLength, setECaptionLength] = useState(0)

  // caption content
  const [eCaption, setECaption] = useState(post.status)


  function inputECaption(e) {
    setECaption(e.target.value)
    setECaptionLength(e.target.value.length)
  }

  function submitEdit() {
    const formData = new FormData()
    formData.append('status', eCaption)
    // formData.append('image', uploadImage)
    formData.append('postId', post._id)

    editPost(formData)
    console.log(formData);
    // setCaption(eCaption)
    toggleEditModal()
  }

  const hideEditModal = () => {
    toggleEditModal()
  }
  
  // useEffect(()=>{
  //   setECaption(caption)
  //   // console.log(`eCaption:`, caption)
  // }, []) 
  
  if (!post) {
    return (
      <div className="modal" onClick={hideEditModal}>
        <div className="close" onClick={hideEditModal}>
          &times;
        </div>
        {/* Modal content */}
        <div className='modal-content-full-1' style={{justifyContent: 'center', alignItems: 'center'}} onClick={e => e.stopPropagation()}>
          <h2>No jobs to display...</h2>
        </div>
      </div>
    )
  }
  
  return  (
    <div>
      {/* The Modal */}
      <div className="modal" style={{zIndex:'51'}} onClick={hideEditModal}>

        <div className="close" 
          onClick={hideEditModal}
        >&times;</div>

        {/* Modal content */}
        <div className='modal-content-full' onClick={e=>e.stopPropagation()}>

          {/* Preview header */}
          <div className='modal-intro-preview' style={{height:'37px'}}>
            <div className='modal-intro-preview-item-3' onClick={toggleEditModal} style={{color:'gray',paddingLeft:'0.5rem'}}>
              Cancel
            </div> 
            <div className='modal-intro-preview-item-2'>Edit Info</div>
            <div className='modal-intro-preview-item-3' onClick={submitEdit}>Done</div>
          </div>

          {/* Image and Caption */}
          <div className='modal-upload-column'>
            <div className='modal-preview'>

              {/* Image */}
              <div className='modal-preview-image'>
                <div className='modal-file'>
                  <img src={changeImagePath(post.image)} alt={'image'} style={{borderRadius:'0px'}} />
                </div>
              </div>

              {/* Caption input */}
              <div className='modal-upload-caption'>
                <div className='post-info'>
                  <img className='icon-user-1 icon' src={changeImagePath(user.avatar)} alt={'avatar'} />
                  <p>{user.username}</p>
                </div>
                <textarea name="" id="" cols="30" rows="13" placeholder='Write a caption...' autoFocus value={eCaption} onChange={inputECaption} />
                <div className='modal-upload-emoji-cover'>
                  <HiOutlineEmojiHappy className='modal-upload-emoji'/>
                  <div className='textarea-length'>{eCaptionLength}/2,200</div>
                </div>
              </div>
              
            </div>
            
          </div>

        </div>
      </div>

    </div>
  );
}

export default EditModal