import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import Blogs from '../services/blogs'

test('renders blog', () => {
    const blog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5
    }

    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
        'Go To Statement Considered Harmful'
    )
})

test('clicking the button calls show', async () => {
    const blog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5
    }

    const mockHandler = vi.fn()

    const { container } = render(
        <Blog blog={blog} toggleImportance={mockHandler} />
    )
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
        'Go To Statement Considered Harmful'
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)


    expect(div).toHaveTextContent(
        'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf'
    )
    expect(div).toHaveTextContent(
        'Edsger W. Dijkstra'
    )
    expect(div).toHaveTextContent(
        'likes 5'
    )
})

test('like button is clicked twice', async () => {
    const blog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5
    }

    const mockHandler = vi.fn()

    render(
        <Blog blog={blog} toggleLike={mockHandler} />
    )


    const user = userEvent.setup()
    const buttonView = screen.getByText('view')
    await user.click(buttonView)

    const buttonLike = screen.getByText('like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(mockHandler.mock.calls).toHaveLength(2)

})