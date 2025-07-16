import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { supportService } from '../services/support.service';

export const supportController = {
  // Create a new support message (for clients)
  async createMessage(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return;
      }

      const { subject, message } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' })
        return;
      }

      const supportMessage = await supportService.createMessage({
        userId,
        subject,
        message
      });

      res.status(201).json({
        message: 'Support message created successfully',
        data: supportMessage
      });
    } catch (error) {
      console.error('Error creating support message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get all support messages (admin only)
  async getAllMessages(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, status, priority } = req.query;
      
      const messages = await supportService.getAllMessages({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        priority: priority as string
      });

      res.json({
        message: 'Support messages retrieved successfully',
        data: messages
      });
    } catch (error) {
      console.error('Error fetching support messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get a specific support message with responses (admin only)
  async getMessageById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const message = await supportService.getMessageById(id);
      
      if (!message) {
        res.status(404).json({ message: 'Support message not found' })
          return;
      }

      res.json({
        message: 'Support message retrieved successfully',
        data: message
      });
    } catch (error) {
      console.error('Error fetching support message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Add response to support message (admin only)
  async addResponse(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
          return;
      }

      const { id } = req.params;
      const { response } = req.body;
      const adminId = req.user?.id;

      if (!adminId) {
        res.status(401).json({ message: 'Admin not authenticated' })
          return;
      }

      const supportResponse = await supportService.addResponse({
        messageId: id,
        adminId,
        response
      });

      res.status(201).json({
        message: 'Response added successfully',
        data: supportResponse
      });
    } catch (error) {
      console.error('Error adding response:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Update message status (admin only)
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status, priority } = req.body;

      const updatedMessage = await supportService.updateStatus(id, { status, priority });

      res.json({
        message: 'Support message updated successfully',
        data: updatedMessage
      });
    } catch (error) {
      console.error('Error updating support message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Mark message as read (admin only)
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const updatedMessage = await supportService.markAsRead(id);

      res.json({
        message: 'Message marked as read',
        data: updatedMessage
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get user's own support messages
  async getUserMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'User not authenticated' })
          return;
      }

      const messages = await supportService.getUserMessages(userId);

      res.json({
        message: 'User support messages retrieved successfully',
        data: messages
      });
    } catch (error) {
      console.error('Error fetching user messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get support statistics (admin only)
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await supportService.getStats();

      res.json({
        message: 'Support statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Error fetching support stats:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};