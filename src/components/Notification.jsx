const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  else {
    if (type === 'simple') {
      return (
        <div className='notif'>
          {message}
        </div>
      )
    }
    else {
      return (
        <div className='error'>
          {message}
        </div>
      )
    }
  }


}

export default Notification