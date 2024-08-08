import { pool } from '../database/db.js'


const getComment = async (req, res) => {
  try {

    const getComments = await pool.query('SELECT * FROM comment')

    if (getComments.rows.length < 1) {
      res.status(404).send([])
      return
    }

    res.status(200).send(getComments.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}


const getSingleComment = async (req, res) => {
  try {

    const { id } = req.params
    const getSingleComment = await pool.query('SELECT * FROM comment WHERE id = $1', [id])

    if(getSingleComment.rows < 1) {
      res.status(404).send([])
      return
    }

    res.status(200).send(getSingleComment.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}


const postComment = async (req, res) => {
  try {

    const {title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment } = req.body

    const postComment = await pool.query('INSERT INTO comment (title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *', [title, cardid, name, phone, tgid, typeproduct, otherproduct, promotion, typework, target, viewer, effect, description, voiceover, timing, place, technicalspecification, deadline, comment])

    if(postComment.rows < 1) {
      res.status(404).send([])
      return
    }

    res.status(200).json(postComment.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({message: 'ERROR'})
  }
}




export {getComment, getSingleComment, postComment}



