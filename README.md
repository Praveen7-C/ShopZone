# ShopZone – Online Marketplace

## Overview

The **ShopZone Online Marketplace** is a responsive **web-based e-commerce application** built using **HTML5, CSS3, Bootstrap, and Vanilla JavaScript**.
It allows users to register, log in, browse products, filter and sort items, add them to the cart or wishlist, manage their profiles, and simulate a checkout process — all within the browser using **LocalStorage** for data persistence.

This project demonstrates a complete frontend implementation of a modern shopping platform similar to Amazon or Flipkart, without requiring any backend setup.

---

## Features

* **User Authentication:** Register, login, logout, and manage profiles using LocalStorage.
* **Product Management:** Browse products by categories like Electronics, Clothing, Books, Sports, and more.
* **Search & Filter System:** Search products by name or category, and filter by price, category, or rating.
* **Cart & Wishlist:** Add, remove, and update items in the shopping cart or wishlist with persistent storage.
* **Checkout & Orders:** Simulate checkout, place orders, and view past order history.
* **Responsive UI:** Clean, mobile-friendly interface designed using **Bootstrap 5**.
* **Toast Notifications:** Real-time success or error notifications for user actions.
* **Profile Management:** Update personal details, delivery address, and password.

---

## Technologies Used

* **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6)
* **Data Storage:** Browser LocalStorage
* **UI Frameworks:** Bootstrap 5, Font Awesome 6
* **Other Tools:** JSON-based product data (`productsData.json`)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Praveen7-C/ShopZone.git
cd shopzone
```

### 2. Open the Application

Simply open the `index.html` file in your web browser.

>  **Note:** Ensure `productsData.json` is in the same directory as `index.html`.
> This file contains the sample products and categories displayed in the app.

Example structure:
```json
{
  "categories": [
    {
      "name": "Electronics",
      "id": "electronics",
      "image": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop",
      "productCount": 5
    }]
  "products": [
    {
      "id": 1,
      "name": "Smartphone Pro Max",
      "category": "electronics",
      "price": 10999.99,
      "originalPrice": 19999.99,
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
      "rating": 4.5,
      "reviews": 1250,
      "description": "Latest smartphone with advanced camera and processing power"
    }]
}
```

Example of Another structure:
```json
{
  "categories": [
    {"id": "electronics", "name": "Electronics", "image": "assets/electronics.jpg"},
    {"id": "clothing", "name": "Clothing", "image": "assets/clothing.jpg"}
  ],
  "products": [
    {"id": 1, "name": "Smartphone", "category": "electronics", "price": 14999, "rating": 4.5, "image": "assets/phone.jpg"}
  ]
}
```

### 3. Launch

Double-click on `index.html` to open in your browser or serve it locally using VS Code’s **Live Server** extension.

---

## Usage

1. **Register or Login:**
   Create a new account or use an existing one via the modal popup.

2. **Browse Products:**
   View featured products and categories, apply filters, and search items.

3. **Add to Cart / Wishlist:**
   Add products to your cart or wishlist with a single click.

4. **Checkout:**
   Review your cart, simulate an order placement, and view order history.

5. **Profile & Logout:**
   Update your personal details and logout securely.

---

## Directory Structure

```
ShopZone/
│
├── index.html             # Main application file
├── styles.css             # External CSS file
├── scripts.js             # External JavaScript file
├── productsData.json      # Product and category dataset
├── /assets/               # Product and category images(optional)
└── README.md              # Project documentation
```

---

## Contributing

Contributions are welcome!

1. **Fork** the repository
2. **Create** a feature branch

   ```bash
   git checkout -b feature/new-feature
   ```
3. **Commit** your changes

   ```bash
   git commit -m "Add new feature"
   ```
4. **Push** to your branch

   ```bash
   git push origin feature/new-feature
   ```
5. **Open a Pull Request**

---

## Acknowledgments

Special thanks to the following technologies and resources:

* **Bootstrap 5** – For responsive and modern UI design
* **Font Awesome 6** – For clean and useful icons
* **LocalStorage API** – For managing user data persistently
* **JSON** – For structured product and category data

---

## License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this project with proper attribution.

---

For any questions or issues, feel free to contact [gmail](praveen.chinna0765@gmail.com).
