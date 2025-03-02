import { useState } from "react"
import Item from "./Item"
import { Card, CardContent, Typography, Button, TextField, Box, Modal } from "@mui/material"

// Structure of column props
interface ColumnProps {
    boardId: string
    columnIndex: number
    title: string
    cards: { _id: string; title: string; description: string; position: number }[]
    fetchBoard: () => void
}

const Column = ({ boardId, columnIndex, title, cards, fetchBoard }: ColumnProps) => {
    const [openModal, setOpenModal] = useState(false)
    const [newCardTitle, setNewCardTitle] = useState("")
    const [newCardDescription, setNewCardDescription] = useState("")
    const [editingTitle, setEditingTitle] = useState(false)
    const [newTitle, setNewTitle] = useState(title)
    const token = localStorage.getItem("token")

    // Function to delete a column
    const deleteColumn = async () => {
        if (!token) return
        const response = await fetch(`http://localhost:8000/boards/${boardId}/columns/${columnIndex}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
        })
        if (response.ok) fetchBoard()
    }

    // Function to rename a column
    const renameColumn = async () => {
        if (!newTitle.trim() || !token) return
        const response = await fetch(`http://localhost:8000/boards/${boardId}/columns/${columnIndex}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title: newTitle })
        })
        if (response.ok) {
            fetchBoard()
            setEditingTitle(false)
        }
    }

    // Function to add a card to a column
    const addCard = async () => {
        if (!newCardTitle.trim() || !token) return
        const response = await fetch(`http://localhost:8000/boards/${boardId}/columns/${columnIndex}/cards`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ title: newCardTitle, description: newCardDescription })
        })
        if (response.ok) {
            fetchBoard()
            setNewCardTitle("")
            setNewCardDescription("")
            setOpenModal(false)
        }
    }

    return (
        <Card sx={{ width: 250, backgroundColor: "#e0e0e0", padding: 1 }}>
            <CardContent>

                {/* Editable column title */}
                {editingTitle ? (
                    <TextField 
                        value={newTitle} 
                        onChange={e => setNewTitle(e.target.value)} 
                        onBlur={renameColumn} 
                        onKeyDown={e => e.key === "Enter" && renameColumn()} 
                        autoFocus 
                    />
                ) : (
                    <Typography variant="h6" onClick={() => setEditingTitle(true)}>{title}</Typography> 
                )}

                {/* Display all cards in a column */}
                {cards.map(card => (
                    <Item 
                        key={card._id} 
                        boardId={boardId} 
                        columnIndex={columnIndex} 
                        cardId={card._id} 
                        title={card.title} 
                        description={card.description} 
                        fetchBoard={fetchBoard} 
                    />
                ))}
                
                <Button variant="contained" color="error" onClick={deleteColumn} sx={{ mt: 1 }}>Delete Column</Button>
                <Button variant="contained" onClick={() => setOpenModal(true)}>Add Card</Button>

                {/* Modal for adding a new card */}
                <Modal open={openModal} onClose={() => setOpenModal(false)}>
                    <Box sx={{ width: 300, p: 2, backgroundColor: "white", borderRadius: 2, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <TextField label="Card Title" value={newCardTitle} onChange={e => setNewCardTitle(e.target.value)} sx={{ mb: 2 }} />
                        <TextField label="Card Description" value={newCardDescription} onChange={e => setNewCardDescription(e.target.value)} multiline rows={3} sx={{ mb: 2 }} />
                        <Button variant="contained" onClick={addCard}>Add New Card</Button>
                    </Box>
                </Modal>
            </CardContent>
        </Card>
    )
}

export default Column
