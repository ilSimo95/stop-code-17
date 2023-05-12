const express = require("express")
const bp = require("body-parser")
const app = express()
const queue = require("./queue.js")
let persone = queue.persone;

const isString = (s) => typeof s === "string"

app.use(bp.json())


// GET lista
app.get("/list", (req, res) => {
    const ordinamento = req.query.orderBy
    if(!ordinamento){
        res.json({queue: persone, count: persone.length})
    }
    else {
        if(ordinamento != "nome" && ordinamento != "cognome"){
            res.status(400).json({error: "L'ordinamento è previsto solo per nome e cognome"})
            return
        }
        else if (ordinamento == "nome") {
            res.json({queue: persone.sort((a, b) => a.nome.localeCompare(b.nome)), count: persone.length})
        }
        else {
            res.json({queue: persone.sort((a, b) => a.cognome.localeCompare(b.cognome)), count: persone.length})
        }
    }
})


// POST
app.post("/add", (req, res) => {
    const p = req.body
    if(persone.length>=10){
        res.status(400).json({error: "Coda piena. Non è possibile accettare altre prenotazioni"})
        return
    }
    else if (!isString(p.nome) || !isString(p.cognome)) {
        res.status(400).json({error: "Formato persona non valido"})
        return
    }
    else if (Object.keys(p).length == 2 && p.nome && p.cognome) {
        persone.push(p)
        res.json({message: "Prenotazione effettuata correttamente"})
        res.status(201).end()
    }
    else {
        res.status(400).json({error: "Una persona deve avere solo un nome e un cognome"})
        return
    }
})


// DELETE
app.delete("/serve", (req, res) => {
    if (persone.length > 0) {
        persone.shift()
        res.json({message: "Persona servita correttamente"})
    }
    else {
        res.json({message: "Coda vuota"})
    }
})


// GET (shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

app.get("/shuffle", (req, res) => {
    shuffleArray(persone)
    res.json({queue:persone})
})


// CLOSE server
app.get("/close", (req, res) => {
    res.json({message: "Persone non servite " + persone.length})
    server.close()
})


// START server
var server = app.listen(3000, () => { console.log("SERVER STARTED") })