const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary') 
const axios = require('axios');
const campground = require('../models/campground');


module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req,res,next)=>{
    const campground = new Campground(req.body.campground);
    // Geocoding API request
  try {
    const encodedAddress = encodeURIComponent(req.body.campground.location);
    const apiKey = process.env.HERE_KEY;
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodedAddress}&apiKey=${apiKey}`;
    
    const response = await axios.get(url);

    // Extract latitude and longitude from the response
    
    // console.log('Latitude:', lat);
    // console.log('Longitude:', lng);
    // res.send(response.data.items[0])
    // res.send("It worked?")
    campground.geometry = response.data.items[0].position;
    // // Save the campground and handle other operations
    // campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // campground.author = req.user._id;
    // await campground.save();

    // req.flash('success', 'Successfully created a new camp');
    // res.redirect(`/campgrounds/${campground._id}`);
  } catch (error) {
    // Handle error
    console.error('Error geocoding:', error);
    next(error);
  }

    campground.images = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully created a new camp')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'No campground found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'No campground found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground})
}

module.exports.updateCampground = async (req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    const imgs = req.files.map(f=>({url:f.path,filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Deleted a campground successfully')
    res.redirect('/campgrounds')
}