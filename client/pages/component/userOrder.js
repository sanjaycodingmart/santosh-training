import React, { useEffect, useState } from "react";

export default function Orders() {
  const [listProduct, setProduct] = useState([]);
  const getList = async () => {
    try {
      const response = await fetch(process.env.DOMAIN+"user/orders", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const arr = [];
      for (var i = 0; i < data.productlist.length; i++) {
        arr.push(data.productlist[i]);
      }
      setProduct(arr);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className="orders">
      <p>Your Orders</p>
      <div className="table">
        <table>
          <thead>
            <tr key="thead">
              <th>Product Name</th>
              <th>Prize</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody key="tbody">
            {listProduct.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.product_prize}</td>
                <td>Not Delivered</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
