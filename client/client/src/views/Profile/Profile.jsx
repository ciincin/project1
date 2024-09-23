import "./Profile.css"

function Profile() {

  const user = JSON.parse(localStorage.getItem("user"))

  if(!user){
    return <div>No user data Found</div>
  }

  return (
    <div className="profile-wrapper">
      <h2>Welcome back, {user.username}!</h2>
    </div>
  )
}

export default Profile
