require('dotenv').config()
import "../addRequire.js"
import express from 'express'
import bodyParser from 'body-parser'
const app = express()
import cors from 'cors'
const port = 3000
import axios from 'axios'
import { MongoClient } from 'mongodb'
import { useParams } from 'react-router'
import jwt from 'jsonwebtoken'
const apiKey = 'c9bee7d7647733cb8c89907f6ed7c259'
app.use(cors())
app.use(bodyParser.json());
const atlasUser = 'aaditya1219'
const atlasPass = 'yvfjJcOwnKwxebBs'
const url = `mongodb+srv://${atlasUser}:${atlasPass}@cluster0.ihtsn6c.mongodb.net/`
var conn = MongoClient.connect(url)

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.post('/login',(req, res) => {
    const formData = req.body
    const user = { name: formData.username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    conn.then((client) => {
        const cursor = client.db('db').collection('users').find({ username: formData.username, password: formData.password })
        cursor.toArray().then((result) => {
            if (result.length === 0) {
                return res.status(400).send('Invalid credentials!');
            }
            return res.json({accessToken: accessToken, message: 'Logged in!'});
        })
    })
})
app.post('/register', (req, res) => {
    const formData = req.body
    console.log(formData);
    conn.then((client) => {
        const cursor = client.db('db').collection('users').find({ username: formData.username })
        cursor.toArray().then((result) => {
            if (result.length !== 0) {
                return res.status(400).send('User already exists!');
            }
            client.db('db').collection('users').insertOne(formData, (err, res) => {
                if (err) {
                    console.log("Error occurred", err);
                    return
                }
            })
            return res.json({message: "Registered!"});
        })
    })
})

// app.get('/api/users', (req, res) => {
//     res.json([{"username": "Kyle", "password": "kyle123"},{"username": "Rahul", "password": "rahul123"}])
// })

app.get('/api/searchMovie/:searchQuery', async (req, res) => {
    const searchQuery = req.params.searchQuery
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`)
        res.json(response.data)
    } catch(err) {
        console.log("Error: ", err)
    }
})
app.post('/api/updateWatchlist', (req, res) => {
    const obj = req.body
    try {
        conn.then(async (client) => {
            await client.db('db').collection('users').updateOne({ username: obj.token }, { $set: { watchlist: obj.watchlist } })
            res.status(200).send("Data received!")
        })
    } catch (err) {
        return res.status(400).send("An error occurred")
    }
})

app.get('/api/getWatchlist/:token', (req, res) => {
    const token = req.params.token
    conn.then((client) => {
        const cursor = client.db('db').collection('users').find({ username: `${token}` })
        cursor.toArray().then((result) => {
            res.json(result[0].watchlist);
        })
    })
})

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
        return res.json(response.data)
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
    } catch (err) {
        console.log(`Error occurred: ${err}`);
    }
})

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
})
