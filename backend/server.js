import express from 'express'
const app = express()
import cors from 'cors'
const port = 3000
import axios from 'axios'
const apiKey = 'c9bee7d7647733cb8c89907f6ed7c259'
app.use(cors())

app.get('/', async (req, res) => {
   try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`)
    res.json(response.data)
   } catch (err) {
    console.log(`Error occurred: ${err}`);
   } 
})

app.get('/:subpath', async (req, res) => {
    const subpath = req.params.subpath
   try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${subpath}?api_key=${apiKey}`)
    res.json(response.data)
   } catch (err) {
    console.log(`Error occurred: ${err}`);
   } 
})

app.get('/movies/:movieId', async (req, res) => {
    const movieId = req.params.movieId
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
        const response = await axios.get(url)
        res.json(response.data)
    } catch (err){
        console.log(`Error occurred: ${err}`);
    }
})

app.listen(port, (req,res) => {
    console.log(`Server running on port ${port}`);
})
