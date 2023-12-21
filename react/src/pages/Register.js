import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Alert } from "../components/index"
import { useAppContext } from "../context/appContext"
import {loginImg, login1Img, instagramLogo} from "../assets/images/index"

const initialState = {
  username: '',
  password: '',
  isMember: true,
}

const Register = () => {
  const {
    user,
    showAlert,
    login,
    register,
    displayAlert,
  } = useAppContext()
  const navigate = useNavigate()
  const [values, setValues] = useState(initialState)

  useEffect(() => {
    if (user) {
      if (user) {
        navigate('/')
      }
    }
  }, [user, navigate])

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { username, password } = values
    if(!username && !password){
      displayAlert()
      return
    }
    const currentUser = {username, password}
    if (values.isMember){
      login(currentUser)
    }
    else {
      register(currentUser)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSubmit(event)
    }
  }

  return (
    <div className='login'>
      <div className='login-container'>
        <div className="login-img">
          <img src={loginImg} alt="login" />
          <img src={login1Img} alt="login1" />
        </div>
        <div className="login-area">
          <div className='login-item'>
            <img className='login-logo'
              src={instagramLogo}
              alt="Instagram Logo"
            />
            
            {showAlert && <Alert></Alert>}
            <div>
              <input type="text" name='username' placeholder='Username' value={values.username} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>

            <div>
              <input type="password" name='password' placeholder='Password' value={values.password} onChange={handleChange} onKeyDown={handleKeyDown} />
            </div>

            {values.isMember ?
              <button onClick={onSubmit}>Login</button> :
              <button onClick={onSubmit}>Register</button>
            }

          </div>
          <div className="isMember">
            {values.isMember ?
              <div onClick={toggleMember}>Don't have an account? <span>Sign up</span></div>
              :
              <div onClick={toggleMember}>Already have an account? <span>Sign in</span></div>
            }
          </div>
        </div>
      </div>

    </div>

  )
}
export default Register