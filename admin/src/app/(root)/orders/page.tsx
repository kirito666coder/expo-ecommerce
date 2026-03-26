'use client';
import { useFetch } from '@/hooks/useFetch';
import { Order, OrderStatus } from '@/types';
import { formatDate } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

function OrdersPage() {
  const [orders, setOrder] = useState<Order[]>([]);

  const { request, loading } = useFetch();

  const OrderData = useCallback(async () => {
    const data = await request((api) => api.get('/admin/orders'));
    if (data) setOrder(data.orders);
  }, [request]);

  useEffect(() => {
    OrderData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const res = await request((api) => api.patch(`/admin/orders/${orderId}/status`, { newStatus }));

    if (res) {
      setOrder((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)),
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-base-content/70">Manage customer orders</p>
      </div>

      {/* ORDERS TABLE */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-base-content/60 py-12 text-center">
              <p className="mb-2 text-xl font-semibold">No orders yet</p>
              <p className="text-sm">Orders will appear here once customers make purchases</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const totalQuantity = order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    );

                    return (
                      <tr key={order._id}>
                        <td>
                          <span className="font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                        </td>

                        <td>
                          <div className="font-medium">{order.shippingAddress.fullName}</div>
                          <div className="text-sm opacity-60">
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        </td>

                        <td>
                          <div className="font-medium">{totalQuantity} items</div>
                          <div className="text-sm opacity-60">
                            {order.orderItems[0]?.name}
                            {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
                          </div>
                        </td>

                        <td>
                          <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
                        </td>

                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value as OrderStatus)
                            }
                            className="select select-sm"
                            disabled={loading}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>

                        <td>
                          <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default OrdersPage;
