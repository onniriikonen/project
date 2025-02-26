import { useState } from "react"
import { useParams } from "react-router-dom"
import { Typography, Box, Button, TextField, Grid2 } from "@mui/material"
import useFetch from "./useFetch"
import Column from "./Column"

interface Board {
    _id: string
    title: string
    columns: {
        _id: string
        title: string
        position: number
        cards: {
            _id: string
            title: string
            description: string
            position: number
        }[]
    }[]
}

const BoardPage = () => {
    const { boardId } = useParams()
    const [newColumnTitle, setNewColumnTitle] = useState("")
    const token = localStorage.getItem("token")
    
    const { data: board, loading, error, refetch } = useFetch<Board>(
        `http://localhost:8000/boards/${boardId}`
    )

    const addColumn = async () => {
        if (!newColumnTitle.trim()) return

        const response = await fetch(
            `http://localhost:8000/boards/${boardId}/columns`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: newColumnTitle })
            }
        )

        if (response.ok) {
            setNewColumnTitle("")
            refetch()
        }
    }

    if (loading) return <Typography>Loading...</Typography>
    if (error) return <Typography color="error">{error}</Typography>
    if (!board) return <Typography>No data available</Typography>

    return (
        <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4">{board.title}</Typography>
            <Box sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    mb: 2 
                }}
            >
            <TextField 
                label="New Column Title" 
                value={newColumnTitle} 
                onChange={e => setNewColumnTitle(e.target.value)} 
                sx={{ m: 2 }} 
            />
            <Button variant="contained" onClick={addColumn}>Add Column</Button>

            </Box>

            <Grid2 container spacing={2} component={"div"}
                sx={{
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                {board.columns.map((column, index) => (
                    <Grid2 key={column._id} component="div"
                >
                        <Column 
                            boardId={boardId!} 
                            columnIndex={index} 
                            title={column.title} 
                            cards={column.cards} 
                            fetchBoard={refetch}
                        />
                    </Grid2>
                ))}
            </Grid2>
        </Box>
        
    )
}

export default BoardPage
