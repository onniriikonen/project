import { Card, CardContent, Typography, Button, Box } from "@mui/material"


// Structure of item props
interface ItemProps {
    boardId: string
    columnIndex: number
    cardId: string
    title: string
    description?: string
    color?: string
    tags?: string[]
    fetchBoard: () => void
}

const Item = ({ boardId, columnIndex, cardId, title, description, fetchBoard }: ItemProps) => {

    // Function to move the card up or down within the column
    const moveCard = async (direction: "up" | "down") => {
        const token = localStorage.getItem("token")
        if (!token) return
        const response = await fetch(
            `http://localhost:8000/boards/${boardId}/columns/${columnIndex}/cards/${cardId}/move`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ direction })
            }
        )
        if (response.ok) fetchBoard()
    }


    // Function to delete a card
    const deleteCard = async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        const response = await fetch(
            `http://localhost:8000/boards/${boardId}/columns/${columnIndex}/cards/${cardId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            }
        )
        if (response.ok) fetchBoard()
    }

    return (
        <Card sx={{ marginBottom: 1, padding: 1, backgroundColor: "white" }}>
            <CardContent>

                {/* Display card content */}
                <Typography variant="h6">{title}</Typography>
                {description && <Typography variant="body2">{description}</Typography>}

                {/* Buttons for moving the card up or down */}
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button variant="outlined" size="small" onClick={() => moveCard("up")}>⬆️</Button>
                    <Button variant="outlined" size="small" onClick={() => moveCard("down")}>⬇️</Button>
                </Box>
                
                <Button variant="contained" color="error" onClick={deleteCard} sx={{ mt: 1 }}>Delete Card</Button>
            </CardContent>
        </Card>
    )
}

export default Item
