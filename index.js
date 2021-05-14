const mongoose = require('mongoose')
const app = require('express')()
const User = require('./models/User')
const Question = require('./models/Question')
const cors = require('cors')
const Tag = require('./models/Tag')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const dateformat = require('dateformat')


const bodyParser = require('body-parser');

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/users/:profile', async (req, res) => {
    const user = await User.findOne({ index: req.params.profile }).lean()
    user ? res.send(user).status(200) : res.sendStatus(501)
})

async function main() {

    let register_token = Math.round(Math.random() * 1000000)

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eugenemedvedevbelarus@gmail.com',
            pass: 'Zhenyarulit1'
        }
    });

    let mailOpt = {
        from: 'eugenemedvedevbelarus@gmail.com',
        to: 'eugenemedvedevbelarus@gmail.com',
        subject: "Автоматическая рассылка vataga.by",
        html: `
            <div style="width: auto;
            height: auto;
            background: #656565;
            border-radius: 20px;
            padding: 1rem;
            color: white;"
            >
                <h1 style="width:100%">Привет! Спасибо за регистрацию на сайте <a style="text-decoration: none; color: white" target="_blank" href="vataga.by">Vataga.by</a></h1>
                <br/>
                <h2 style="width:100%">Твой токен для подтверждения регистрации: <span style="color: blue">${register_token}</span></h2>
                <br/>
                <h2 style="width:100%"><span style="text-decoration: underline">Внимание!</span> Никому не сообщайте свой регистрационный код во время регистрации, иначе к вашему аккаунту могут олучить доступ злоумышленники</h2>
            </div>
        `
    }

    transporter.sendMail(mailOpt, (e, info) => {
        if (e) {
            console.log(e)
        } else {
            console.log(info.response)
        }
    })

}

//   main().catch(console.error);

const isAuth = (req, res, next) => {
    const token = (JSON.parse(req.cookies.userInfo)).token
    if (token) {
      const onlyToken = token
      jwt.verify(onlyToken, "secretkey-secretkey-secretkey", (err, decode) => {
        if (err) {
          return res.status(401).send({ message: 'Invalid Token' });
        }
        req.user = decode;
        next();
        return;
      });
    } else {
      return res.status(401).send({ message: 'Token is not supplied.' });
    }
  };

app.get('/', isAuth, (req, res) => {
    res.send('aaaaaaaaaaaaaaaa')
})

app.post('/api/question/add', async(req, res) => {
    let date = dateformat(new Date(), 'dd-mm-yyyy в HH:MM:ss')
    const count = (await Question.find({})).length
    const question = new Question({
        title: req.body.title,
        text: req.body.text, 
        creator: req.body.creator,
        answers: req.body.answers,
        tags: req.body.tags,
        timestamp: date,
        index: 1 + count
    })
    try {
        question.save()
        res.json('all is ok')
    } catch (error) {
        console.log(error.message)
    }
})

app.get('/api/question/:id', async(req, res) => {
    const question = await Question.findOne({_id: req.params.id})
    question ? res.send(question) : res.status(404).send('Такого вопроса не существует')
})

app.post('/api/add-tag', async (req, res) => {
    const count = (await Tag.find({})).length
    const candidate = await Tag.findOne({name: req.body.name})
    if (candidate) {
        res.send("Такой тег уже существует")
    }
    const tag = new Tag({
        name: req.body.name,
        index: 1 + count,
        university: req.body.university,
        type: req.body.type
    })
    try {
        tag.save()
        res.send(tag)
    } catch (error) {
        console.log(error.message)
    }
})

// app.post('/api/add-')

app.get('/api/questions', async(req, res) => {
    console.log(req.query)
    let count = (await Question.find({})).length
    let tags = (await Tag.find({}).sort({name: 1}))
    console.log(count)
    let questions
    switch (req.query.sort) {
        case "1" : 
            // if (!req.query.page == false) {
            questions = await Question.find({})
            
            .skip(10*((Number(req.query.page) <= 0 ? 0 : req.query.page - 1)))
            .sort({timestamp: -1})
            .limit(10)
            console.log(Number(req.query.sort), Number(req.query.page))
            console.log('Выполнилась первая сортировка')
            // } else questions = await Question.find({}).sort({timestamp: 1}).limit(5)

            break
        case "2" : 
            questions = await Question.find({})
            .sort({timestamp: 1})
            .skip(10*((Number(req.query.page) <= 0 ? 0 : req.query.page - 1)))
            .limit(10)
            console.log("Выполнилась вторая сортировка")
            break
        // default: questions = await Question.find({})
        // .skip(10*((Number(req.query.page) <= 0 ? 0 : req.query.page - 1)))
        // .limit(10)
        // console.log('!!!')
        
        // break
    }
    res.send({questions, count, tags})
})

// app.get('/api/questions/sort/:id', async(req, res) => {
//     console.log(req.params.id)
//     let questions
//     switch (req.params.id) {
//         case "1" : 
//             questions = await Question.find({}).sort({timestamp: 1}).limit(2)
//             console.log(questions);
//             break
//         case "2" : 
//             questions = await Question.find({}).sort({timestamp: -1}).limit(2)
//             console.log(questions)
//             break
        
//     }
//     res.send(questions)
// })

app.post('/register', async (req, res) => {
    let candiate = await User.findOne({ userEmail: req.body.userEmail })
    if (candiate) {
        res.status(400)
            .send("User is already exist")
    }

    let index = (await User.find()).length

    const user = new User({
        userName: req.body.userName,
        userSurname: req.body.userSurname,
        userEmail: req.body.userEmail,
        userPassword: req.body.userPassword,
        index: 1 + index
    })
    try {
        user.save()

        res.json({message: 'Пользователь успешно создан'}).status(200)
    } catch (error) {
        console.log(error)
        res.send("Ошибка создания пользователя")
    }
})

app.get("/login", isAuth, (req, res) => {
    console.log(req)
    res.end()
})

app.post('/login',   async (req, res) => {
    const candidate = await User.findOne({userEmail: req.body.userEmail, userPassword: req.body.userPassword}).lean()
    if (candidate != null) {
        const userData = await User.findOne({ userEmail: req.body.userEmail }).lean()
        const user = {
            id: userData.index,
            username: userData.userName,
            usersurname: userData.userSurname,
            useremail: userData.userEmail
        }
        jwt.sign({ user }, "secretkey-secretkey-secretkey", {expiresIn: '8766h'},(err, token) => {
            res.json({
                id: user.id,
                userName: user.username,
                userEmail: user.userEmail,
                userSurname: user.usersurname,
                token
            })
        })
    } else {
        res.status(400)
        .send('Invalid password or email')
    }
})

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.1amwy.mongodb.net/vataga?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        ).then(() => console.log('Mongo connected'))
            .catch(e => console.log(e))
        app.listen(3001, () => {
            console.log(`Server has been started on port 3000`)
        })
    } catch (error) {
        console.log(error)
    }
}


start()