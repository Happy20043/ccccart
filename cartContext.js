git push -u origin main
git remote add origin https://github.com/Happy20043/ccccart.git
git push -u origin main
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fetch stored cart on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Update local storage whenever the cart changes
  useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Effect to log cart changes

  // Add item to the cart
  const addToCart = (item) => {
    const storedCart = localStorage.getItem("cart");
    const updated = JSON.parse(storedCart) ?? [];
    const existingItemIndex = updated.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    if (existingItemIndex !== -1) {
      const updatedCart = updated.map((cartItem, index) => {
        if (index === existingItemIndex) {
          return { ...cartItem, qty: cartItem.qty + 1 };
        }
        return cartItem;
      });
      setCart(updatedCart);
      toast.success("Increased quantity successfully");
    } else {
      // New item; add to cart
      setCart((prevCart) => [...prevCart, { ...item, qty: 1 }]);
      toast.success("Added to cart successfully");
    }
  };

  // Remove item from the cart
  const removeFromCart = (itemId) => {
 
    const storedCart = localStorage.getItem("cart");
    const updated = JSON.parse(storedCart) ?? [];
    const updatedCart = updated.filter((item) => item.id !== itemId);
    setCart(updatedCart);
    toast.success("Removed item from cart successfully");
  };

  // Update item quantity
  const updateQuantity = (itemId, newQty) => {
    const storedCart = localStorage.getItem("cart");
    const updated = JSON.parse(storedCart) ?? [];
    if (newQty < 1) {
      removeFromCart(itemId);
    } else {
      const updatedCart = updated.map((item) => {
        if (item.id === itemId) {
          return { ...item, qty: newQty };
        }
        return item;
      });
      setCart(updatedCart);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart,setCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
