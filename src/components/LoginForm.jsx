import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = (event) => {
        event.preventDefault()
        handleSubmit(username, password)
    }

    return (
        <div>
            <h2>Log into application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        data-testid='username'
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                        name="username"
                    />
                </div>
                <div>
                    password
                    <input
                        data-testid='password'
                        type="password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
}

export default LoginForm