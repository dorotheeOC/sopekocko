const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
        const sauce = req.body;
    if (sauce.like == 1) {
        Sauce.findByIdAndUpdate({_id: req.params.id }, {$inc: {likes: 1}, $addToSet: {usersLiked: sauce.userId}, $pull: {usersDisliked: sauce.userId}})
        .then(() => res.status(200).json({ message: 'Liked !'}))
        .catch(error => res.status(400).json({ error }));

    } else if (sauce.like == -1) {
        Sauce.findByIdAndUpdate({_id: req.params.id }, {$inc: {dislikes: 1}, $addToSet: {usersDisliked: sauce.userId}, $pull: {usersLiked: sauce.userId}})
        .then(() => res.status(200).json({ message: 'disliked !'}))
        .catch(error => res.status(400).json({ error }));

    } else if (sauce.like == 0) {
        Sauce.findOne({_id: req.params.id})/* , {usersLiked: {$exists: true, $in: [sauce.userId]}}); */
        .then((sauceLiked) => {
            for (let i = 0; i < sauceLiked.usersLiked.length; i++) {
                console.log(sauceLiked.usersLiked[i])
                console.log(sauce.userId)
                if(sauceLiked.usersLiked[i] == sauce.userId) {
                    Sauce.findByIdAndUpdate({_id: req.params.id }, {$inc: {likes: -1}, $pull: {usersLiked: sauce.userId}})
                    .then(() => res.status(200).json({ message: 'Like Canceled !'}))
                    .catch(error => res.status(400).json({ error }));
                } 
            }
            for (let i = 0; i < sauceLiked.usersDisliked.length; i++) {
                console.log(sauceLiked.usersDisliked[i])
                if(sauceLiked.usersDisliked[i] == sauce.userId) {
                    Sauce.findByIdAndUpdate({_id: req.params.id }, {$inc: {dislikes: -1}, $pull: {usersDisliked: sauce.userId}})
                    .then(() => res.status(200).json({ message: 'Dislike Canceled !'}))
                    .catch(error => res.status(400).json({ error }));
                } 
            }
        })
        .catch(error => res.status(404).json({ error }));
    }  
};
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a bien été supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
    .catch(error => res.status(500).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}