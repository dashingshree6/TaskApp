import axios from 'axios';

export let baseURL = 'https://33c1-49-205-239-19.ngrok-free.app';

// Sign in API
export const signinApi = body => axios.post(`${baseURL}/user/login`, body);

// Create task API
export const createTask = (body, token) => axios.post(`${baseURL}/tasks`,body,{
    headers: {Authorization: `Bearer ${token}`},
})

// Delete task API
export const deleteTask = (id, token) => axios.delete(`${baseURL}/tasks/${id}`,{
    headers: {Authorization: `Bearer ${token}`},
})

// Update task status API
export const updateTask = (token, id) => axios.put(`${baseURL}/tasks/${id}`,{
    headers: {Authorization: `Bearer ${token}`},
})

// Get all task API
export const getTask = (token) => axios.get(`${baseURL}/tasks`,{
    headers: {Authorization: `Bearer ${token}`},
})