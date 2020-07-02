import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['../../assets/css/home.css', '../../assets/css/addproduct.css'],
})
export class ViewProductComponent implements OnInit {
  userNmae: string;
  name: string = '';
  email: string = '';
  role: string = '';
  image: any = '';
  prize: string = '';
  companyname: string = '';
  warranty: string = '';
  assured: string = '';
  description: string = '';
  product: boolean = false;
  product_rating: number;
  product_comment: string;
  lists: any = [];
  totalReview: number = 0;
  avgRating = 0;
  path = window.location.href.split('/');
  idval = this.path[this.path.length - 1];

  handler: any = null;

  constructor(private router: Router) {}

  share(): void {
    alert('Copy the link and share \n' + window.location.href);
  }

  back(): void {
    var backhistory: string = this.role;
    if (this.role == null) {
      backhistory = 'user';
    }
    backhistory = backhistory.toLowerCase();
    this.router.navigate([backhistory]);
  }

  async deleteProduct() {
    const response = await fetch('http://localhost:4000/user/deleteproduct', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.idval,
      }),
    });
    const data = await response.json();
    if (data.status == 'success') {
      alert('delete succees');
    } else {
      alert('not delete');
    }
  }

  async assuredProduct() {
    try {
      const response: any = await fetch('http://localhost:4000/user/assured', {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.idval,
        }),
      });
      const data: any = await response.json();
      if (data.status == 'assured') {
        alert('product assured');
      } else {
        alert(data.status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async ngOnInit() {
    const response = await fetch('http://localhost:4000/user/getproduct', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.idval,
      }),
    });
    const data = await response.json();
    console.log(data);
    this.userNmae = data.name;
    this.name = data.productlist.product_name;
    this.image = data.productlist.product_image;
    this.prize = data.productlist.product_prize;
    this.companyname = data.productlist.product_companyname;
    this.warranty = data.productlist.product_warranty;
    this.email = data.productlist.email;
    this.description = data.productlist.product_description;
    this.assured = data.productlist.product_assured;
    this.role = data.role;
    this.totalReview = data.productReviewList.length;
    const arr = [];
    for (var i = 0; i < data.productReviewList.length; i++) {
      arr.push(data.productReviewList[i]);
      this.avgRating += data.productReviewList[i].user_rating;
    }
    this.avgRating =
      Math.round((this.avgRating / data.productReviewList.length) * 10) / 10;
    this.lists = arr;
    this.product = true;
    if (this.role == 'User') {
      this.loadStripe();
    }
  }

  async order() {
    const response: any = await fetch('http://localhost:4000/user/placeorder', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.idval,
      }),
    });
    const data: any = await response.json();
    if (data.status == 'success') {
      alert('Placed Your Order');
    } else {
      alert('Try again');
    }
  }

  pay() {
    const amount = parseInt(this.prize) * 100;
    var handler = (<any>window).StripeCheckout.configure({
      key:
        'pk_test_51GyH8aCqbRdyZuzQWnyh8L5fLU3IeYkkUCxN6GviwM8aEw6A2NBVJ0fBeSbmdWX54LOq7iYGFCKtfVyntuXd79bq00GALeFfKm',
      locale: 'auto',
      token: async function () {
        const response: any = await fetch(
          'http://localhost:4000/user/placeorder',
          {
            method: 'post',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: this.idval,
            }),
          }
        );
        const data: any = await response.json();
        if (data.status == 'success') {
          alert('Placed Your Order');
        } else {
          alert('Try again');
        }
      },
    });
    handler.open({
      name: 'shoppy',
      // image : "http://localhost:4000/"+this.image,
      description: this.name,
      amount: amount,
      currency: 'INR',
    });
  }
  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key:
            'pk_test_51GyH8aCqbRdyZuzQWnyh8L5fLU3IeYkkUCxN6GviwM8aEw6A2NBVJ0fBeSbmdWX54LOq7iYGFCKtfVyntuXd79bq00GALeFfKm',
          locale: 'auto',
          token: function (token: any) {},
        });
      };

      window.document.body.appendChild(s);
    }
  }
  async productReviewSubmit(e: Event) {
    if (this.product_rating == undefined || this.product_comment == undefined) {
      alert('Required feilds rating , comment');
    } else {
      const response = await fetch('http://localhost:4000/user/productreview', {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: this.idval,
          comment: this.product_comment,
          rating: this.product_rating,
        }),
      });
      const data = await response.json();
      if (data.status) {
        const review = {
          name: this.userNmae,
          user_comment: this.product_comment,
          user_rating: this.product_rating,
        };
        this.lists.push(review);
        alert("Comment added");
      } else alert('try again');
    }
  }
}
