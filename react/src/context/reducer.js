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
  GET_PROFILE_POSTS_SUCCESS, 
  GET_PROFILE_POSTS_BEGIN, 
  TOGGLE_UPLOAD_MODAL, 
  TOGGLE_OPTION_MODAL, 
  TOGGLE_EDIT_MODAL, 
  HIDE_OPTION_MODAL,
  EDIT_POST_SUCCESS, 
  REGISTER_USER_BEGIN, 
  REGISTER_USER_SUCCESS, 
  REGISTER_USER_ERROR, 
  GET_USER_SUCCESS, 
  SHOW_DROPDOWN, 
  LOGOUT_USER, 
  GET_FOLLOW_CONDITION_SUCCESS, 
  CHANGE_FOLLOW_CONDITION_SUCCESS, 
  ADD_POST_SUCCESS, 
  LOAD_MORE_POSTS_SUCCESS, 
  LOAD_MORE_PROFILE_POSTS_SUCCESS, 
  UPDATE_AVATAR_SUCCESS
} from "./actions"

const reducer = (state, action) => {
  if (action.type === LOGIN_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    }
  }
  if (action.type === LOGIN_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      token: action.payload.token,
      user: action.payload.user,
    }
  }
  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    }
  }

  if (action.type === UPDATE_AVATAR_SUCCESS) {
    return {
      ...state,
      user: action.payload.user,
      profileUser: {...state.profileUser,'avatar':action.payload.user.avatar},
    }
  }

  if (action.type === LOGOUT_USER) {
    return {
      ...state,
      user: null,
      token: null,
      posts: [],
      showDropdown: false,
    }
  }

  if (action.type === GET_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user
    }
  }

  if (action.type === REGISTER_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    }
  }
  if (action.type === REGISTER_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      token: action.payload.token,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Created! Redirecting...',
    }
  }
  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    }
  }

  if (action.type === GET_POSTS_BEGIN) {
    return {
      ...state,
      isLoading: true,
    }
  }
  if (action.type === GET_POSTS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      posts: action.payload.posts,
      totalPosts: action.payload.totalPosts,
      numOfPages: action.payload.numOfPages,
    }
  }

  if (action.type === LOAD_MORE_POSTS_SUCCESS) {
    return {
      ...state,
      page: state.page + 1,
      posts: [...state.posts, ...action.payload.posts],
      totalPosts: action.payload.totalPosts,
      numOfPages: action.payload.numOfPages,
    }
  }


  if (action.type === ADD_POST_SUCCESS) {
    return {
      ...state,
      page: 1,
    }
  }

  if (action.type === GET_PROFILE_POSTS_BEGIN) {
    return {
      ...state,
      isLoading: true,
    }
  }
  if (action.type === GET_PROFILE_POSTS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      profilePosts: action.payload.profilePosts,
      totalProfilePosts: action.payload.totalProfilePosts,
      numOfProfilePages: action.payload.numOfProfilePages,
      isFollow: action.payload.isFollow,
      following: action.payload.following,
      followers: action.payload.followers,
      profileUser: action.payload.profileUser,
    }
  }
  if (action.type === LOAD_MORE_PROFILE_POSTS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      profilePage: state.profilePage + 1,
      profilePosts: [...state.profilePosts, ...action.payload.profilePosts],
      totalProfilePosts: action.payload.totalProfilePosts,
      numOfProfilePages: action.payload.numOfProfilePages,
      // isFollow: action.payload.isFollow,
      // following: action.payload.following,
      // followers: action.payload.followers,
      // profileUser: action.payload.profileUser,
    }
  }



  if (action.type === GET_POST_COMMENTS_SUCCESS) {
    return {
      ...state,
      postComments: action.payload.comments,
    }
  }

  if (action.type === CLEAR_STATES) {
    const initialState = {
      isLoading: false,
      // alert
      showAlert: false,
      alertText: '',
      alertType: '',
      // user
      // user: user ? JSON.parse(user) : null,
      // posts
      // posts: [],
      // profile posts
      profileId: '',
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
    return {
      ...state,
      ...initialState,
    }
  }

  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      [action.payload.name]: action.payload.value
    }
  }

  if (action.type === TOGGLE_UPLOAD_MODAL) {
    return {
      ...state,
      showUploadModal: !state.showUploadModal,
    }
  }

  if (action.type === TOGGLE_POST_MODAL) {
    return {
      ...state,
      showPostModal: action.payload.showPostModal,
      postId: action.payload.post._id,
      post: action.payload.post,
      showOptionModal: action.payload.showOptionModal,
    }
  }

  if (action.type === TOGGLE_OPTION_MODAL) {
    return {
      ...state,
      showOptionModal: !state.showOptionModal,
      post: action.payload.post,
    }
  }
  if (action.type === HIDE_OPTION_MODAL) {
    return {
      ...state,
      showOptionModal: false,
    }
  }

  if (action.type === TOGGLE_EDIT_MODAL) {
    return {
      ...state,
      showEditModal: !state.showEditModal,
      // post: action.payload.post,
    }
  }

  if (action.type === EDIT_POST_SUCCESS) {
    return {
      ...state,
      post: {...state.post, status: action.payload.status},
    }
  }

  if (action.type === SHOW_DROPDOWN) {
    return {
      ...state,
      showDropdown: !state.showDropdown,
    }
  }

  if(action.type === GET_FOLLOW_CONDITION_SUCCESS){
    return {
      ...state,
      isFollow: action.payload.isFollow,
    }
  }
  if(action.type === CHANGE_FOLLOW_CONDITION_SUCCESS){
    return {
      ...state,
      isFollow: action.payload.isFollow,
    }
  }
}
export default reducer