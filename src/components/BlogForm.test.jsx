import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const likesInput = container.querySelector('#likes-input')

    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testing a title...')
    await user.type(authorInput, 'testing a author...')
    await user.type(urlInput, 'testing a url...')
    await user.type(likesInput, '1')
    await user.click(sendButton)

    console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a title...')
    expect(createBlog.mock.calls[0][0].author).toBe('testing a author...')
    expect(createBlog.mock.calls[0][0].url).toBe('testing a url...')
    expect(createBlog.mock.calls[0][0].likes).toBe(1)
})