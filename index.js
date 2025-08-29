import express from "express"
import bodyParser from "body-parser"
import methodOverride from "method-override"
import pg from "pg";

const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride('_method'));

const { Pool } = pg;
const db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "blog",
    password: "13873387",
    port: 5000
})

let respond = [];

app.get("/", async (req, res) => {
    try {
        const data = await db.query("SELECT * FROM blogs ORDER by id");
        respond = data.rows;
        const blogName = respond.map(b => b.title);
        const shortArticle = respond.map(b => b.article);
        const authorList = respond.map(b => b.author)
        const id = respond.map(b => b.id);

        if (blogName.length >= 1) {
            res.locals = {
                id: id,
                title: blogName || [],
                author: authorList || [],
                text: shortArticle || [],
                show: true,
            }
        }
        res.render("home.ejs")
    } catch (error) {
        console.log(error.message)
        res.locals = {
            show: false,
        }
        res.render("home.ejs")
    }
})

app.get("/post/:link", async (req, res) => {
    try {
        let link = parseInt(req.params.link);
        let fullData = respond.find((b) => b.id === link)

        res.render("blog.ejs", {
            title: fullData.title,
            article: fullData.article,
            author: fullData.author,
            show: true
        })
    } catch (error) {
        console.log(error.message)
        res.status(404).render("blog.ejs", {
            error: "The blog is not exist"
        })
    }

})

app.get("/delete/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM blogs WHERE id = $1", [req.params.id])
        res.redirect('/')
    } catch (err) {
        console.error('Error deleting item:', err.message);
        res.status(500).send('Internal server error');
    }
})

app.get("/patch/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const blog = respond.find(b => b.id === id)

    res.render("patch.ejs", {
        id: blog.id,
        title: blog.title,
        article: blog.article,
        author: blog.author
    })
})

app.patch("/patchData/:id", async (req, res) => {
    try {
        let title = req.body.title
        let article = req.body.article
        let author = req.body.author
        await db.query("UPDATE blogs SET title = $1, article = $2, author = $3 WHERE id = $4", [title, article, author, req.params.id])

        res.redirect("/")
    } catch (error) {
        console.log(error.message)
        res.redirect("/")
    }
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs")
})

app.get("/about", (req, res) => {
    res.render("about.ejs")
})

app.get("/compose", (req, res) => {
    res.render("compose.ejs")
})

app.post("/posts", async (req, res) => {
    let title = req.body.title;
    let article = req.body.article;
    let author = req.body.author

    await db.query("INSERT INTO blogs (title, article, author) VALUES ($1, $2, $3)", [title, article, author])

    res.redirect("/")
})

app.listen(port, () => {
    console.log(`The app is running on the port ${port}`)
})
