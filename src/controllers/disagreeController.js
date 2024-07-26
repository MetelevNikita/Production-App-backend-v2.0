import { pool } from '../database/db.js'


const getDisagreeMessage = async (req, res) => {

  try {

    const allDisagreeMessage = await pool.query('SELECT * FROM disagree')

    if (allDisagreeMessage.rows.length < 1) {
      res.status(404).send([])
      return
    }

    res.status(200).json(allDisagreeMessage.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }

}


const getSingleDisagreeMessage = async (req, res) => {
  try {

    const { id } = req.params

    const singleDisagreeMessage = await pool.query('SELECT * FROM disagree WHERE id = $1', [id])

    if (singleDisagreeMessage.rows.length < 1) {
      res.status(404).send([])
      return
    }

    res.status(200).json(singleDisagreeMessage.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}


const postDisagreeMessage = async (req, res) => {
  try {

    const { name, text, date } = req.body
    const newDisagreeMessage = await pool.query('INSERT INTO disagree (name, text, date) VALUES ($1, $2, $3)', [name, text, date])

    if (newDisagreeMessage.rows.length < 1) {
      res.status(404).send([])
      return
    }

    res.status(200).json(newDisagreeMessage.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})

  }
}


export { getDisagreeMessage, getSingleDisagreeMessage, postDisagreeMessage }