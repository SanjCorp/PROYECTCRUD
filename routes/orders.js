import express from 'express';

export default (Order) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: '❌ Error al obtener órdenes', error });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const newOrder = new Order(req.body);
      await newOrder.save();
      res.status(201).json({ message: '✅ Orden creada', data: newOrder });
    } catch (error) {
      res.status(400).json({ message: '❌ Error al crear orden', error });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ message: '✅ Orden actualizada', data: updated });
    } catch (error) {
      res.status(400).json({ message: '❌ Error al actualizar orden', error });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.json({ message: '🗑️ Orden eliminada' });
    } catch (error) {
      res.status(400).json({ message: '❌ Error al eliminar orden', error });
    }
  });

  return router;
};
