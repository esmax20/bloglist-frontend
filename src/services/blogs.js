import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

export const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export const createBlog = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export const updateBlog = (updatedBlog) => {
  const request = axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return request.then(response => response.data)
}

export const eraseBlog = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { setToken }