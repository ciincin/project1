import useFetchUserInfo from "../../components/useFetchUserInfo/useFetchUserInfo"
import "./Profile.css"


function Profile() {
  const {userInfo, error, loading} = useFetchUserInfo()

  if (loading){
    return <div>Loading...</div>
  }

  if (error){
    return <div>{error}</div>
  }

  if (!userInfo){
    return <div>No user data found</div>
  }

  return (
    <div className="profile-wrapper">
     {userInfo && <h2>Welcome back, {userInfo.username}!</h2>}
    </div>
  )
}

export default Profile
