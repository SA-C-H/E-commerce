import * as productService from '../services/product.service.js';
import {
  createProductSchema,
  updateProductSchema,
  queryProductSchema,
} from '../validations/product.validation.js';

export const getProducts = async (req, res, next) => {
  try {
    const validatedQuery = queryProductSchema.parse(req.query);
    const result = await productService.getAllProducts(validatedQuery);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const validatedData = updateProductSchema.parse(req.body);
    const updated = await productService.updateProduct(req.params.id, validatedData);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (req, res, next) => {
  try {
    // delta : valeur signée (+1 ou -1 par ex.), envoyée par le frontend admin
    const delta = Number(req.body.delta);
    if (!Number.isInteger(delta) || delta === 0) {
      return res.status(400).json({
        success: false,
        message: 'Le champ "delta" doit être un entier non nul (ex: +1 ou -3)',
        details: [],
      });
    }
    const updated = await productService.adjustStock(req.params.id, delta);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

