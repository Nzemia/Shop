export * from "@prisma/client"

export interface UserWithoutPassword {
    id: string
    email: string
    username: string
    role: Role
    createdAt: Date
    updatedAt: Date
}

export interface OrderWithItems {
    id: string
    orderNumber: string
    userId: string
    totalAmount: number
    status: OrderStatus
    trackingStatus: TrackingStatus
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    phoneNumber: string | null
    shippingAddress: any
    mpesaTransactionId: string | null
    createdAt: Date
    updatedAt: Date
    user: UserWithoutPassword
    orderItems: OrderItemWithProduct[]
}

export interface OrderItemWithProduct {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
    product: Product
}

export interface DashboardStats {
    totalUsers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    recentOrders: OrderWithItems[]
    topProducts: ProductWithStats[]
}

export interface ProductWithStats {
    id: string
    name: string
    price: number
    totalSold: number
    revenue: number
}

import type {
    User,
    Product,
    Order,
    OrderItem,
    SupportMessage,
    Role,
    OrderStatus,
    TrackingStatus,
    PaymentMethod,
    PaymentStatus
} from "@prisma/client"
