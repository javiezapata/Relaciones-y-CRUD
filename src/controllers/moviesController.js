const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    list: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    new: (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    recomended: (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Generos.findAll()
        .then(function(generos){
            return res.render("moviesAdd", {generos:generos});
        }).catch(err => {
            res.send(err)
        })
    },
    create: function (req,res) {
        const { title, rating, awards, release_date, length } = req.body;
        db.Movie.create({ title, rating, awards, release_date, length })
            .then(() => { res.redirect('/movies') })
    },
    edit: function(req,res) {
        const {id} = req.params
        let pedidoPelicula = db.Movie.findByPk(id)
        let pedidoGeneros = db.Genre.findAll()

        Promise.all([pedidoPelicula, pedidoGeneros])
            .then(([pelicula, generos]) => {
                console.log(generos)
                res.render('moviesEdit', {Movie: pelicula, generos: generos})
            })
            .catch(err=> {
                res.send(err)
            })

    },
    update: function (req,res) {
        const {title, rating, awards, release_date, length, genre_id} = req.body
        db.Movie.update({
            title, rating, awards, release_date,
            length, genre_id
        }, {
            where: {
                id: req.params.id
            }
        })
            .then(result => {
                res.redirect('/movies')
            })
            .catch(err=> {
                res.send(err)
            })
    },
    delete: function (req,res) {

        db.Movie.findByPk(req.params.id)
        .then(movie => {
            res.render('moviesDelete.ejs', {movie});
        });

    },
    destroy: function (req,res) {
        Movies.destroy({
            where: { id: req.params.id}
        })
            res.redirect('/movies');
    }
}

module.exports = moviesController;