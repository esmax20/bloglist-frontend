import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifType, setNotifType] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotifMessage(`a new blog '${returnedBlog.title}' by '${returnedBlog.author}' added`)
        setNotifType('simple')
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000)
      })
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setNotifMessage('Wrong username or password')
      setNotifType('error')
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
    />
  )

  const toggleDeleteOf = id => {
    const blog = blogs.find(n => n.id === id)
    if (window.confirm(`Remove blog '${blog.title}' by '${blog.author}'?`)) {
      blogService
        .erase(id)
        .then(returnedBlog => {
          setBlogs(blogs.filter(n => n.id !== id))
          setNotifMessage(
            `Deleted '${blog.title}'`
          )
          setNotifType('simple')
          setTimeout(() => {
            setNotifMessage(null)
          }, 5000)
        })
        .catch(error => {
          alert(
            `the blog '${blog.title}' wont be deleted due to error`
          )
        })
    }

  }

  const toggleLikeOf = id => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : changedBlog))
      })
      .catch(error => console.log('error:', error.message))
  }


  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )


  if (user === null) {
    return (
      <div>
        <h1>Blogs List</h1>
        <Notification message={notifMessage} type={notifType} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs List</h1>
      <Notification message={notifMessage} type={notifType} />
      <p>{user.name} logged-in as {user.username}</p>
      <form onSubmit={() => window.localStorage.removeItem('loggedBlogappUser')}>
        <button type="submit">Logout</button>
      </form>

      {blogForm()}

      <h2>blogs</h2>
      {blogs.sort((mostLiked, leastLiked) => leastLiked.likes - mostLiked.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          toggleLike={() => toggleLikeOf(blog.id)}
          toggleRemove={() => toggleDeleteOf(blog.id)}
          username={user.username}
        />
      )}
    </div>
  )
}

export default App