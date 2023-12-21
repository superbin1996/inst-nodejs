import { BsThreeDots } from 'react-icons/bs';
import { IoIosArrowUp } from 'react-icons/io'
import { useAppContext } from '../context/appContext';
import { Header, UploadModal } from './index';
import {ahri, haku} from "../assets/images/index"

const ProfileNoPost = () => {
  const {
    following,
    followers,
    profileUser,
    totalProfilePosts,
    changeImagePath,
    user,
    toggleFollowCondition,
    isFollow,
    showUploadModal,
  } = useAppContext()

  const checkUser = () => {
    if (user) {
      if (String(profileUser.profileId) === String(user._id)) return true
      else return false
    }
  }
  
  return (
    <div className='profile-modal'>
      <Header />
      {showUploadModal && <UploadModal/>}
      <div className={'profile-cover'}>
        <div className={'profile-bar-left'}></div>

        <div className={'profile-bar-center'}>

          <header className='profile-header'>

            <label className='profile-avatar' htmlFor='avatar'>
              <img src={changeImagePath(profileUser.avatar)} alt={profileUser.avatar} />
              {checkUser() && 
              <input type="file" id='avatar' />
              }
            </label>

            <div className='profile-username'>{profileUser.username}</div>
            <div className='profile-message'>Message</div>

            {checkUser() || 
            <div className='profile-follow' onClick={()=>toggleFollowCondition(profileUser.username)}>
              {isFollow?'Following':'Follow'}
            </div>
            }

            <IoIosArrowUp className="profile-suggestion" />
            <BsThreeDots className="profile-option" />
            <div className='profile-posts'>{totalProfilePosts} posts</div>
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

              <div className={'profile-images'} style={{ display: 'grid', gridTemplateColumns: '1fr' }}>

                <h2>There is no post yet</h2>
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
export default ProfileNoPost