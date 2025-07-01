const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
    .connect(url)
    .then((res) => console.log("connected to MongoDB"))
    .catch((error) =>
        console.log("couldn't connect to MongoDB ", error.message)
    );

mongoose.set("toJSON", {
    transform: (document, returenedObject) => {
        returenedObject.id = returenedObject._id.toString();
        delete returenedObject._id;
        delete returenedObject.__v;
    },
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: (v) => /\d{2,3}-\d{5,}/.test(v),
        },
    },
});

module.exports = mongoose.model("Person", personSchema);
