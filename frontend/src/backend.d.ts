import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Order {
    status: OrderStatus;
    deliveryAddress: string;
    createdAt: Time;
    orderId: string;
    totalAmountCents: bigint;
    items: Array<OrderItem>;
    buyerName: string;
}
export interface Product {
    id: string;
    stockQuantity: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    category: string;
    priceCents: bigint;
}
export interface OrderItem {
    productId: string;
    quantity: bigint;
}
export enum OrderStatus {
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getOrder(orderId: string): Promise<Order>;
    getProduct(productId: string): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    placeOrder(buyerName: string, deliveryAddress: string, items: Array<OrderItem>): Promise<string>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
}
