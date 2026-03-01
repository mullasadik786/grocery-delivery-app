import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Order "mo:core/Order";

actor {
  type Product = {
    id : Text;
    name : Text;
    category : Text;
    description : Text;
    priceCents : Nat;
    imageUrl : Text;
    stockQuantity : Nat;
    available : Bool;
  };

  type OrderItem = {
    productId : Text;
    quantity : Nat;
  };

  type OrderStatus = {
    #pending;
    #confirmed;
    #delivered;
  };

  type Order = {
    orderId : Text;
    buyerName : Text;
    deliveryAddress : Text;
    items : [OrderItem];
    totalAmountCents : Nat;
    status : OrderStatus;
    createdAt : Time.Time;
  };

  module CompareOrder {
    public func compare(order1 : Order, order2 : Order) : Order.Order {
      if (order1.createdAt < order2.createdAt) {
        #less;
      } else if (order1.createdAt > order2.createdAt) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  let initialProducts : [Product] = [
    {
      id = "1";
      name = "Bananas";
      category = "Fruits & Vegetables";
      description = "Fresh yellow bananas";
      priceCents = 150;
      imageUrl = "banana.jpg";
      stockQuantity = 100;
      available = true;
    },
    {
      id = "2";
      name = "Milk";
      category = "Dairy";
      description = "1 liter of whole milk";
      priceCents = 200;
      imageUrl = "milk.jpg";
      stockQuantity = 50;
      available = true;
    },
    {
      id = "3";
      name = "Bread";
      category = "Bakery";
      description = "Loaf of whole wheat bread";
      priceCents = 250;
      imageUrl = "bread.jpg";
      stockQuantity = 80;
      available = true;
    },
    {
      id = "4";
      name = "Orange Juice";
      category = "Beverages";
      description = "1 liter of orange juice";
      priceCents = 300;
      imageUrl = "orange_juice.jpg";
      stockQuantity = 60;
      available = true;
    },
    {
      id = "5";
      name = "Chips";
      category = "Snacks";
      description = "Bag of potato chips";
      priceCents = 180;
      imageUrl = "chips.jpg";
      stockQuantity = 120;
      available = true;
    },
    {
      id = "6";
      name = "Apples";
      category = "Fruits & Vegetables";
      description = "Fresh red apples";
      priceCents = 170;
      imageUrl = "apples.jpg";
      stockQuantity = 90;
      available = true;
    },
    {
      id = "7";
      name = "Cheese";
      category = "Dairy";
      description = "Block of cheddar cheese";
      priceCents = 350;
      imageUrl = "cheese.jpg";
      stockQuantity = 40;
      available = true;
    },
    {
      id = "8";
      name = "Croissant";
      category = "Bakery";
      description = "Buttery croissant";
      priceCents = 220;
      imageUrl = "croissant.jpg";
      stockQuantity = 70;
      available = true;
    },
    {
      id = "9";
      name = "Coffee";
      category = "Beverages";
      description = "Ground coffee beans";
      priceCents = 400;
      imageUrl = "coffee.jpg";
      stockQuantity = 30;
      available = true;
    },
    {
      id = "10";
      name = "Cookies";
      category = "Snacks";
      description = "Pack of chocolate chip cookies";
      priceCents = 260;
      imageUrl = "cookies.jpg";
      stockQuantity = 110;
      available = true;
    },
    {
      id = "11";
      name = "Lettuce";
      category = "Fruits & Vegetables";
      description = "Fresh green lettuce";
      priceCents = 130;
      imageUrl = "lettuce.jpg";
      stockQuantity = 75;
      available = true;
    },
    {
      id = "12";
      name = "Yogurt";
      category = "Dairy";
      description = "Greek yogurt cup";
      priceCents = 180;
      imageUrl = "yogurt.jpg";
      stockQuantity = 60;
      available = true;
    },
    {
      id = "13";
      name = "Baguette";
      category = "Bakery";
      description = "French baguette";
      priceCents = 270;
      imageUrl = "baguette.jpg";
      stockQuantity = 50;
      available = true;
    },
    {
      id = "14";
      name = "Tea";
      category = "Beverages";
      description = "Box of herbal tea bags";
      priceCents = 320;
      imageUrl = "tea.jpg";
      stockQuantity = 40;
      available = true;
    },
    {
      id = "15";
      name = "Granola Bars";
      category = "Snacks";
      description = "Pack of granola bars";
      priceCents = 210;
      imageUrl = "granola_bars.jpg";
      stockQuantity = 100;
      available = true;
    },
    {
      id = "16";
      name = "Tomatoes";
      category = "Fruits & Vegetables";
      description = "Fresh tomatoes";
      priceCents = 140;
      imageUrl = "tomatoes.jpg";
      stockQuantity = 85;
      available = true;
    },
    {
      id = "17";
      name = "Butter";
      category = "Dairy";
      description = "Salted butter stick";
      priceCents = 230;
      imageUrl = "butter.jpg";
      stockQuantity = 55;
      available = true;
    },
    {
      id = "18";
      name = "Muffin";
      category = "Bakery";
      description = "Blueberry muffin";
      priceCents = 200;
      imageUrl = "muffin.jpg";
      stockQuantity = 65;
      available = true;
    },
    {
      id = "19";
      name = "Soda";
      category = "Beverages";
      description = "Can of soda";
      priceCents = 150;
      imageUrl = "soda.jpg";
      stockQuantity = 100;
      available = true;
    },
    {
      id = "20";
      name = "Pretzels";
      category = "Snacks";
      description = "Bag of pretzels";
      priceCents = 190;
      imageUrl = "pretzels.jpg";
      stockQuantity = 115;
      available = true;
    },
  ];

  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();

  for (product in initialProducts.values()) {
    products.add(product.id, product);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public query ({ caller }) func getProduct(productId : Text) : async Product {
    switch (products.get(productId)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public shared ({ caller }) func placeOrder(buyerName : Text, deliveryAddress : Text, items : [OrderItem]) : async Text {
    var totalAmountCents = 0;

    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found: " # item.productId) };
        case (?product) {
          if (product.stockQuantity < item.quantity) {
            Runtime.trap("Insufficient stock for product: " # product.name);
          };
          totalAmountCents += product.priceCents * item.quantity;
        };
      };
    };

    for (item in items.values()) {
      switch (products.get(item.productId)) {
        case (null) {};
        case (?product) {
          let updatedProduct : Product = {
            id = product.id;
            name = product.name;
            category = product.category;
            description = product.description;
            priceCents = product.priceCents;
            imageUrl = product.imageUrl;
            stockQuantity = product.stockQuantity - item.quantity;
            available = product.stockQuantity - item.quantity > 0;
          };
          products.add(product.id, updatedProduct);
        };
      };
    };

    let orderId = "order_" # Time.now().toText();
    let order : Order = {
      orderId;
      buyerName;
      deliveryAddress;
      items;
      totalAmountCents;
      status = #pending;
      createdAt = Time.now();
    };

    orders.add(orderId, order);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : Text) : async Order {
    switch (orders.get(orderId)) {
      case (?order) { order };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray().sort();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : OrderStatus) : async () {
    switch (orders.get(orderId)) {
      case (?order) {
        let updatedOrder : Order = {
          orderId = order.orderId;
          buyerName = order.buyerName;
          deliveryAddress = order.deliveryAddress;
          items = order.items;
          totalAmountCents = order.totalAmountCents;
          status;
          createdAt = order.createdAt;
        };
        orders.add(orderId, updatedOrder);
      };
      case (null) { Runtime.trap("Order not found") };
    };
  };
};
