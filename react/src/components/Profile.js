import { useEffect, useRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { IoIosArrowUp } from 'react-icons/io'
import { Header, Loading, ProfileNoPost, UploadModal } from './index';
import { useAppContext } from '../context/appContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ahri, haku } from "../assets/images/index"

export default function Profile() {
  const {
    isLoading,
    profilePosts,
    totalProfilePosts,
    getProfilePosts,
    changeImagePath,
    isFollow,
    followers,
    following,
    profileUser,
    user,
    toggleFollowCondition,
    showUploadModal,
    loadMoreProfilePosts,
    numOfProfilePages,
    profilePage,
    updateAvatar,
  } = useAppContext()

  const params = useParams()
  // console.log(params);
  const navigate = useNavigate()

  const observer = useRef()
  // update last item ref for infinite scroll
  const lastPostElementRef = node => {
    if (observer.current) {
      observer.current.disconnect()
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && profilePage < numOfProfilePages) {
        loadMoreProfilePosts()
        // console.log('load more profile posts');
      }
    })

    if (node) {
      observer.current.observe(node)
    }
  }

  const checkUser = () => {
    // I will soon remove restriction for view image before login, so other can view images without login
    // console.log('not user');
    if (user) {
      // console.log('user logged in');
      if (profileUser.username === user.username) return true
      else return false
    }
  }

  const changeAvatar = (e) => {
    // e.preventDefault()
    const imageFile = e.target.files[0]
    console.log(imageFile)
    const formData = new FormData()
    // formData.append('avatar', imageFile)
    if (imageFile) {
      formData.append('avatar', imageFile)
    }
    updateAvatar(formData)
  }

  useEffect(() => {
    if (profilePosts.length === 0 || params.profileName !== profileUser.username)  {
      window.scrollTo({ top: 0 })
      // document.body.style.overflowY = 'hidden'
      getProfilePosts(params.profileName)
    }
  }, [params])

  if (isLoading) {
    return (
      <Loading center />
    )
  }

  if (profilePosts.length === 0) {
    return (
      <ProfileNoPost />
    )
  }

  return (
    <div className='profile-modal'>
      <Header />
      {showUploadModal && <UploadModal />}
      {/* {showOptionModal && <OptionModal/>} */}
      <div className={'profile-cover'}>
        <div className={'profile-bar-left'}></div>

        <div className={'profile-bar-center'}>

          <header className='profile-header'>

            <label className='profile-avatar' htmlFor='avatar'>
              <img src={changeImagePath(profileUser.avatar)} alt={"avatar"} />
              {checkUser() &&
                <input type="file" id='avatar' onChange={changeAvatar} />
              }
            </label>

            <div className='profile-username'>{profileUser.username}</div>
            <div className='profile-message'>Message</div>

            {checkUser() ||
              <div className='profile-follow' onClick={() => toggleFollowCondition(profileUser.username)}>
                {isFollow ? 'Following' : 'Follow'}
              </div>
            }

            <IoIosArrowUp className="profile-suggestion" />
            <BsThreeDots className="profile-option" />
            <div className='profile-posts'>{totalProfilePosts} Posts</div>
            <div className='profile-followers'>{followers} followers</div>
            <div className='profile-following'>{following} following</div>
            <textarea className='profile-info'
              disabled
              style={{ height: '100px' }}
              defaultValue={profileUser.info}
            />
          </header>


          <div className={'gallery-cover'}>
            {/* LeftSide */}
            <div></div>

            {/* Center */}
            <article className={'gallery'}>
              <div className='story-cover'>
                <img className='story-icon icon' src={ahri} alt="ahri" />
                <img className='story-icon icon' src={haku} alt="haku" />
              </div>

              <div className={'profile-images'}>

                {profilePosts.map((post, index) => {
                  if (profilePosts.length === index + 1) {
                    return (
                      <div key={post._id} className='profile-images-item'>
                        <img src={changeImagePath(post.image)} alt={'img'} onClick={() => { navigate(`/p/${post._id}`) }} ref={lastPostElementRef} />
                      </div>
                    )
                  }
                  return (
                    <div key={post._id} className='profile-images-item'>
                      <img src={changeImagePath(post.image)} alt={'img'} onClick={() => { navigate(`/p/${post._id}`) }} />
                    </div>
                  )
                })}
              </div>


            </article>

            {/* RightSide */}
            <div></div>

          </div>
        </div>

        <div className={'profile-bar-right'}>
        </div>

      </div>
    </div>
  )

}
