import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const supportService = {
  async createMessage(data: {
    userId: string;
    subject: string;
    message: string;
  }) {
    // Get user details from database
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { username: true, email: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.supportMessage.create({
      data: {
        userId: data.userId,
        email: user.email,
        username: user.username,
        subject: data.subject,
        message: data.message
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
  },

  async getAllMessages(params: {
    page: number;
    limit: number;
    status?: string;
    priority?: string;
  }) {
    const { page, limit, status, priority } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [messages, total] = await Promise.all([
      prisma.supportMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          },
          responses: {
            orderBy: { createdAt: 'asc' }
          }
        }
      }),
      prisma.supportMessage.count({ where })
    ]);

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async getMessageById(id: string) {
    return await prisma.supportMessage.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        responses: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  },

  async addResponse(data: {
    messageId: string;
    adminId: string;
    response: string;
  }) {
    // Get admin details from database
    const admin = await prisma.user.findUnique({
      where: { id: data.adminId },
      select: { username: true }
    });

    if (!admin) {
      throw new Error('Admin not found');
    }

    // Create response and update message status
    const [response] = await Promise.all([
      prisma.supportResponse.create({
        data: {
          messageId: data.messageId,
          adminId: data.adminId,
          adminName: admin.username,
          response: data.response
        }
      }),
      prisma.supportMessage.update({
        where: { id: data.messageId },
        data: {
          status: 'IN_PROGRESS'
        }
      })
    ]);

    return response;
  },

  async updateStatus(id: string, data: { status?: string; priority?: string }) {
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;

    return await prisma.supportMessage.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        responses: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  },

  async markAsRead(id: string) {
    return await prisma.supportMessage.update({
      where: { id },
      data: {
        isRead: true
      }
    });
  },

  async getUserMessages(userId: string) {
    return await prisma.supportMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        responses: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  },

  async getStats() {
    const [total, open, inProgress, resolved, urgent] = await Promise.all([
      prisma.supportMessage.count(),
      prisma.supportMessage.count({ where: { status: 'OPEN' } }),
      prisma.supportMessage.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.supportMessage.count({ where: { status: 'RESOLVED' } }),
      prisma.supportMessage.count({ where: { priority: 'URGENT' } })
    ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      urgent
    };
  }
};