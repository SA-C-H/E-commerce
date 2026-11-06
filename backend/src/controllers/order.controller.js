import * as orderService from '../services/order.service.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/order.validation.js';

export const createOrder = async (req, res, next) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = req.user.id;
    const userDefaultName = req.user.name;

    const result = await orderService.createOrder(userId, userDefaultName, validatedData);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req.user);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = updateOrderStatusSchema.parse(req.body);
    const updated = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

