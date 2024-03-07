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
        <>
            <h2>Create New</h2>
            <form onSubmit={addBlog}>
                Title:
                <input
                    value={newTitle}
                    onChange={event => setNewTitle(event.target.value)}
                /><br />
                Author:
                <input
                    value={newAuthor}
                    onChange={event => setNewAuthor(event.target.value)}
                /><br />
                url:
                <input
                    value={newUrl}
                    onChange={event => setNewUrl(event.target.value)}
                /><br />
                likes:
                <input
                    value={newLikes}
                    onChange={event => setNewLikes(event.target.value)}
                /><br />
                <button type="submit">create</button>
            </form>
        </>
    )
}

export default BlogForm