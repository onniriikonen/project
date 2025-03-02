"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Board_1 = __importDefault(require("../models/Board"));
const validateToken_1 = require("../middleware/validateToken");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
// Create a new board
router.post('/', validateToken_1.validateToken, async (req, res) => {
    try {
        const newBoard = new Board_1.default({
            userId: req.user?._id,
            title: req.body.title,
            columns: []
        });
        await newBoard.save();
        res.status(201).json(newBoard);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating board' });
    }
});
// Fetch all boards belonging to the authenticated user
router.get('/', validateToken_1.validateToken, async (req, res) => {
    try {
        const boards = await Board_1.default.find({ userId: req.user?._id });
        res.status(200).json(boards);
    }
    catch {
        res.status(500).json({ message: 'Error fetching boards' });
    }
});
// Fetch a specific board
router.get('/:boardId', validateToken_1.validateToken, async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const board = await Board_1.default.findOne({ _id: req.params.boardId, userId: req.user?._id });
        if (!board)
            return res.status(404).json({ message: 'Board not found' });
        res.status(200).json(board);
    }
    catch {
        res.status(500).json({ message: 'Error fetching board' });
    }
});
// Delete a board
router.delete('/:boardId', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.default.findOneAndDelete({ _id: req.params.boardId, userId: req.user?._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        res.status(200).json({ message: 'Board deleted successfully' });
    }
    catch {
        res.status(500).json({ message: 'Error deleting board' });
    }
});
// Add a column to a board
router.post('/:boardId/columns', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.default.findOne({ _id: req.params.boardId, userId: req.user?._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        board.columns.push({ title: req.body.title, position: board.columns.length, cards: [] });
        await board.save();
        res.status(201).json(board);
    }
    catch {
        res.status(500).json({ message: 'Error adding column' });
    }
});
// Rename a column
router.put('/:boardId/columns/:columnIndex', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.default.findOne({ _id: req.params.boardId, userId: req.user?._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        const columnIndex = parseInt(req.params.columnIndex);
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= board.columns.length) {
            res.status(400).json({ message: 'Invalid column index' });
            return;
        }
        board.columns[columnIndex].title = req.body.title;
        await board.save();
        res.status(200).json(board);
    }
    catch {
        res.status(500).json({ message: 'Error renaming column' });
    }
});
// Delete a column from a board
router.delete('/:boardId/columns/:columnIndex', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.default.findOne({ _id: req.params.boardId, userId: req.user?._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        const columnIndex = parseInt(req.params.columnIndex);
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= board.columns.length) {
            res.status(400).json({ message: 'Invalid column index' });
            return;
        }
        board.columns.splice(columnIndex, 1);
        await board.save();
        res.status(200).json(board);
    }
    catch {
        res.status(500).json({ message: 'Error deleting column' });
    }
});
// Add a card to a column
router.post('/:boardId/columns/:columnIndex/cards', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.default.findOne({ _id: req.params.boardId, userId: req.user?._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        const columnIndex = parseInt(req.params.columnIndex);
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= board.columns.length) {
            res.status(400).json({ message: 'Invalid column index' });
            return;
        }
        const newCard = {
            _id: new mongoose_1.default.Types.ObjectId(),
            title: req.body.title,
            description: req.body.description || '',
            position: board.columns[columnIndex].cards.length,
            createdAt: new Date(),
        };
        board.columns[columnIndex].cards.push(newCard);
        await board.save();
        res.status(201).json(board);
    }
    catch {
        res.status(500).json({ message: 'Error adding card' });
    }
});
// Delete a card
router.delete('/:boardId/columns/:columnIndex/cards/:cardId', validateToken_1.validateToken, async (req, res) => {
    try {
        const board = await Board_1.default.findOne({ _id: req.params.boardId, userId: req.user?._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        const columnIndex = parseInt(req.params.columnIndex);
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= board.columns.length) {
            res.status(400).json({ message: 'Invalid column index' });
            return;
        }
        const column = board.columns[columnIndex];
        const cardIndex = column.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: 'Card not found' });
            return;
        }
        column.cards.splice(cardIndex, 1);
        await board.save();
        res.status(200).json(board);
    }
    catch {
        res.status(500).json({ message: 'Error deleting card' });
    }
});
// Move a card inside a column
router.put('/:boardId/columns/:columnIndex/cards/:cardId/move', validateToken_1.validateToken, async (req, res) => {
    try {
        const { direction } = req.body;
        const board = await Board_1.default.findOne({ _id: req.params.boardId, userId: req.user?._id });
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        const columnIndex = parseInt(req.params.columnIndex);
        if (isNaN(columnIndex) || columnIndex < 0 || columnIndex >= board.columns.length) {
            res.status(400).json({ message: 'Invalid column index' });
            return;
        }
        const column = board.columns[columnIndex];
        const cardIndex = column.cards.findIndex(card => card._id.toString() === req.params.cardId);
        if (cardIndex === -1) {
            res.status(404).json({ message: 'Card not found' });
            return;
        }
        if (direction === "up" && cardIndex > 0) {
            [column.cards[cardIndex], column.cards[cardIndex - 1]] = [column.cards[cardIndex - 1], column.cards[cardIndex]];
        }
        else if (direction === "down" && cardIndex < column.cards.length - 1) {
            [column.cards[cardIndex], column.cards[cardIndex + 1]] = [column.cards[cardIndex + 1], column.cards[cardIndex]];
        }
        else {
            res.status(400).json({ message: 'Invalid move operation' });
            return;
        }
        await board.save();
        res.status(200).json(board);
    }
    catch {
        res.status(500).json({ message: 'Error moving card' });
    }
});
exports.default = router;
