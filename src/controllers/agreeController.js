import { pool } from '../database/db.js'


const getAgreeMessage = async (req, res) => {
  try {

    const getAllAgree = await pool.query('SELECT * FROM agree')

    if (getAllAgree.rows.length < 0) {
      res.status(404).send([])
      return
    }

    res.status(200).json(getAllAgree.rows)


  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}


const getSingleAgreeMessage = async (req, res) => {
  try {

    const { id } = req.params

    const getSingleAgree = await pool.query('SELECT * FROM agree WHERE id = $1', [id])

    if (!getSingleAgree.rows) {
      res.status(404).send([])
      return
    }

    res.status(200).json(getSingleAgree.rows)


  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }

}


const postAgreeMessage = async (req, res) => {
  try {

    const { name, text, date } = req.body
    const newAreeMessage = await pool.query('INSERT INTO agree (name, text, date) VALUES ($1, $2, $3)', [name, text, date])

    if (!newAreeMessage.rows) {
      res.status(404).json({message: 'message cerate'})
      return
    }

    res.status(200).send(newAreeMessage.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}


export { getAgreeMessage, getSingleAgreeMessage, postAgreeMessage }