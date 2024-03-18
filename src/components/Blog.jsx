import { useState } from 'react'

const Blog = ({ blog, toggleLike, toggleRemove, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)


  const toggleView = () => {
    setVisible(!visible)
  }


  return (
    <div style={blogStyle} className='blog'>
      {blog.title} &nbsp;
      <button onClick={toggleView}>{visible ? 'hide' : 'view'}</button>
      {visible &&
        <><div>{blog.url}</div>
          <div>
            <span className='likes'>likes {blog.likes}</span> &nbsp;
            <button onClick={toggleLike}>like</button>
          </div>
          <div>{blog.author}</div>
          {
            'user' in blog
              ? username === blog.user.username
                ? <button onClick={toggleRemove}>Remove</button>
                : <></>
              : <button onClick={toggleRemove}>Remove</button>
          }
        </>
      }
    </div>
  )
}
export default Blog