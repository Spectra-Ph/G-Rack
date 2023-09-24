const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/mern-grack", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB")).catch(console.error);

const Gym = require('./models/gym');

app.get('/gym', async (req, res) => {
    const gyms = await Gym.find();

    res.json(gyms);
});

app.post('/gym/new', (req, res) => {
    const gym = new Gym({
        text: req.body.text,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    });

    gym.save();

    res.json(gym);
})

app.delete('/gym/delete/:id', async (req, res) => {
	const result = await Gym.findByIdAndDelete(req.params.id);

	res.json({result});
});

app.listen(3001);
