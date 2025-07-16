import { body, param } from 'express-validator';

export const supportValidators = {
  createMessage: [
    body('subject')
      .notEmpty()
      .withMessage('Subject is required')
      .isLength({ min: 5, max: 200 })
      .withMessage('Subject must be between 5 and 200 characters'),
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Message must be between 10 and 2000 characters')
  ],

  addResponse: [
    param('id')
      .isString()
      .notEmpty()
      .withMessage('Message ID is required'),
    body('response')
      .notEmpty()
      .withMessage('Response is required')
      .isLength({ min: 5, max: 2000 })
      .withMessage('Response must be between 5 and 2000 characters')
  ],

  updateStatus: [
    param('id')
      .isString()
      .notEmpty()
      .withMessage('Message ID is required'),
    body('status')
      .optional()
      .isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
      .withMessage('Invalid priority')
  ],

  messageId: [
    param('id')
      .isString()
      .notEmpty()
      .withMessage('Message ID is required')
  ]
};