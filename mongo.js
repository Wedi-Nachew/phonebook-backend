const mongoose = require("mongoose");
const { Schema, model } = mongoose;

if (process.argv.length < 3) {
    console.log("Please provide a password as an argument");
    process.exit(1);
}
const password = process.argv[2];
let name = null;
let number = null;
const url = `mongodb+srv://wedi-nachew:${password}@cluster0.or84efx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
    .connect(url)
    .then(() => {
        const personSchema = new Schema({
            name: String,
            number: String,
        });

        const Person = model("Person", personSchema);

        if (process.argv[3]) name = process.argv[3];
        if (process.argv[4]) number = process.argv[4];

        if (process.argv.length === 3) {
            return Person.find({})
                .then((result) => {
                    result.length !== 0
                        ? result.forEach((person) =>
                              console.log(
                                  `name: ${person.name} number: ${person.number}`
                              )
                          )
                        : console.log("The phonebook database is empty");
                })
                .catch((error) => console.log("Fetching error", error));
        } else if (name && number) {
            const person = new Person({ name, number });

            return person
                .save()
                .then((result) =>
                    console.log(
                        `added ${result.name} number ${result.number} to phonebook`
                    )
                )
                .catch((error) => console.lgo("saving error: ", error));
        } else {
            const missing = name ? "number" : "name";
            console.log(`${missing} is missing`);
            process.exit(1);
        }
    })
    .then(() => {
        mongoose.connection.close();
    })
    .then(() => console.log("connection closed"))
    .catch((error) => console.log("Error: ", error));
