import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { getAll, createBlog, updateBlog, eraseBlog } from './services/blogs'
import store from './services/store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useLoginValue, useLoginDispatch } from './LoginContext'

const App = () => {
  const [notifType, setNotifType] = useState(null)
  const blogFormRef = useRef()
  const dispatch = useLoginDispatch()
  const user = useLoginValue()

  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      setNotifType('simple')
      store.dispatch({
        type: 'NOTIF',
        payload: `a new blog '${newBlog.title}' by '${newBlog.author}' added`
      })
      setTimeout(() => {
        store.dispatch({ type: 'NOTIF', payload: null })
      }, 5000)
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (newBlog) => {
      //queryClient.invalidateQueries({ queryKey: ['blogs'] })
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.map(blog => blog.id !== newBlog.id ? blog : newBlog))
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: eraseBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({
        type: 'LOGIN',
        payload: user
      })
      console.log(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      dispatch({
        type: 'LOGIN',
        payload: user
      })
      console.log(user)
    } catch (exception) {
      store.dispatch({
        type: 'NOTIF',
        payload: 'Wrong username or password'
      })
      setNotifType('error')
      setTimeout(() => {
        store.dispatch({ type: 'NOTIF', payload: null })
      }, 5000)
    }
  }

  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
    />
  )



  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
    /* blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        store.dispatch({ type: 'NOTIF', payload: `a new blog '${returnedBlog.title}' by '${returnedBlog.author}' added` })
        console.log(store.getState())
        setNotifType('simple')
        setTimeout(() => {
          store.dispatch({ type: 'NOTIF', payload: null })
        }, 5000)
      }) */
  }

  const toggleDeleteOf = id => {
    const blog = blogs.find(n => n.id === id)
    if (window.confirm(`Remove blog '${blog.title}' by '${blog.author}'?`)) {
      deleteBlogMutation.mutate(id)
      /* blogService
        .erase(id)
        .then(returnedBlog => {
          setBlogs(blogs.filter(n => n.id !== id))
          store.dispatch({ type: 'NOTIF', payload: `Deleted '${blog.title}'` })
          setNotifType('simple')
          setTimeout(() => {
            store.dispatch({
              type: 'NOTIF',
              payload: null
            })
          }, 5000)
        })
        .catch(error => {
          alert(
            `the blog '${blog.title}' wont be deleted due to error`
          )
        }) */
    }

  }

  const toggleLikeOf = id => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    updateBlogMutation.mutate(changedBlog)
    /* blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : changedBlog))
      })
      .catch(error => console.log('error:', error.message)) */
  }


  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getAll,
    retry: 1,
    refetchOnWindowFocus: false
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }
  else if (result.isError) {
    return <div>server not responding</div>
  }

  const blogs = result.data
  console.log(user)
  if (user === null) {
    return (
      <div>
        <h1>Blogs List</h1>
        <Notification message={store.getState()} type={notifType} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h1>Blogs List</h1>
      <Notification message={store.getState()} type={notifType} />
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