export enum OrderStatus {
    PENDING = 'pending',
    PAID = 'paid',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
}

export enum ShippingType {
    STANDARD = 0,
    EXPRESS = 20,
    PRIORITY = 30,
}