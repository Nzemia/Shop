export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
}

export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELED = "CANCELED"
}

export enum TrackingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED"
}

export enum PaymentMethod {
    MPESA = "MPESA",
    DOOR_DELIVERY = "DOOR_DELIVERY"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
