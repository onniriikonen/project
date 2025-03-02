import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, Typography, Button, Box, TextField } from "@mui/material"
import useFetch from "./useFetch"

// Board structure
interface Board {
    _id: string
    title: string
}

const Board = () => {
    const [newBoardTitle, setNewBoardTitle] = useState("")
    const navigate = useNavigate()

    const { data: boards, loading, error, refetch } = useFetch<Board[]>("http://localhost:8000/boards")

    // Function to create board
    const createBoard = async () => {
        if (!newBoardTitle.trim()) return
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/boards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title: newBoardTitle })
        })
        if (response.ok) {
            setNewBoardTitle("")
            refetch()
        }
    }

    // Function to delete a board    
    const deleteBoard = async (boardId: string) => {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:8000/boards/${boardId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        if (response.ok) refetch()
    }

    if (loading) return <Typography>Loading...</Typography>
    if (error) return <Typography color="error">{error}</Typography>

    return (
      <Box
          sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              width: "100%",
              gap: 2
          }}
      >
          <Typography variant="h4">Your Boards</Typography>

        {/* Input field and button to create a new board */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, maxWidth: "80%" }}>
              <TextField 
                  label="Board Title" 
                  variant="outlined" 
                  value={newBoardTitle} 
                  onChange={e => setNewBoardTitle(e.target.value)} 
                  sx={{ mt: 2, width: "80%", maxWidth: 400 }} 
              />
              <Button variant="contained" onClick={createBoard}>Add Board</Button>
          </Box>
          
          {/* Display list of boards */}
          <Box
              sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 3,
                  width: "100%",
                  mt: 3
              }}
          >
              {boards?.length === 0 ? (
                  <Typography>No boards yet</Typography>
              ) : (
                  boards?.map(board => (
                      <Card key={board._id} sx={{ minWidth: "280px", textAlign: "center", margin: "10px" }}>
                          <CardContent>
                              <Typography variant="h5">{board.title}</Typography>
                              <Button 
                                  variant="contained" 
                                  sx={{ mt: 1 }} 
                                  onClick={() => navigate(`/boards/${board._id}`)}
                              >
                                  Open Board
                              </Button>
                              <Button 
                                  variant="contained" 
                                  color="error" 
                                  sx={{ mt: 1, ml: 2 }} 
                                  onClick={() => deleteBoard(board._id)}
                              >
                                  Delete Board
                              </Button>
                          </CardContent>
                      </Card>
                  ))
              )}
          </Box>
      </Box>
  )
}

export default Board