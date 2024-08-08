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

    const {title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment } = req.body

    const newAreeMessage = await pool.query('INSERT INTO agree (title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *', [title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment])

    if (!newAreeMessage.rows) {
      res.status(404).json({message: 'message not cerate'})
      return
    }

    res.status(200).json(newAreeMessage.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}


export { getAgreeMessage, getSingleAgreeMessage, postAgreeMessage }