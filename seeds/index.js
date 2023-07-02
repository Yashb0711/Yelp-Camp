const mongoose = require('mongoose')
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Database Connected successfully");
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for (let i=0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '64915c0003442ec7095c6e50',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sed autem expedita molestias ipsam quibusdam sint magni, repudiandae cum nulla incidunt dolorem corporis harum modi maiores eius enim repellat commodi officia.',
            price,
            geometry: { lat:cities[random1000].latitude, lng:cities[random1000].longitude },
            images:[
                {
                  url: 'https://res.cloudinary.com/dcdokqlka/image/upload/v1687352395/YelpCamp/w9epu1cmi3he7nqne62k.jpg',
                  filename: 'YelpCamp/w9epu1cmi3he7nqne62k',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})