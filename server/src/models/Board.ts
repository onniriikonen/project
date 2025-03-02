import mongoose, { Schema, Document } from "mongoose"

// Card inside a columd
interface ICard {
  title: string
  description?: string
  position: number
  createdAt: Date
  _id: mongoose.Types.ObjectId
}


// Column inside a board
interface IColumn {
  title: string
  position: number
  cards: ICard[]
}


// Board document in MongoDB
interface IBoard extends Document {
  userId: string
  title: string
  columns: IColumn[]
  createdAt: Date
}

const CardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  description: { type: String },
  position: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
})

const ColumnSchema = new Schema<IColumn>({
  title: { type: String, required: true },
  position: { type: Number, required: true },
  cards: [CardSchema],
})

const BoardSchema = new Schema<IBoard>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  columns: [ColumnSchema],
  createdAt: { type: Date, default: Date.now },
})

const Board: mongoose.Model<IBoard> = mongoose.model<IBoard>("Board", BoardSchema)

export default Board
