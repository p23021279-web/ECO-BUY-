const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering and search
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category && category !== 'All Categories') {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sellerName: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('seller', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error while fetching products' });
  }
});

// Get user's products
router.get('/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({ error: 'Server error while fetching your products' });
  }
});

// Create product
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, price, imageUrl } = req.body;

    // Validation
    if (!title || !description || !category || !price) {
      return res.status(400).json({ error: 'All fields except image URL are required' });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    const product = new Product({
      title,
      description,
      category,
      price: parseFloat(price),
      imageUrl: imageUrl || 'https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg',
      seller: req.user._id,
      sellerName: req.user.username
    });

    await product.save();
    await product.populate('seller', 'username');

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error while creating product' });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, price, imageUrl } = req.body;
    
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = parseFloat(price);
    if (imageUrl !== undefined) product.imageUrl = imageUrl || 'https://images.pexels.com/photos/3829227/pexels-photo-3829227.jpeg';

    await product.save();
    await product.populate('seller', 'username');

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error while updating product' });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      seller: req.user._id
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found or unauthorized' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
});

module.exports = router;