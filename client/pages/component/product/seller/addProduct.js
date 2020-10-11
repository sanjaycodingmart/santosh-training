import React, { useState } from "react";

export default class AddProduct extends React.Component {
  constructor() {
    super();
    this.state = {
      productName: "",
      productPrize: "",
      productCategory: "",
      productCompanyName: "",
      productWarranty: "",
      productDescription: "",
    };
    this.productImage = {};
  }
  async handleChangefile(e) {
    this.productImage =e.target.files[0];
    console.log(this.productImage);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: [e.target.value],
    });
  }
  async add(e) {
    console.log("add method");
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("productname", this.state.productName);
    myHeaders.append("productimage", this.state.productImage);
    myHeaders.append("productprize", this.state.productPrize);
    myHeaders.append("productcategory", this.state.productCategory);
    myHeaders.append("productcompanyname", this.state.productCompanyName);
    myHeaders.append("productwarranty", this.state.productWarranty);
    myHeaders.append("productdescription", this.state.productDescription);

    var formdata = new FormData();
    formdata.append("productimage", this.productImage);

    const response = await fetch("http://localhost:4000/user/addproduct", {
      method: "POST",
      credentials: "include",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    });
    const body = await response.json();
    console.log(body);
    if (body.status == "success") {
      alert("product added");
      window.location.reload();
    } else {
      alert("product add failed");
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="product">
          <div className="product add">
            <form onSubmit={(e) => this.add(e)}>
              <input
                type="text"
                name="productName"
                placeholder="Product name"
                value={this.state.productName}
                onChange={(e) => this.handleChange(e)}
              />
              <br />
              <br />
              <input
                type="file"
                name="productImage"
                accept="image/*"
                onChange={(e) => this.handleChangefile(e)}
              />
              <br />
              <br />

              <input
                type="text"
                name="productPrize"
                value={this.state.productPrize}
                placeholder="product prize"
                onChange={(e) => this.handleChange(e)}
              />
              <br />
              <br />
              <input
                type="text"
                name="productCategory"
                placeholder="productCategory"
                value={this.state.productCategory}
                onChange={(e) => this.handleChange(e)}
              />
              <br />
              <br />
              <input
                type="text"
                name="productCompanyName"
                placeholder="productCompanyName"
                value={this.state.productCompanyName}
                onChange={(e) => this.handleChange(e)}
              />
              <br />
              <br />
              <input
                type="text"
                name="productWarranty"
                placeholder="productWarranty"
                value={this.state.productWarranty}
                onChange={(e) => this.handleChange(e)}
              />
              <br />
              <br />
              <textarea
                placeholder="product details & description"
                value={this.state.productDescription}
                onChange={(e) => this.handleChange(e)}
                name="productDescription"
              ></textarea>
              <br />
              <br />
              <input type="submit" />
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
