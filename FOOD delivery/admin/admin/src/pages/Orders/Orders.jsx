import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const response = await axios.get(url + "/api/order/list");
        if (response.data.success) {
            setOrders(response.data.data);
        } else {
            toast.error("Error fetching orders");
        }
    };

    const statusHandler = async (event, orderId) => {
        const response = await axios.post(url + "/api/order/status", {
            orderId,
            status: event.target.value
        });
        if (response.data.success) {
            await fetchAllOrders();
        }
    };

    const removeOrder = async (orderId) => {
        const response = await axios.post(url + "/api/order/remove", { orderId });
        if (response.data.success) {
            toast.success("Order deleted");
            await fetchAllOrders();
        } else {
            toast.error("Error deleting order");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className="order add">
            <h3>Order Page</h3>
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className="order-item">
                        <img src={assets.parcel_icon} alt="" />
                        <div>
                            <p className="order-item-food">
                                {order.items.map((item, idx) => idx === order.items.length - 1 ? `${item.name} x ${item.quantity}` : `${item.name} x ${item.quantity}, `)}
                            </p>
                            <p className="order-item-name">
                                {order.address.firstName + " " + order.address.lastName}
                            </p>
                            <div className="order-item-address">
                                <p>{order.address.street + ","}</p>
                                <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipCode}</p>
                            </div>
                            <p className="order-item-phone">{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>${order.amount}</p>
                        <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                            <option value="Food Processing">Food Processing</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                        <button onClick={() => removeOrder(order._id)} className="delete-btn">x</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;