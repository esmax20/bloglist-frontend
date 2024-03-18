import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [newLikes, setNewLikes] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl,
            likes: parseInt(newLikes),
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes('')
    }

    return (
        <div className="formDiv">
            <h2>Create New</h2>
            <form onSubmit={addBlog}>
                Title:
                <input
                    data-testid='newTitle'
                    value={newTitle}
                    onChange={event => setNewTitle(event.target.value)}
                    id='title-input'
                /><br />
                Author:
                <input
                    data-testid='newAuthor'
                    value={newAuthor}
                    onChange={event => setNewAuthor(event.target.value)}
                    id='author-input'
                /><br />
                url:
                <input
                    data-testid='newUrl'
                    value={newUrl}
                    onChange={event => setNewUrl(event.target.value)}
                    id='url-input'
                /><br />
                likes:
                <input
                    data-testid='newLikes'
                    value={newLikes}
                    onChange={event => setNewLikes(event.target.value)}
                    id='likes-input'
                /><br />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm