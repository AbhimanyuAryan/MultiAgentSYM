/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import React from "react";
import jumpTo from "../../modules/Navigation";

function SingleProduct(props) {
  const { productItem } = props;

  // Calculate discount percentage for fun display
  const discountPercent = Math.round(
    ((productItem.price - productItem.discounted_price) / productItem.price) * 100
  );

  return (
    <div className="product-item men" style={{ marginBottom: "30px" }}>
      <div
        className="product discount product_filter"
        onClick={() =>
          jumpTo(`/single-product/${productItem._id || productItem.id}`)
        }
        style={{
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
          borderRadius: "15px",
          overflow: "hidden",
          marginBottom: "10px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <div className="product_image" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          lineHeight: 1
        }}>
          <div style={{
            fontSize: "120px",
            animation: "bounce 2s infinite",
            textShadow: "0 5px 15px rgba(0,0,0,0.3)",
            lineHeight: 1
          }}>
            {productItem.emoji || productItem.imagePath}
          </div>
          {discountPercent > 0 && (
            <div style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "#ff4757",
              color: "white",
              padding: "8px 12px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(255, 71, 87, 0.4)"
            }}>
              {discountPercent}% OFF 🎉
            </div>
          )}
        </div>
        <div className="favorite favorite_left" style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <i className="far fa-heart" style={{ color: "#ff4757" }}></i>
        </div>
        <div className="product_info" style={{ padding: "15px" }}>
          <h6 className="product_name" style={{
            fontWeight: "bold",
            fontSize: "16px",
            marginBottom: "10px"
          }}>
            <div>{productItem.title}</div>
          </h6>
          <div className="product_price" style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#667eea"
            }}>
              ₹ {productItem.discounted_price}
            </span>
            <span style={{
              fontSize: "16px",
              textDecoration: "line-through",
              color: "#999"
            }}>
              ₹ {productItem.price}
            </span>
          </div>
        </div>
      </div>
      <div
        className="red_button add_to_cart_button"
        onClick={() => props.addToBag(productItem._id)}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "10px",
          padding: "12px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          marginTop: "10px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
        }}
      >
        <div style={{
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "14px",
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>
          🛒 Add to Cart
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
