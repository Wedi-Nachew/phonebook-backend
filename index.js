require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const generateRandomId = () => String(Math.floor(Math.random() * 1000));
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token("body", function getRequestBody(req) {
    return JSON.stringify(req.body);
});

// app.use(
//     morgan(
//         ":method :url :status :res[content-length] - :response-time ms :body"
//     )
// );

const requestLogger = (req, res, next) => {
    console.log("Method: ", req.method);
    console.log("Path: ", req.path);
    req.body && console.log("Body: ", req.body);
    console.log("-----------");
    next();
};

app.use(requestLogger);

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

app.get("/api/persons", (req, res, next) => {
    Person.find({})
        .then((savedPeople) => res.json(savedPeople))
        .catch((error) => next(error));
});

app.get("/api/info", (req, res, next) => {
    const now = new Date().toString();
    Person.find({})
        .then((result) => {
            length = result.length;
            res.write(`<p>Phonebook has info for ${length} people</p>`);
            res.end(`<p>${now}</p>`);
        })
        .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id, { new: true, runValidators: true })
        .then((person) => res.json(person))
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then((result) => res.status(204).end())
        .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => res.json(savedPerson))
        .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((person) => {
            console.log(person);
            person.name = req.body.name;
            person.number = req.body.number;

            return person.save().then((updatedPerson) => {
                console.log(updatedPerson);
                res.json(updatedPerson);
            });
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (req, res, next) => {
    res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
    res.status(400).send({ error: error.message });
};

app.use(errorHandler);
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
