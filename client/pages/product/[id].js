import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import DeleteProduct from "../component/product/deleteProduct";
import { UserContext } from "../context/context";

const ViewProduct = ({ data, id, ratings }) => {
  const { name, role, loginStatus } = useContext(UserContext);
  const router = useRouter();
  const email = data.productlist.email;
  const productName = data.productlist.product_name;
  const image = data.productlist.product_image;
  const prize = data.productlist.product_prize;
  const companyname = data.productlist.product_companyname;
  const warranty = data.productlist.product_warranty;
  const assured = data.productlist.product_assured;
  const description = data.productlist.product_description;
  const [totalReview, setTotalReview] = useState(data.productReviewList.length);
  const [avgRating, setAvgRating] = useState(ratings);
  const [comment, setComment] = useState();
  const [rating, setRating] = useState();
  const [reviewList, setReviewList] = useState(data.productReviewList);

  const deletepro = () => {
    DeleteProduct.delete(id);
  };

  const order = async () => {
    try {
      const response = await fetch(process.env.DOMAIN + "user/placeorder", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const data = await response.json();
      if (data.status == "success") {
        alert("Placed Your Order");
      } else {
        alert("Try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const assuredProduct = async () => {
    try {
      const response = await fetch(process.env.DOMAIN + "user/assured", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
      const data = await response.json();
      if (data.status == "assured") {
        alert("product assured");
      } else {
        alert(data.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (role == "User") {
      loadStripe();
    }
  });

  const back = () => {
    var backhistory = role;
    if (role == null) {
      backhistory = "user";
    } else {
      backhistory = backhistory.toLowerCase();
    }
    router.push("/home/" + backhistory);
  };

  const productReviewSubmit = async (e) => {
    e.preventDefault();
    // console.log(rating + "  " + comment);
    if (rating == undefined || comment == undefined) {
      alert("Required feilds rating , comment");
    } else {
      const response = await fetch(process.env.DOMAIN + "user/productreview", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          comment: comment,
          rating: rating,
        }),
      });
      const data = await response.json();
      if (data.status) {
        const review = {
          name: name,
          user_comment: comment,
          user_rating: rating,
        };
        var listReview = [...reviewList];
        listReview.push(review);
        setReviewList(listReview);
        alert("Comment added");
      } else alert("try again");
    }
  };

  const handleRatingChange = (e) => {
    // console.log(rating + " " + e.target.value);
    setRating(e.target.value);
  };

  const loadStripe = () => {
    if (!window.document.getElementById("stripe-script")) {
      var s = window.document.createElement("script");
      var handler;
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      s.onload = () => {
        handler = window.StripeCheckout.configure({
          key:
            "pk_test_51GyH8aCqbRdyZuzQWnyh8L5fLU3IeYkkUCxN6GviwM8aEw6A2NBVJ0fBeSbmdWX54LOq7iYGFCKtfVyntuXd79bq00GALeFfKm",
          locale: "auto",
          token: function (token) {},
        });
      };

      window.document.body.appendChild(s);
    }
  };

  const pay = () => {
    const amount = parseInt(prize) * 100;
    var handler = window.StripeCheckout.configure({
      key:
        "pk_test_51GyH8aCqbRdyZuzQWnyh8L5fLU3IeYkkUCxN6GviwM8aEw6A2NBVJ0fBeSbmdWX54LOq7iYGFCKtfVyntuXd79bq00GALeFfKm",
      locale: "auto",
      token: async function () {
        console.log(id);
        const response = await fetch(process.env.DOMAIN + "user/placeorder", {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        });
        const data = await response.json();
        if (data.status == "success") {
          alert("Placed Your Order");
        } else {
          alert("Try again");
        }
      },
    });
    handler.open({
      name: "shoppy",
      description: productName,
      amount: prize * 100,
      currency: "INR",
    });
  };

  return (
    <React.Fragment>
      <div className="header">
        <div className="left">
          <a
            className="login-btn"
            onClick={() => {
              back();
            }}
          >
            Back
          </a>
        </div>
        <div className="right">
          <a
            className="login-btn"
            onClick={() => {
              alert("Copy the link and share \n" + window.location.href);
            }}
          >
            Share
          </a>
        </div>
        <br />
        <br />
      </div>
      <div className="single-product">
        <div className="img">
          <img src={process.env.DOMAIN + `${image}`} />
        </div>
        <h1>{productName}</h1>
        {totalReview ? (
          <h3 className="review-rating">
            Reviews : {totalReview} And Rating : {avgRating}
          </h3>
        ) : null}
        <h2>Rs. {prize}</h2>
        <h3>Brand : {companyname}</h3>
        <h3>warranty : {warranty}</h3>
        <h3>{assured}</h3>
        <h3>{description}</h3>
        {role ? (
          role == "Admin" ? (
            <React.Fragment>
              <a
                title="click to open seller mail"
                className="mail"
                href={"mailto:" + email}
              >
                seller : {email}
              </a>
              <h3 className="delete" onClick={() => deletepro()}>
                delete
              </h3>
              <br />
              <h3 className="assured" onClick={() => assuredProduct()}>
                assured
              </h3>
            </React.Fragment>
          ) : role == "User" ? (
            <React.Fragment>
              <h3
                className="buy"
                onClick={() => {
                  pay();
                }}
              >
                Buy Now
              </h3>
              <br />
              <form onSubmit={(e) => productReviewSubmit(e)}>
                <h3>Product Review</h3>
                <label>Product Rating : </label>
                <input
                  type="radio"
                  name="rating"
                  value="1"
                  checked={rating == 1}
                  onChange={(e) => handleRatingChange(e)}
                />{" "}
                1
                <input
                  type="radio"
                  name="rating"
                  value="2"
                  checked={rating == 2}
                  onChange={(e) => handleRatingChange(e)}
                />{" "}
                2
                <input
                  type="radio"
                  name="rating"
                  value="3"
                  checked={rating == 3}
                  onChange={(e) => handleRatingChange(e)}
                />{" "}
                3
                <input
                  type="radio"
                  name="rating"
                  value="4"
                  checked={rating == 4}
                  onChange={(e) => handleRatingChange(e)}
                />{" "}
                4
                <input
                  type="radio"
                  name="rating"
                  value="5"
                  checked={rating == 5}
                  onChange={(e) => handleRatingChange(e)}
                />{" "}
                5
                <br />
                <label>comment : </label>
                <textarea
                  name="comment"
                  value={comment}
                  placeholder="comments"
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
                <br />
                <input type="submit" />
              </form>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h3 className="buy">seller account</h3>
            </React.Fragment>
          )
        ) : (
          <h3
            className="buy"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login to Buy
          </h3>
        )}
      </div>
      <br />
      <h3>Comments : </h3>
      {reviewList.map((item) => (
        <div key={item} className="list-comment">
          <h3 className="comment-name">
            {item.name} Rating : {item.user_rating}
          </h3>
          <p></p>
          <p>{item.user_comment}</p>
        </div>
      ))}
    </React.Fragment>
  );
};

export async function getStaticProps(context) {
  const response = await fetch(process.env.DOMAIN + "user/getproduct", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: context.params.id,
    }),
  });
  const data = await response.json();
  //   console.log(data);
  var ratings = 0;
  for (var i = 0; i < data.productReviewList.length; i++) {
    ratings += data.productReviewList[i].user_rating;
  }
  return {
    props: {
      data,
      id: context.params.id,
      ratings,
    },
  };
}

export async function getStaticPaths() {
  const response = await fetch(process.env.DOMAIN + "user/productlength", {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  //   console.log(data);
  return {
    paths: new Array(data.productLength).fill(null).map((_, index) => ({
      params: { id: `${index + 1}` },
    })),
    fallback: false,
  };
}

export default ViewProduct;
