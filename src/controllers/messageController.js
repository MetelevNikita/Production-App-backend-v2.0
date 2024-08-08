import { pool } from '../database/db.js'


const getMessage = async (req, res) => {
  try {
    const messages = await pool.query('SELECT * FROM message')

    if (messages.rows.length < 1) {
      res.status(404).send([])
      return

    }
    res.status(200).json(messages.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}


const getSingleMessage = async (req, res) => {
  try {

    const { id } = req.params
    const message = await pool.query('SELECT * FROM message WHERE id = $1', [id])

    if (!message.rows) {
      res.status(404).send([])
      return
    }

    res.status(200).json(message.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})

  }
}


const postMessage = async (req, res) => {
  try {

    const {title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment } = req.body

    const newMessage = await pool.query('INSERT INTO message (title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *', [title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment])

    if (newMessage.rows.length < 1) {
      res.status(404).send([])
      return
    }
    res.status(200).json(newMessage.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})

  }
}


const deleteMessage = async (req, res) => {
    try {

    const { id } = req.params

    const deleteMessage = pool.query('DELETE FROM message WHERE id = $1', [id])

    if (!deleteMessage.rows) {
      res.status(404).send([])
      return
    }

    res.status(200).json(deleteMessage)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})

  }
}


const updateMessage = async (req, res) => {
  try {

    const { id } = req.params
    const { title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment } = req.body

    const updateMessage = await pool.query('UPDATE message SET title = $1, cardid = $2, name = $3, phone = $4, tgid = $5, typeproduct = $6, otherproduct = $7, promotion = $8, typework = $9, target = $10, viewer = $11, effect = $12, description = $13, voiceover = $14, timing = $15, place = $16, technicalspecification = $17, deadline = $18, comment = $19 WHERE id = $20', [title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment, id])

    if (!updateMessage.rows) {
      res.status(404).send([])
      return
    }

    res.status(200).json(updateMessage)

  } catch (error) {
    console.error(error)

}

}






export { getMessage, getSingleMessage, postMessage, deleteMessage, updateMessage }


