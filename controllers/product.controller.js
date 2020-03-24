var Product = require('../models/product.model');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.product_create = function (req, res) {
    var product = new Product(
        {
            name: req.body.name,
            price: req.body.price
        }
    );

    product.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send(product);
    })
};

exports.product_details = function (req, res, next) {
    Product.findById(req.params.id, function (err, product) {
        if (err) return next(err);
        if(!product) return res.status(404).json({error: 404, description: 'No result found'});
        res.send(product);
    })
};

exports.product_update = function (req, res, next) {
    // Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
    //     if (err) return next(err);
    //     if(!product) return res.status(404).json({error: 404, description: 'No result found'});
    //     res.send(product);
    // });
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        .then(product => {
            return res.send(product)
        })
        .catch(err => {
            res.status(500).json({error: 500, description: err});
        })
};

exports.product_delete = function (req, res, next) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted successfully!');
    })
};

exports.product_list = function (req, res) {
    Product.find().sort({name: 1}).then(products => res.json(products)).catch(err => res.status(400).json({error: 400, description: err}));
};
