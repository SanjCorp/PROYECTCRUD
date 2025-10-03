const Order = require('../models/order');
const Product = require('../models/product');
const Joi = require('joi');

const orderSchema = Joi.object({
  orderNumber: Joi.string().min(3).required(),
  customerName: Joi.string().min(2).required(),
  items: Joi.array().items(
    Joi.object({ product: Joi.string().required(), quantity: Joi.number().integer().min(1).required() })
  ).min(1).required(),
  status: Joi.string().valid('pending','processing','shipped','delivered','cancelled')
});

exports.getAll = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('items.product');
    res.json(orders);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d=>d.message).join(', ') });

    let subtotal = 0;
    for (const it of value.items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ error: `Product ${it.product} not found` });
      if (p.stock < it.quantity) return res.status(400).json({ error: `Not enough stock for ${p.name}` });
      subtotal += p.price * it.quantity;
    }
    const tax = +(subtotal * 0.13).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const order = new Order({ ...value, subtotal, tax, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = orderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d=>d.message).join(', ') });

    let subtotal = 0;
    for (const it of value.items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ error: `Product ${it.product} not found` });
      subtotal += p.price * it.quantity;
    }
    const tax = +(subtotal * 0.13).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const order = await Order.findByIdAndUpdate(req.params.id, { ...value, subtotal, tax, total }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) { next(err); }
};
