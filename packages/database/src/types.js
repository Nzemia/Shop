"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.PaymentMethod = exports.TrackingStatus = exports.OrderStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["SUPERADMIN"] = "SUPERADMIN";
})(Role || (exports.Role = Role = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["CANCELED"] = "CANCELED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var TrackingStatus;
(function (TrackingStatus) {
    TrackingStatus["PENDING"] = "PENDING";
    TrackingStatus["CONFIRMED"] = "CONFIRMED";
    TrackingStatus["SHIPPED"] = "SHIPPED";
    TrackingStatus["DELIVERED"] = "DELIVERED";
})(TrackingStatus || (exports.TrackingStatus = TrackingStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["MPESA"] = "MPESA";
    PaymentMethod["DOOR_DELIVERY"] = "DOOR_DELIVERY";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
