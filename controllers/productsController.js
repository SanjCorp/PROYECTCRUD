const Product = require('../models/product');
const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(2).required(),
  sku: Joi.string().min(3).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().allow('', null),
  weight_g: Joi.number().min(0).allow(null),
  dimensions_cm: Joi.string().allow('', null)
});

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d=>d.message).join(', ') });
    const existing = await Product.findOne({ sku: value.sku });
    if (existing) return res.status(400).json({ error: 'SKU must be unique' });
    const p = new Product(value);
    await p.save();
    res.status(201).json(p);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d=>d.message).join(', ') });
    const product = await Product.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
