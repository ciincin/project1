import { useEffect, useState } from "react";

function useFetchUserInfo() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("http://localhost:3000/myinfo", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data.decoded);
        } else {
          const errorData = await response.json();
          setError(`no user data found ${errorData.msg}`);
        }
      } catch (error) {
        setError(`Error fetching user info: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  return { userInfo, error, loading };
}

export default useFetchUserInfo;
