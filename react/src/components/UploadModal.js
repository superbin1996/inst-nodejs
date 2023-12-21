import React, { useState } from 'react';
import { AiOutlinePicture } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { HiOutlineEmojiHappy } from 'react-icons/hi';
// import { useLocation } from 'react-router-dom';
// import Wrapper from '../assets/wrappers/UploadModal';
import { useAppContext } from '../context/appContext';
import {defaultImg} from '../assets/images/index'

export default function UploadModal() {
  const {
    user,
    toggleUploadModal,
    changeImagePath,
    addPost,
  } = useAppContext()

  // const location = useLocation

  // After choosing picture
  const [preview, setPreview] = useState(false)
  // image input file
  const [uploadImage, setUploadImage] = useState(null)
  // preview image
  const [previewImage, setPreviewImage] = useState(null)
  // Image scale
  const [imgScale, setImgScale] = useState(1)
  // preview image and add status
  const [addStatus, setAddStatus] = useState(false)
  // Count text length in textarea
  const [statusLength, setStatusLength] = useState(0)
  // status content
  const [status, setStatus] = useState('')

  function onChangePicture(e) {
    e.preventDefault()

    if (e.target.files[0]) {
      setPreview(true)
      setUploadImage(e.target.files[0])

      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.addEventListener('load', () => {
        setPreviewImage(reader.result)
      })
    }
  }

  function skipChoosingPicture() {

    // If using Route, delete first '.' in url
    setPreviewImage(defaultImg)
    setPreview(true)
  }

  function uploadBack() {
    if (addStatus) {
      setAddStatus(false)
    }
    else {
      setPreview(false)
      setStatus('')
    }
  }

  function uploadNext() {
    if (addStatus) {
      uploadPost()
    }
    else {
      setAddStatus(true)
    }
  }

  const changeImageSize = ({ target: img }) => {
    const { offsetHeight, offsetWidth } = img;
    // console.log(offsetWidth, offsetHeight);
    if (offsetHeight < 500) {
      setImgScale(500 / offsetHeight)

    }
  }

  const uploadPost = async () => {
    const formData = new FormData()
    try {
      formData.append('status', status)
      // formData.append('iamge_url', '')
      if (uploadImage) {
        formData.append('image', uploadImage)
      }
    }
    finally {
      addPost(formData)
    }
    
  }

  function inputCaption(e) {
    setStatus(e.target.value)
    setStatusLength(e.target.value.length)
  }

  return (
    // <Wrapper>
    <div>
      {/* The Modal */}
      <div className="modal" onClick={toggleUploadModal}>

        <div className="close"
          onClick={toggleUploadModal}
        >&times;</div>

        {/* Modal content */}
        <div className={addStatus ? 'modal-content-full' : 'modal-content'} onClick={e => e.stopPropagation()}>

          {/* Preview header */}
          {preview ?
            // preview header after choosing picture
            <div className='modal-intro-preview'>
              <BiArrowBack className='modal-intro-preview-item-1' onClick={uploadBack} />
              <div className='modal-intro-preview-item-2'>Crop</div>
              <div className='modal-intro-preview-item-3' onClick={uploadNext}>{addStatus ? 'Share' : 'Next'}</div>
            </div>
            :
            // preview header before choosing picture
            <div className="modal-intro">Create new status here</div>
          }

          {/* Image and Caption */}
          <div className='modal-upload-column'>
            {preview ?
              // After choosing picture
              <div className='modal-preview'>

                <div className='modal-preview-image' style={addStatus?{flex: '0 1 62%'}:{}}>
                  <div className='modal-file'>
                    <img src={previewImage} alt={previewImage} onLoad={changeImageSize} style={{ transform: `scale(${imgScale})` }} />
                  </div>
                </div>

                {/* Caption input */}
                {addStatus &&
                <div className='modal-preview-status'>
                  <div className='post-info' style={{ marginLeft: '-5px' }}>
                    <img className='icon-user-1 icon' src={changeImagePath(user.avatar)} alt={user.avatar} />
                    <p>{user.username}</p>
                  </div>
                  <textarea name="" id="" cols="30" rows="13" placeholder='Write a status...' autoFocus value={status} onChange={inputCaption} />
                  <div className='modal-upload-emoji-cover'>
                    <HiOutlineEmojiHappy className='modal-upload-emoji' />
                    <div className='textarea-length'>{statusLength}/2,200</div>
                  </div>
                </div>
                }

              </div>
              :
              // Choosing image file
              <div className='modal-file'>
                <div><AiOutlinePicture className="AiOutlinePicture" /></div>
                <h3>Drag picture here</h3>
                <form>
                  <input type="file" className='modal-upload-input' onChange={onChangePicture} />
                </form>
                <div>
                  <button className='btn-skip' onClick={skipChoosingPicture}>Skip</button>
                </div>
              </div>
            }
          </div>

        </div>
      </div>

    </div>
    // </Wrapper>
  );
}
