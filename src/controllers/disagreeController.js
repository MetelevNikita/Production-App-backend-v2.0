import { pool } from '../database/db.js'


const getDisagreeMessage = async (req, res) => {

  try {

    const allDisagreeMessage = await pool.query('SELECT * FROM disagree')

    if (allDisagreeMessage.rows.length < 1) {
      res.status(404).send([])
      return
    }

    res.status(200).send(allDisagreeMessage.rows)

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

    const {title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment } = req.body

    const newDisagreeMessage = await pool.query('INSERT INTO disagree (title, cardid, name, phone, tgId, typeProduct, otherProduct, promotion, typeWork, target, viewer, effect, description, voiceover, timing, place, technicalSpecification, deadline, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *', [title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment])

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