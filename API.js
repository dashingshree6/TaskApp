import axios from 'axios';

export let baseURL = 'https://caf8-2409-40c2-115d-5801-44c7-2626-ff7-782b.ngrok.io';

// Sign in API
export const signinApi = body => axios.post(`${baseURL}/user/login`, body);

// Sign up API
export const signUpApi = body => axios.post(`${baseURL}/user/register`, body);

// Create task API
export const createTask = (body, token) => axios.post(`${baseURL}/tasks`,body,{
    headers: {Authorization: `Bearer ${token}`},
})

// Delete task API
export const deleteTask = (id) => axios.delete(`${baseURL}/tasks/${id}`)

// Update task status API
export const updateTask = (id) => axios.put(`${baseURL}/tasks/status/${id}`)

// Get all task API
export const getTask = (token) => axios.get(`${baseURL}/tasks`,{
    headers: {Authorization: `Bearer ${token}`},
})