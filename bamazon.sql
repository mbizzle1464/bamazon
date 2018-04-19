DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
    ItemID INT NOT NULL,
    ProductName VARCHAR(200) NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT NOT NULL,
    PRIMARY KEY (ItemID)
);

INSERT INTO Products (ItemID, ProductName, DepartmentName, Price, StockQuantity) 
VALUES (12401, 'SGS3 Tablet 9.7 Inch', 'Electronics', 449.99, 10), (11234, 'Nerf MXVII-10K', 'Toys', 78.00, 125),
 (84564, 'SAE 5w20 Motor Oil', 'Automotive', 37.97, 200), (89321, 'Snuggle-pedic Pillow', 'Home', 49.99, 30), 
 (12405, 'Smart Speaker', 'Electronics', 39.99, 125), (54321, 'Jogger Pants', 'Mens Clothing', 16.99, 55), 
 (12407, 'Travel Laptop Backpack', 'Electronics', 28.99, 35), (58439, 'Sleeve Wrap Dress', 'Womens Clothing', 45.00, 25), 
 (68790, 'Dog Bed', 'Pets', 49.99, 25), (38210, 'SQL Cookbook', 'Books', 19.99, 20);  

 USE bamazon_db;

 CREATE TABLE Departments (
    DepartmentID INT AUTO_INCREMENT,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts DECIMAL(10,2) NOT NULL,
    TotalSales DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (DepartmentID)
);

INSERT INTO Departments (DepartmentName, OverHeadCosts, TotalSales) 
VALUES ('Automotive', 10000, 0), ('Books', 10000, 0), 
('Childrens Clothing', 10000, 0), ('Electronics', 20000, 0), 
('Garden', 10000, 0), ('Grocery', 15000, 0), 
('Home', 15000, 0), ('Mens Clothing', 10000, 0), ('Pets', 20000, 0),
 ('Toys', 10000, 0), ('Womens Clothing', 10000, 0);   

-- This creates the alias table TotalProfits that will exist only when requested by the executive 
SHOW TABLES;
CREATE VIEW bamazon_db.TotalProfits AS SELECT DepartmentId, DepartmentName, OverHeadCosts, TotalSales, TotalSales-OverHeadCosts AS TotalProfit FROM Departments;

