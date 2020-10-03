import mongoose from 'mongoose';
import {User} from '../api/models/User';
import {Pet} from '../api/models/Pet';
import {Fodder} from '../api/models/Fodder';
import {env} from "../env";

const run = async () => {
    const mongooseConnection = await mongoose.connect(
        `mongodb://${env.db.username}:${env.db.password}@${env.db.host}:${env.db.port}/${env.db.database}`,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }
    )

    try {
        await Fodder.collection.drop();
    } catch (e) {
        console.log(e);
    }

    try {
        await Pet.collection.drop();
    } catch (e) {
        console.log(e);
    }

    try {
        await User.collection.drop();
    } catch (e) {
        console.log(e);
    }

    const users = [
        new User({
            email: "john@ivy.com",
            password: "jonny",
            role: ["admin"],
            profile: {
                firstName: "john",
                lastName: "ivy"
            }
        }),
        new User({
            email: "peter@ivy.com",
            password: "peter",
            role: ["user"],
            profile: {
                firstName: "peter",
                lastName: "ivy"
            }
        })
    ]

    const fodders = [
        new Fodder({
            name: 'friski'
        })
    ]

    const pets = [
        new Pet({
            userId: users[0]._id,
            name: "fufi",
            petType: "cat",
            breed: "siamese",
            currentFodder: fodders[0]._id
        }),
        new Pet({
            userId: users[1]._id,
            name: "max",
            petType: "cat",
            breed: "siamese",
            currentFodder: fodders[0]._id
        })
    ]

    for (const e of fodders) {
        await e.save();
    }

    for (const e of users) {
        await e.save();
    }

    for (const e of pets){
        await e.save()
    }

    mongooseConnection.disconnect();
}

run()
    .then(() => `Finish seeding`);
