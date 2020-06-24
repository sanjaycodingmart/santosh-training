import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['../../assets/css/home.css', '../../assets/css/addproduct.css'],
})
export class ViewProductComponent implements OnInit {
  name: string = '';
  email: string = '';
  role: string = '';
  image: any = '';
  prize: string = '';
  companyname: string = '';
  warranty: string = '';
  assured: string = '';
  description: string = '';
  product = false;
  path = window.location.href.split('/');
  idval = this.path[this.path.length - 1];

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
      // window.location.reload();
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

  async order() {
    try {
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
      // const imgName = data.productlist.product_image;

      this.name = data.productlist.product_name;
      this.image = data.productlist.product_image;
      this.prize = data.productlist.product_prize;
      this.companyname = data.productlist.product_companyname;
      this.warranty = data.productlist.product_warranty;
      this.email = data.productlist.email;
      this.description = data.productlist.product_description;
      this.assured = data.productlist.product_assured;
      this.role = data.role;
      this.product = true;
   
  }
}
