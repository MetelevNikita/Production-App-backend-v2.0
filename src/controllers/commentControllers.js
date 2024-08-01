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

    const {name, text, date, comment } = req.body
    console.log(req.body)

    const postComment = await pool.query('INSERT INTO comment (name, text, date, comment) VALUES ($1, $2, $3, $4) RETURNING *', [name, text, date, comment])

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



