import React, { useContext, useReducer } from "react";
// import axios from 'axios'
import reducer from './reducer'
import { 
  CLEAR_STATES, 
  GET_POSTS_BEGIN, 
  GET_POSTS_SUCCESS, 
  GET_POST_COMMENTS_SUCCESS, 
  HANDLE_CHANGE, 
  LOGIN_USER_BEGIN, 
  LOGIN_USER_ERROR, 
  LOGIN_USER_SUCCESS, 
  TOGGLE_POST_MODAL, 
  GET_PROFILE_POSTS_BEGIN, 
  GET_PROFILE_POSTS_SUCCESS, 
  TOGGLE_UPLOAD_MODAL, 
  TOGGLE_OPTION_MODAL, 
  TOGGLE_EDIT_MODAL, 
  REGISTER_USER_BEGIN, 
  REGISTER_USER_SUCCESS, 
  REGISTER_USER_ERROR, 
  SHOW_DROPDOWN, 
  LOGOUT_USER, 
  GET_FOLLOW_CONDITION_SUCCESS, 
  CHANGE_FOLLOW_CONDITION_SUCCESS, 
  LOAD_MORE_POSTS_SUCCESS, 
  HIDE_OPTION_MODAL, 
  LOAD_MORE_PROFILE_POSTS_SUCCESS, 
  GET_FOLLOWING_POSTS_BEGIN, 
  UPDATE_AVATAR_SUCCESS, 
  EDIT_POST_SUCCESS
} from "./actions";
import axios from 'axios'

const user = localStorage.getItem('user')
const token = localStorage.getItem('token')

// In settings.py there is function to check if RENDER_EXTERNAL_URL environment variable existed or not. If not, default value is 
// http://localhost:5000. It will automatically change when work on Render because .env will be created by Render
// React need add `REACT_APP_` prefix before environment variables
// .replace(/[/]$/, "")
// const RENDER_EXTERNAL_URL = process.env.REACT_APP_RENDER_EXTERNAL_URL
// || new Set("127.0.0.1", "localhost").has(window.location.hostname)
// const host = (process.env.NODE_ENV === "development") ? "http://localhost:5000" : RENDER_EXTERNAL_URL.replace(/[/]$/, "")
// console.log(process.env.NODE_ENV);

// Test if really nead host or let host blank on production
const host = (process.env.NODE_ENV === "development") ? "http://localhost:5000" : ""

// console.log("host:", host);
// Check if `production` or `development`


const initialState = {
  isLoading: false,
  // alert
  showAlert: false,
  alertText: '',
  alertType: '',
  // user
  user: user ? JSON.parse(user) : null,
  token: token,
  // header dropdown
  showDropdown: false,
  // posts type
  allPost: true,
  // posts
  posts: [],
  totalPosts: 0,
  numOfPages: 1,
  page: 1,
  // profile posts
  // profileId: '',
  profileUser: {},
  profilePosts: [],
  totalProfilePosts: 0,
  numOfProfilePages: 1,
  profilePage: 1,
  isFollow: false,
  followers: 0,
  following: 0,
  // postModal
  postId: '',
  showPostModal: false,
  post: {},
  postComments: [],
  // add post
  status: '',
  // upload modal
  showUpLoad: false,
  // Option modal
  showOptionModal: false,
  // Edit post
  showEditModal: false,
}

const AppContext = React.createContext()
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const customAxios = axios.create({
    baseURL: `${host}/api/v1/`,
  })

  const authFetch = axios.create({
    baseURL: `${host}/api/v1/`,
  })

  authFetch.interceptors.request.use(
    (config) => {
      config.headers.common['Authorization'] = `Bearer ${state.token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  const setShowDropdown = () => {
    dispatch({ type: SHOW_DROPDOWN })
  }

  const addUserToLocalStorage = ({ user, token }) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', token)
  }

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const login = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN })
    try {
      const { data: { token, user } } = await customAxios.post(`auth/login/`, currentUser)

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          token,
          user,
        }
      })
      addUserToLocalStorage({ user, token })
    } catch (error) {
      // dispatch({ type: LOGIN_USER_ERROR, payload: { 'msg': error } })
      console.log(error);
      dispatch({ type: LOGIN_USER_ERROR, payload: { msg: error.message } })
    }
  }

  const register = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN })
    try {
      const {data} = await customAxios.post(`auth/register/`, currentUser)
      dispatch({ type: REGISTER_USER_SUCCESS, payload: data })
      setTimeout(() => {
        login(currentUser)
      }, 500)
    } catch (error) {
      // dispatch({type:REGISTER_USER_ERROR, payload: { 'msg': error } })
      console.log(error);
      dispatch({ type: REGISTER_USER_ERROR, payload: { msg: error.message } })
    }
  }

  const logout = () => {
    dispatch({ type: LOGOUT_USER })
    removeUserFromLocalStorage()
  }

  // currently be used in Home.js
  const clearStates = () => {
    dispatch({ type: CLEAR_STATES })
  }

  const getPosts = async (reloadPage) => {
    // const url = `/data/posts.json`
    const url = `posts/`
    dispatch({ type: GET_POSTS_BEGIN })
    try {
      const page = reloadPage || state.page
      const { data } = await authFetch({
        url,
        params: { page: page },
      })
      const { posts, totalPosts, numOfPages } = data
      // console.log(data, page)
      dispatch({ type: GET_POSTS_SUCCESS, payload: { posts, totalPosts, numOfPages } })
    } catch (error) {
      console.log(error);
    }
  }

  // if use getPosts will change isLoading to false
  const loadMorePosts = async () => {
    // const url = `/data/posts.json`
    let url = `posts/`
    // if (page < nomOfPages) {
    try {
      if (!state.allPost) {
        url = `posts/followingPosts/`
      }
      const { data } = await authFetch({
        url,
        params: {
          page: state.page + 1,
        }
      })
      console.log(data)
      dispatch({ type: LOAD_MORE_POSTS_SUCCESS, payload: data })
    } catch (error) {
      console.log(error)
    }
  }

  // AllowAny
  const getProfilePosts = async (profileName, reloadPage) => {
    // dispatch({ type: GET_PROFILE_POSTS_BEGIN })
    // const url = `/data/profilePosts.json`
    // console.log(profileName);
    let url = `profile/${profileName}`
    const page = reloadPage || state.profilePage
    dispatch({ type: GET_PROFILE_POSTS_BEGIN })
    try {
      const { data } = await authFetch({
        url,
        // params in axios is actually query in nodejs
        params: {
          page,
        }
      })
      dispatch({
        type: GET_PROFILE_POSTS_SUCCESS, payload: data
      })
    } catch (error) {
      console.log(error);
    }
  }

  // if use getPosts will change isLoading to false
  const loadMoreProfilePosts = async () => {
    let url = `profile/${state.profileUser.username}/`
    try {
      const { data } = await authFetch({
        url,
        // params in axios is query in nodejs
        params: {
          page: state.profilePage + 1,
        }
      })
      dispatch({
        type: LOAD_MORE_PROFILE_POSTS_SUCCESS, payload: data
      })
    } catch (error) {
      console.log(error);
    }
  }

  const getFollowingPosts = async (reloadPage) => {
    // const url = `/data/posts.json`
    const url = `posts/followingPosts/`
    dispatch({ type: GET_FOLLOWING_POSTS_BEGIN })
    try {
      const page = reloadPage || state.page
      const { data } = await authFetch({
        url,
        params: { page: page },
      })
      const { posts, totalPosts, numOfPages } = data
      console.log(data)
      dispatch({ type: GET_POSTS_SUCCESS, payload: { posts, totalPosts, numOfPages } })
    } catch (error) {
      console.log(error);
    }
  }

  const togglePostModal = async (postId, hide) => {
    // use for close postModal
    if (hide === true) {
      // console.log('hidePostModal');
      return dispatch({ type: TOGGLE_POST_MODAL, payload: { post: {}, showPostModal: false, showOptionModal: false } })
    }

    // if use url to get to postModal without open home or profile first
    if (state.posts.length === 0 && state.profilePosts.length === 0) {
      const { data:{post} } = await authFetch(`post/${postId}/`)
      dispatch({ type: TOGGLE_POST_MODAL, payload: { post, showPostModal: true } })
      await getFollowCondition(post.user.username)
      return
    }

    // if url is not in profile
    if (Object.keys(state.profileUser).length === 0) {
      const post = state.posts.find(post => String(post._id) === String(postId))
      console.log(post);
      dispatch({ type: TOGGLE_POST_MODAL, payload: { postId, post, showPostModal: true } })
      await getFollowCondition(post.user.username)
    }
    // if url is in profile
    else {
      const post = state.profilePosts.find(post => String(post._id) === String(postId))
      console.log(post);
      dispatch({ type: TOGGLE_POST_MODAL, payload: { postId, post, showPostModal: true } })
      await getFollowCondition(post.user.username)
    }
    // console.log(post);
    // dispatch({ type: TOGGLE_POST_MODAL, payload: { postId, post: {}, showPostModal: true } })
    // await getFollowCondition(post.user._id)
  }



  const getPostComments = async (postId) => {
    // const url = `/data/postComments.json`
    const url = `comments/${postId}/`
    try {
      const { data: {comments} } = await authFetch(url)
      dispatch({ type: GET_POST_COMMENTS_SUCCESS, payload: { comments } })
    } catch (error) {
      console.log(error)
    }
  }

  const getFollowCondition = async (profileName) => {
    const url = `getFollow/${profileName}/`
    try {
      const { data: { isFollow } } = await authFetch(url)
      dispatch({ type: GET_FOLLOW_CONDITION_SUCCESS, payload: { isFollow } })
    } catch (error) {
      console.log(error);
    }
  }

  const toggleFollowCondition = async (profileName) => {
    const url = `follow/${profileName}/`
    try {
      const { data: { isFollow } } = await authFetch.patch(url)
      dispatch({ type: CHANGE_FOLLOW_CONDITION_SUCCESS, payload: { isFollow } })
    } catch (error) {

    }
  }

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
  }

  const toggleUploadModal = () => {
    dispatch({ type: TOGGLE_UPLOAD_MODAL })
  }

  // Change iamge url, on development, react need host to serve image files
  // On production, we don't need host
  function changeImagePath(image) {
    const baseUrl = `${host}`
    if ((image || '').includes(baseUrl)) {
      return image
    } else {
      return baseUrl + image
    }
  }

  const toggleOptionModal = (post) => {
    // turn on option modal from post
    if (!state.showPostModal) {
      dispatch({ type: TOGGLE_OPTION_MODAL, payload: { post } })
      return
    }

    // turn on option modal when postEdit true
    // turn off option modal when postEdit true
    // turn off option modal when toggleEditModal
    dispatch({ type: TOGGLE_OPTION_MODAL, payload: { post: state.post } })
  }

  const hideOptionModal = () => {
    if (!state.showPostModal) {
      dispatch({ type: TOGGLE_OPTION_MODAL, payload: { post: {} } })
      return
    }
    dispatch({ type: HIDE_OPTION_MODAL })
  }

  const toggleEditModal = () => {
    // when postModal is on
    if (state.showPostModal) {
      // when editModal is off
      if (!state.showEditModal) {
        // optionModal is on
        // when editModal is off
        // turn on editModal
        // turn off optionModal
        toggleOptionModal(state.post)
        dispatch({ type: TOGGLE_EDIT_MODAL, payload: { post: state.post } })
        return
      }
      // when editModal is already on
      else {
        // turn off editModal
        dispatch({ type: TOGGLE_EDIT_MODAL, payload: { post: state.post } })
        return
      }
    }
    // when postModal is off
    else {
      // when editModal is already on
      if (state.showEditModal) {
        // turn off editModal
        dispatch({ type: TOGGLE_EDIT_MODAL, payload: { post: {} } })
      }
      // when editModal is off
      else {
        // turn on editModal
        dispatch({ type: TOGGLE_EDIT_MODAL, payload: { post: state.post } })

        // optionModal is already on
        // turn off optionModal
        toggleOptionModal(state.post)
      }
    }
  }

  const addPost = async (newPost) => {
    const url = `posts/`
    try {
      const { data: {post} } = await authFetch.post(url, newPost)
      if (post.status === false) {
        console.log(post)
      }
      // dispatch({type:ADD_POST_SUCCESS})
    } catch (error) {
      console.log(error)
    }
    await getPosts(1)
    if (Object.keys(state.profileUser).length !== 0) {
      getProfilePosts(state.profileUser.username, 1)
    }
    toggleUploadModal()
  }

  const deletePost = async (postId) => {
    // I use request.get in server, so don' add suffix at the end
    const url = `posts/${postId}`
    try {
      await authFetch.delete(url)
      // console.log(data.detail)
    } catch (error) {
      console.log(error)
    }
    // clearStates()
    await togglePostModal('', true)
    if (Object.keys(state.profileUser).length !== 0) {
      return getProfilePosts(state.profileUser.username, 1)
    }
    await getPosts(1)
  }

  // Edit post
  const editPost = async (formData) => {
    const url = `posts/`
    try {
      await authFetch.patch(url, formData)
      // const postId = formData.get("postId")
      const status = formData.get("status")
      // state.posts.forEach((post, i)=>{
      //   if (post._id == postId) {
      //     state.posts[i].status = status
      //   }
      // })
      dispatch({type:EDIT_POST_SUCCESS, payload: {status}})
      
    }
    catch (error) {
      console.log(error)
    }
  }

  const updateAvatar = async (avatar) => {
    const url = `user/`
    try {
      const { data } = await authFetch.patch(url, avatar, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(data);

      localStorage.setItem('user', JSON.stringify(data))
      dispatch({ type: UPDATE_AVATAR_SUCCESS, payload: { user: data } })
    }
    catch (error) {
      console.log(error)
    }

  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        clearStates,
        getPosts,
        loadMorePosts,
        toggleUploadModal,
        togglePostModal,
        toggleOptionModal,
        toggleEditModal,
        hideOptionModal,
        login,
        register,
        handleChange,
        getProfilePosts,
        getPostComments,
        changeImagePath,
        setShowDropdown,
        logout,
        toggleFollowCondition,
        authFetch,
        customAxios,
        editPost,
        addPost,
        deletePost,
        loadMoreProfilePosts,
        getFollowingPosts,
        updateAvatar,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useAppContext = () => { return (useContext(AppContext)) }

export { useAppContext, AppProvider, initialState }
