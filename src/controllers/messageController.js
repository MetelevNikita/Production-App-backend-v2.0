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

    const { name, text, date } = req.body

    console.log(req.body)

    const newMessage = await pool.query('INSERT INTO message (name, text, date) VALUES ($1, $2, $3) RETURNING *', [name, text, date])

    if (newMessage.rows.length < 1) {
      res.status(404).send([])
      return
    }

    console.log(newMessage.rows)
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






export { getMessage, getSingleMessage, postMessage, deleteMessage }


