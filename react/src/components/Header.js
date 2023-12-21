import { FaSearch, FaRegCompass } from 'react-icons/fa';
import { MdHomeFilled } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import { BsPlusSquare } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appContext';

export default function Header() {

  const {
    user,
    toggleUploadModal,
    changeImagePath,
    showDropdown,
    setShowDropdown,
    logout,
  } = useAppContext()

  const navigate = useNavigate()
  const location = useLocation()

  const hideHeaderDropdown = () => {
    if (showDropdown) {
      setShowDropdown()
    }
  }

  const refresh = () => { 
    if (location.pathname === '/') {
      window.scrollTo({top: 0, behavior: 'smooth'})
    }
    navigate('/')
  }

  const navigateProfile = () => {
    // showProfile(userId)
    // getProfilePosts(userId)
    // showProfile(userId)
    navigate(`/${user.username}`)
    setShowDropdown()
  }

  return (
    <div className='header-cover' onClick={hideHeaderDropdown}>

      {/* Left  */}
      <div className='header-left'>
        <img className='logo'
          src="https://i0.wp.com/www.dafontfree.io/wp-content/uploads/2020/12/instagram-new.png?fit=1100%2C750&ssl=1"
          alt="Instargram Logo"
          onClick={refresh}
        />

        <div className='search'>
          <FaSearch className='faSearch' />
          <input className='search-input' type="text" placeholder='Search' />
        </div>
      </div>

      {/* Right */}

      {/* Login or not login yet */}
      {user ?
      // Logged in
      <div className='header-right'>
        <MdHomeFilled className='icon' onClick={refresh} />
        <FiSend className='icon' />

        <BsPlusSquare
          className='icon'
          onClick={toggleUploadModal}
        />

        <FaRegCompass className='icon' />
        <AiOutlineHeart className='icon' />
        <div className='dropdown' onClick={(e) => e.stopPropagation()}>
          <img className='icon-user' src={changeImagePath(user.avatar)} alt={"avatar"} onClick={setShowDropdown} />
          <div id='myDropDown' className={showDropdown ? 'dropdown-content show-dropdown' : 'dropdown-content'}>
            <div onClick={navigateProfile}>
              Profile
            </div>
            <div>
              Following posts
            </div>
            <div onClick={()=>{navigate('/register');logout()}}>
              Logout
            </div>
          </div>
        </div>

      </div>
      :
      // Have not Logged in
      <div className='header-right'>
        <button onClick={()=>navigate('/register')}>Login/Register</button>
      </div>
      }

    </div>
  );
}
