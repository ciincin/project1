import "./Profile.css"

function Profile() {

  const user = JSON.parse(localStorage.getItem("user"))

  if(!user){
    return <div>No user data Found</div>
  }

  return (
    <div className="profile-wrapper">
      <h2>User Profile</h2>
      <p>Username: {user.username}</p>
      <p>firstname: {user.firstname}</p>
      <p>lastname: {user.lastname}</p>
      <p>image: {user.image}</p>
      <p>email: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  )
}

export default Profile
