create table usertable(
    name varchar(20) not null,
    email varchar(30) primary key,
    password varchar(100) not null
);

create table userrole(
    email varchar(30) primary key,
    role varchar(10) not null,
    pendingrequest varchar(10) not null,
    status varchar(10) not null,
    foreign key (email) references usertable(email)
);

create table userpermission(
    permission varchar(30) not null,
    role varchar(10) not null
);

create table product(
    id serial primary key,
    email varchar(30) not null,
    product_name varchar(30) not null,
    product_image varchar(100) not null,
    product_prize int not null,
    product_category varchar(30) not null,
    product_companyname varchar(30) not null,
    product_warranty varchar(30) not null,
    product_assured varchar(10) not null,
    product_description varchar(100) not null,
    foreign key (email) references usertable(email)
);

create table orders(
    id serial not null,
    email varchar(30) not null,
    product_name varchar(30) not null,
    product_prize int not null,
    foreign key (email) references usertable(email)
);

create table product_review(
    product_id int not null,
    email varchar(30) not null,
    name varchar(30) not null,
    user_comment varchar(1000) not null,
    user_rating int not null,
    foreign key (product_id) references product(id)
);

insert into usertable(name,email,password) values('AdminRole','adminrole@admin.com','$2b$10$GQBuZ.K/V2Usejl0a.orSuf4SeUt4QnEgf71810LKMV3eMoKJzqlO'); /*default admin password 123 */

insert into userrole(email,role,pendingrequest,status) values('adminrole@admin.com','Admin','false','accept');

