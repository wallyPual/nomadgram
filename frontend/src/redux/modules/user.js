// imports
import { push } from 'react-router-redux';
// actions
const SAVE_TOKEN = "SAVE_TOKEN";
const LOGOUT = 'LOGOUT';
const SET_USER_LIST = "SET_USER_LIST";
const FOLLOW_USER = "FOLLOW_USER";
const UNFOLLOW_USER = "UNFOLLOW_USER";
const SET_IMAGE_LIST = "SET_IMAGE_LIST";
const SET_NOTIFICATION_LIST = "SET_NOTIFICATION_LIST";
const GET_USER_PROFILE = "GET_USER_PROFILE";

// action creators
function saveToken(token, username) {
	return {
		type: SAVE_TOKEN,
		token,
		username
	}
}

function logout() {
	return {
		type: LOGOUT
	}
}

function setUserList(userList) {
	return {
		type: SET_USER_LIST,
		userList
	}
}

function setFollowUser(userId) {
	return {
		type: FOLLOW_USER,
		userId
	}
}

function setUnfollowUser(userId) {
	return {
		type: UNFOLLOW_USER,
		userId
	}
}

function setImageList(imageList){
	return {
		type: SET_IMAGE_LIST,
		imageList
	}
}

function setUserProfile(userProfile) {
	return {
		type: GET_USER_PROFILE,
		userProfile
	}
}

function setNotification(notificationList){
	return {
		type: SET_NOTIFICATION_LIST,
		notificationList
	}
}

// API actions
function facebookLogin(access_token) {
	return dispatch => {
		fetch("/users/login/facebook/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					access_token
				})
			})
			.then(response => response.json())
			.then(json => {
				if (json.token) {
					dispatch(saveToken(json.token, json.user.username));
				}
			})
			.catch(err => console.log(err));
	}
}

function usernameLogin(username, password) {
	return function (dispatch) {
		fetch('/rest-auth/login/', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username,
					password
				})
			})
			.then(response => response.json())
			.then(json => {
				if (json.token) {
					dispatch(saveToken(json.token, username));
				}
			})
			.catch(err => console.log(err))
	}
}

function createAccount(username, password, email, name) {
	return function (dispatch) {
		fetch('/rest-auth/registration/', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username,
					password1: password,
					password2: password,
					email,
					name
				})
			})
			.then(response => response.json())
			.then(json => {
				if (json.token) {
					dispatch(saveToken(json.token));
				}
			})
			.catch(err => console.log(err))
	}
}

function getPhotoLikes(photoId){
	return (dispatch, getState) => {
		const { user: { token } } = getState();
		fetch(`/images/${photoId}/likes/`, {
			headers: {
				Authorization: `JWT ${token}`
			}
		})
		.then(response => {
			if ( response.status === 401 ) {
				dispatch(logout())
			}
			return response.json()
		})
		.then(json => {
			dispatch(setUserList(json))
		})
	}
}

function followUser(userId) {
	return (dispatch, getState) => {
		dispatch(setFollowUser(userId));
		const { user : { token } } = getState();
		fetch(`/users/${userId}/follow/`, {
			method: "POST",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			}
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			} else if(!response.ok){
				dispatch(setUnfollowUser(userId))
			}
		})
	}
}

function unfollowUser(userId) {
	return (dispatch, getState) => {
		dispatch(setUnfollowUser(userId));
		const { user : { token } } = getState();
		fetch(`/users/${userId}/unfollow/`, {
			method: "POST",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			}
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			} else if(!response.ok){
				dispatch(setFollowUser(userId))
			}
		})
	}
}

function getExplore() {
	return (dispatch, getState) => {
		const { user : { token } } = getState();
		fetch(`/users/explore/`, {
			method: "GET",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			}
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			}
			return response.json()
		})
		.then(json => dispatch(setUserList(json)))
	}
}

function searchByTerm(searchTerm){
	return async(dispatch, getState) => {
		const { user: { token } } = getState();
		const userList = await searchUser(token, searchTerm);
		const imageList = await searchImages(token, searchTerm);

		if (userList === 401 || imageList === 401){
			dispatch(logout());
			dispatch(push('/'))
		}
		dispatch(setUserList(userList));
		dispatch(setImageList(imageList));
	}
}

function searchUser(token, searchTerm) {
	return fetch(`/users/search/?username=${searchTerm}`,{
		headers: {
			"Authorization": `JWT ${token}`
		}
	})
	.then(response => {
		if(response.status === 401){
			return 401
		}
		return response.json()
	})
	.then(json => json)
}

function searchImages(token, searchTerm) {
	return fetch(`/images/search/?hashtags=${searchTerm}`,{
		headers: {
			"Authorization": `JWT ${token}`
		}
	})
	.then(response => {
		if(response.status === 401){
			return 401
		}
		return response.json()
	})
	.then(json => json)
}

function getNotification() {
	return (dispatch, getState) => {
		const { user : { token } } = getState();
		fetch('/notifications/',{
			headers: {
				"Authorization": `JWT ${token}`
			}
		})
		.then(response => {
			if(response.status === 401){
				dispatch(logout())
			}
			return response.json()
		})
		.then(json => {
			dispatch(setNotification(json));
		});
	}
}

function getProfile(username) {
	return (dispatch, getState) => {
		const { user : { token } } = getState();
		fetch(`/users/${username}/`, {
			method: "GET",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			}
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			}
			return response.json()
		})
		.then(json => {
			dispatch(setUserProfile(json));
		})
	}
}

function getFollower(username) {
	return (dispatch, getState) => {
		const { user : { token } } = getState();
		fetch(`/users/${username}/followers/`, {
			method: "GET",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			}
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			}
			return response.json()
		})
		.then(json => {
			dispatch(setUserList(json));
		})
	}
}

function getFollowing(username) {
	return (dispatch, getState) => {
		const { user : { token } } = getState();
		fetch(`/users/${username}/following/`, {
			method: "GET",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			}
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			}
			return response.json()
		})
		.then(json => {
			dispatch(setUserList(json));
		})
	}
}

function putProfile(beforeUsername, username, name, website, bio, profileImage) {
	return (dispatch, getState) => {
		const { user : { token } } = getState();
		fetch(`/users/${beforeUsername}/`, {
			method: "PUT",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username,
				name,
				website,
				bio,
				profileImage
			})
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			}
			return response.json()
		})
		.then(json => {
			console.log(json)
			dispatch( setUserProfile(json) )
		})
	}
}

function putChangePassword(username, current_password, new_password) {
	return (dispatch, getState) => {
		const { user : { token } } = getState();
		fetch(`/users/${username}/password/`, {
			method: "PUT",
			headers: {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				current_password,
				new_password
			})
		})
		.then(response => {
			if(response.status === 401) {
				dispatch(logout())
			}
			return alert('비밀번호 변경이 완료되었습니다.')
		})
	}
}

// initial state
const initialState = {
	isLoggedIn: localStorage.getItem('jwt') ? true : false,
	token: localStorage.getItem('jwt'),
	username: localStorage.getItem('username') ? localStorage.getItem('username') : null
}

// reducer
function reducer(state = initialState, action) {
	switch (action.type) {
		case SAVE_TOKEN:
			return applySetToken(state, action);
		case LOGOUT:
			return applyLogout(state, action);
		case SET_USER_LIST:
			return applySetUserList(state, action);
		case FOLLOW_USER:
			return applyFollowUser(state, action);
		case UNFOLLOW_USER:
			return applyUnfollowUser(state, action);
		case SET_IMAGE_LIST:
			return applySetImageList(state, action);
		case SET_NOTIFICATION_LIST:
			return applySetnotificationList(state, action);
		case GET_USER_PROFILE:
			return applyGetUserProfile(state, action);
		default:
			return state;
	}
}

// reducer functions

function applySetToken(state, action) {
	const {
		token,
		username
	} = action;
	localStorage.setItem("jwt", token);
	localStorage.setItem("username", username);
	return {
		...state,
		isLoggedIn: true,
		token,
		username
	}
}

function applyLogout(state, action) {
	localStorage.removeItem('jwt');
	return {
		isLoggedIn: false
	}
}

function applySetUserList(state, action) {
	const { userList } = action;

	return {
		...state,
		userList
	}
}

function applyFollowUser(state, action) {
	const { userId } = action;
	const { userList, userProfile } = state;
	const updatedUserList = userList.map(user => {
		if (user.id === userId) {
			return {
				...user,
				following: true
			}
		}
		return user
	})

	if ( userProfile ) {
		const updatedUserProfile = {
			...userProfile,
			following_count: userProfile.following_count + 1
		}
		return { ...state, userList: updatedUserList, userProfile: updatedUserProfile }
	} else {
		return { ...state, userList: updatedUserList }
	}
}

function applyUnfollowUser(state, action) {
	const { userId } = action;
	const { userList, userProfile } = state;
	const updatedUserList = userList.map(user => {
		if (user.id === userId) {
			return {
				...user,
				following: false
			}
		}
		return user
	})

	if ( userProfile ) {
		const updatedUserProfile = {
			...userProfile,
			following_count: userProfile.following_count -1
		}
		return { ...state, userList: updatedUserList, userProfile: updatedUserProfile }
	} else {
		return { ...state, userList: updatedUserList }
	}
}

function applySetImageList(state, action) {
	const { imageList } = action;

	return {
		...state,
		imageList
	}
}

function applySetnotificationList(state, action) {
	const { notificationList } = action;

	return {
		...state,
		notificationList
	}
}

function applyGetUserProfile(state, action) {
	const { userProfile } = action;
	return {
		...state,
		userProfile
	}
}
// exports
const actionCreators = {
	facebookLogin,
	usernameLogin,
	createAccount,
	logout,
	getPhotoLikes,
	followUser,
	unfollowUser,
	getExplore,
	searchByTerm,
	getNotification,
	getProfile,
	getFollower,
	getFollowing,
	putProfile,
	putChangePassword
}

export {
	actionCreators
}

// reducer export
export default reducer;
