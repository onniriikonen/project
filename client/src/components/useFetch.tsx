import { useEffect, useState } from "react"

const useFetch = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")
  
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No token found, user not authenticated!")
        }
  
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
  
        const jsonData = await response.json()
        setData(jsonData)
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    };
  
    useEffect(() => {
      fetchData()
    }, [url])
  
    return { data, loading, error, refetch: fetchData }
  }
  
  export default useFetch