import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  // const [errorMessage, setErrorMessage] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)
  const [notifType, setNotifType] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

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
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes('')
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotifMessage('Wrong username or password')
      setNotifType('error')
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
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
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
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
      <p>{user.name} logged-in</p>
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