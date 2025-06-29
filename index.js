const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = 3001;
const generateRandomId = () => String(Math.floor(Math.random() * 1000));
app.use(express.json());
app.use(cors());

morgan.token("body", function getRequestBody(req) {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

// const requestLogger = (req, res, next) => {
//     console.log("Method: ", req.method);
//     console.log("Path: ", req.path);
//     req.body && console.log("Body: ", req.body);
//     console.log("-----------");
//     next();
// };

// app.use(requestLogger);

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },

    {
        id: "43",
        name: "Elias Batran",
        number: "034-78-543-7564",
    },
];

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/info", (req, res) => {
    const now = new Date().toString();
    res.write(`<p>Phonebook has info for ${persons.length} people</p>`);
    res.end(`<p>${now}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = persons.find((person) => person.id === id);
    person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    persons = persons.filter((person) => person.id !== id);
    console.log(persons);
    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        const missing = !body.name ? "name" : "number";
        return res.status(400).json({ error: `${missing} missing` });
    } else if (persons.find((person) => person.name === body.name)) {
        return res
            .status(400)
            .json({ error: `${body.name} already exists in the phonebook` });
    }

    const person = {
        id: generateRandomId(),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);

    res.json(persons);
});

const unknownEndpoint = (req, res, next) => {
    console.log("unknown endpoint");
    res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
