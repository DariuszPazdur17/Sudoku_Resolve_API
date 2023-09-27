const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


app.use(express.json()) 

const users = []

mongoose.set('strictQuery', false); // Set the strictQuery option

mongoose.connect("mongodb://localhost:27017/mydb", (err) => {
    if (!err) console.log('db connected');
    else console.log('db ', err);
});

app.get('/users' ,(req,res) =>{
    res.json(users)//zapytanie, otrzymywane jest repozytorium w formacie json | query, the repository is received in json format

})

app.use(express.static('public'))//dostep do plikow z folderu public|access to public file folder

app.post('/users',async (req,res) =>{
    try{
        const salt = await bcrypt.genSalt()//tworzenie saltu-ciag znakow zaslaniajce haslo | creating salt-hashing - string of characters hiding the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)//tworzenie zasłonietego hasla | creating hided password
        console.log(salt)
        console.log(hashedPassword)
        const user = { name: req.body.name, password:hashedPassword}// tworzenie ,,nowego" uzytkownika | creating a new user
        users.push(user)// przeslanie danych do zapytania | sending dates to req
        res.status(201).send()//wyswietlenie statutsu | status of action appears 

    }catch {
        res.status(500).send('error')//jestli wystopi blad wyslij | deley with errros
    }
  
})
app.post('/users/login', async (req,res) =>{
    const user =users.find(user =>user.name=req.body.name)//wyszukiwanie danych z bazy, przypisanie danych z requesta do uzytkownika | searching data bases, assigning data from a request to a user
    if(user ==null){
        return res.status(400).send("Cannot find user")//jesli nie znalazlo uzytkownika wyswietl komunikat | if system doesn't find a user => send status info
    }
    try {
       if(await bcrypt.compare(req.body.password, user.password)) {
       res.send("succes")//porównanie haseł | matching passwords
       console.log('succes')
       app.get('/users/login' ,(req,res) =>{
        res.redirect( "http://localhost:3000/index.html");//jeśli autoryzacja się udała przejdz na stronę | if authorization is succes redirect to other site
    
    })
       }
    else{
        res.send('Not allow')
    }
 } catch{
        res.status(500).send()
    }

})

app.listen(3000);//serwer nasłuchuje na 4001 | server 