import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { body, query, validationResult } from 'express-validator'

interface JWTPayload {
  username: string;
  password: string;
}

const app = express()
app.use(bodyParser.json())
app.use(cors())
const PORT = process.env.PORT || 3000
const SECRET = "SIMPLE_SECRET"
const info = require("./user_info");


app.post("/register", (req, res) => {
  console.log(req.body);
  const { username, password, firstname, lastname, balance } = req.body;
  if (
    username !== undefined &&
    password !== undefined &&
    firstname !== undefined &&
    lastname !== undefined &&
    balance !== undefined
  ){  const newInfo = {
      username : username ,
      password: password,
      firstname: firstname,
      lastname: lastname,
      balance: balance
    };
    info.info.push(newInfo);
    res.status(200).send({ success: true, message: "Register successfully" });
  }else{
    res . status ( 400 ) . send ( {  success : false ,  message: "Username is already in used"  } ) ;
  }
});

app.post('/login',
  (req, res) => {
    const { username, password } = req.body
    // Use username and password to create token.
    const user = info.find(user => user.username === username)
  if (!user) {
    res.status(400)
    res.json({ message: 'Invalid username or password' })
    return
  }
  if (!bcrypt.compareSync(password, user.password)) {
    res.status(400)
    res.json({ message: 'Invalid username or password' })
    return
  }
  const token = jwt.sign({username}) as JWTPayload
    return res.status(200).json({
      message: 'Login succesfully',
      token
    })
  })


app.get("/balance", (req, res) => {
  const token = req.query.token as string
  try {
    const { username } = jwt.verify(token, SECRET) as JWTPayload
    const user = users.find(user => user.username === username)
    res.status(200);
    res.json({"name": username,"balance": user?.balance});
  }
  catch (error) {
    res.status(401);
    res.json({ message: "Invalid token"});
    return
  }
});

app.post('/deposit',body('amount').isInt({ min: 1 }),(req, res) => {
  const token = req.query.token as string
  if (!validationResult(req).isEmpty())
    return res.status(400).json({ message: "Invalid data" })
  try {
    const { username } = jwt.verify(token, SECRET) as JWTPayload
    const user = users.find(user => user.username === username)
    res.status(200);
    res.json({message: "Deposit successfully","balance": 200});
  }
  catch (error) {
    res.status(401);
    res.json({ message: "Invalid token"});
    return
  }
});

app.post('/withdraw',(req, res) => {
  const token = req.headers.authorization
    const amount = req.body.amount
    if(amount<=0){
      if (!validationResult(req).isEmpty())
        return res.status(400).json({ message: "Invalid data" })
      return res.status(400).json({ message: "Invalid data" })
    }
    if (!token) {
      res.status(401)
      res.json({ message: 'Invalid token'})
      return
    }
    const { username } = jwt.verify(token, SECRET) as JWTPayload
    const balance = users.find(user=>user.username===username)?.balance
    const newbalance = balance - amount
    if(newbalance<0){
      res.status(400)
      res.json({
        message:'Invalid data'
      })
      return
    }
    
    res.status(200)
    res.json({ 
      message: 'Withdraw sucessfully',
      balance: newbalance
    })

});

app.delete('/reset', (req, res) => {
  return res.status(200).json({
    message: 'Reset database successfully'
  })
});

app.get("/me", (req, res) => {
  res.status(200).json({
    firstname: "Lakkhanan",
    lastname: "Issara",
    code: "620610805",
    gpa: 2.96
  })
})

app.get('/demo', (req, res) => {
  return res.status(200).json({
    message: 'This message is returned from demo route.'
  })
})
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'test.'
  })
})

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));