import React, { useRef, useState, useEffect, useContext } from "react";
import Context, { UserContext } from "../../context/context";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroller";

export default function UserProduct(props) {
  const router = useRouter();
  const ref = useRef(null);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [end, setEnd] = useState(false);
  const { role, loginStatus } = useContext(UserContext);
  const temp = [];
  let limit = 5;
  let offset = 0;
  var scroll = 0;
  const getList = async () => {
    try {
      const response = await fetch(
        process.env.DOMAIN + `user/allproduct?limit=${limit}&offset=${offset}`,
        {
          method: "post",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (!data.productlist.length || data.productlist.length < 5) {
        setEnd(true);
      }
      setList((prevList) => [...prevList, ...data.productlist]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          onScroll();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const searchSubmit = async (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    const searchValue = e.target.value;
    if (!searchValue) {
      offset = 0;
      getList();
    } else {
      setTimeout(async () => {
        const response = await fetch(
          process.env.DOMAIN +
            "user/searchproduct?limit=" +
            limit +
            "&offset=" +
            offset,
          {
            method: "post",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              search: searchValue,
            }),
          }
        );
        const data = await response.json();
        if (data.productlist.length < 5) setEnd(true);
        setList([...data.productlist]);
      }, 500);
    }
  };

  const clickProduct = (id) => {
    router.push("/product/" + id);
  };

  const allproduct = () => {
    window.location.reload();
  };

  const onScroll = () => {
    scroll = scroll + 1;
    if (search == "") getList();
    else searchSubmit();
    offset += 5;
  };

  return (
    <React.Fragment>
      <div className="product-list">
        <h3
          title="click to view all product"
          className="left"
          onClick={() => {
            allproduct();
          }}
        >
          All product
        </h3>
        <br />
        <div className="right">
          <input
            type="text"
            placeholder="search"
            value={search}
            onChange={searchSubmit}
            required
          />
        </div>
        <br />
        <div>
          {list.map((item, index) => (
            <div key={index} className="list">
              <img
                src={process.env.DOMAIN + `${item.product_image}`}
                width="100px"
              />
              <h3>{item.product_name}</h3>
              <p>Rs.{item.product_prize}</p>
              <p>{item.product_companyname}</p>
              {item.product_assured ? (
                <p className="product-assured">{item.product_assured}</p>
              ) : (
                <p className="product-assured">...</p>
              )}
              <a onClick={() => clickProduct(item.id)}>view more </a>
            </div>
          ))}
        </div>
      </div>
      {end ? (
        <center>
          <p>----- No more products -----</p>
        </center>
      ) : null}
      <div ref={ref}></div>
    </React.Fragment>
  );
}
