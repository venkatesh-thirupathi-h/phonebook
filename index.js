const express = require("express");
const morgan = require("morgan");


const MILLION = 1_000_000;
const app = express();
app.use(express.json())
// morgan.token('body', (req, res) => {
//     return JSON.stringify(req.body);
// })
// app.use(morgan('tiny'));
// app.use(morgan(':body'));
let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (req, res) => {
    res.json(persons);
});


app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(422).send({error: "incorrect repr of person object"})
    }
    const nameAlreadyPresent = persons.find(p => p.name === body.name);
    if (nameAlreadyPresent) {
        return res.status(409).send({error: "name must be unique"});
    }
    const id = Math.floor(Math.random() * MILLION)
    const newPerson = {...body, id};
    console.log('new created obj', newPerson);
    persons.push(newPerson);
    console.log('persons obj', persons);
    res.send(newPerson)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (!person) {
        return res.status(404).send({error: `${id} not found`})
    }
    const newPersons = persons.filter(p => p.id !== id);
    console.log(newPersons);
    persons = newPersons;
    res.json(person)
    console.log('dead code')
    return res.status(204)
});


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
}


// const requestLogger = (request, res, next) => {
//   console.log('method:', request.method);
//   console.log('path:', request.path);
//   console.log('body:', request.body);
//   console.log('---');
//   next()
// }

// app.use(requestLogger);

app.get("/info", (req, res) => {
    const response = `<p>Phonebook has ${persons.length} contacts</p>
                 ${new Date()}`
    res.send(response);
})

const PORT = 3000
app.listen(PORT);
console.log('listening on port', PORT)

app.use(unknownEndpoint);
