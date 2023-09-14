import axios from 'axios';

export let baseURL = 'https://2867-2409-40c2-1024-a869-5898-f51d-1868-b07a.ngrok.io';

// Sign in API
export const signinApi = body => axios.post(`${baseURL}/user/login`, body);

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