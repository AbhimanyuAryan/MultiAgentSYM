/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import React, { Component } from "react";
import SingleProduct from "../../components/Products/SingleProduct";
import Auth from "../../modules/Auth";
import LoginRegister from "../../components/LoginRegisterModal";
import Filter from "./components/Filter";

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products,
      productsBAK: this.props.products,
      departments: this.props.departments,
      modalShow: false,
      login: true
    };
    this.addToBag = this.addToBag.bind(this);
  }
  componentDidMount() {
    if (!this.props.products) {
      this.props.getAllProducts();
    }
    this.filterProductsByCategory();
  }

  componentDidUpdate(prevProps) {
    // Update products when location changes
    if (this.props.location.pathname !== prevProps.location.pathname ||
        this.props.products !== prevProps.products) {
      this.filterProductsByCategory();
    }
  }

  filterProductsByCategory = () => {
    const category = this.props.location.pathname.split("/")[2];
    const subcategory = this.props.location.pathname.split("/")[3];

    if (this.props.products) {
      let filtered = this.props.products;

      // Filter by category if not "All"
      if (category && category !== "All") {
        filtered = filtered.filter(product => {
          // Match by category name (men, women, shoes, accessories)
          if (product.category && product.category.toLowerCase() === category.toLowerCase()) {
            return true;
          }
          // Also match by department name
          if (product.department && product.department.toLowerCase() === category.toLowerCase()) {
            return true;
          }
          return false;
        });
      }

      // Filter by subcategory if provided
      if (subcategory) {
        filtered = filtered.filter(product =>
          product.title && product.title.toLowerCase().includes(subcategory.toLowerCase())
        );
      }

      this.setState({
        products: filtered,
        productsBAK: this.props.products
      });
    }
  }
  showHideModal = () => {
    this.setState({ modalShow: false });
  };

  loginClicked = () => {
    this.setState({ modalShow: true, login: true });
  };
  registerClicked = () => {
    this.setState({ modalShow: true, login: false });
  };

  addToBag = params => {
    if (
      Auth.getUserDetails() !== undefined &&
      Auth.getUserDetails() !== null &&
      Auth.getToken() !== undefined
    ) {
      let cart = this.props.postCart(params);
      cart.then(res => {
        console.log(res);
      });
    } else {
      this.setState({ modalShow: true });
    }
  };

  render() {
    const { products, applyFilters } = this.props;
    console.log(this.props);
    return (
      <div className="container product_section_container">
        <div className="row">
          <div className="col product_section clearfix">
            <div class="breadcrumbs d-flex flex-row align-items-center">
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li class="active">
                  <a href="/">
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                    {this.props.location.pathname.split("/")[2]}
                  </a>
                </li>
                <li class="active">
                  <a href="#">
                    <i class="fa fa-angle-right" aria-hidden="true"></i>
                    {this.props.location.pathname.split("/")[3]}
                  </a>
                </li>
              </ul>
            </div>

            <div className="sidebar">
              <Filter applyFilters={applyFilters} />
            </div>
            <div className="main_content">
              <div class="products_iso">
                <div class="row">
                  <div class="col">
                    <div class="product_sorting_container product_sorting_container_top">
                      <ul class="product_sorting">
                        <li>
                          <span class="type_sorting_text">Default Sorting</span>
                          <i class="fa fa-angle-down"></i>
                          <ul class="sorting_type">
                            <li
                              class="type_sorting_btn"
                              data-isotope-option='{ "sortBy": "original-order" }'
                            >
                              <span>Default Sorting</span>
                            </li>
                            <li
                              class="type_sorting_btn"
                              data-isotope-option='{ "sortBy": "price" }'
                            >
                              <span>Price</span>
                            </li>
                            <li
                              class="type_sorting_btn"
                              data-isotope-option='{ "sortBy": "name" }'
                            >
                              <span>Product Name</span>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <span>Show</span>
                          <span class="num_sorting_text">6</span>
                          <i class="fa fa-angle-down"></i>
                          <ul class="sorting_num">
                            <li class="num_sorting_btn">
                              <span>6</span>
                            </li>
                            <li class="num_sorting_btn">
                              <span>12</span>
                            </li>
                            <li class="num_sorting_btn">
                              <span>24</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <div class="pages d-flex flex-row align-items-center">
                        <div class="page_current">
                          <span>1</span>
                          <ul class="page_selection">
                            <li>
                              <a href="#">1</a>
                            </li>
                            <li>
                              <a href="#">2</a>
                            </li>
                            <li>
                              <a href="#">3</a>
                            </li>
                          </ul>
                        </div>
                        <div class="page_total">
                          <span>of</span> 3
                        </div>
                        <div id="next_page" class="page_next">
                          <a href="#">
                            <i class="fas fa-long-arrow-alt-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {products && products.length > 0 ? (
                    products.map((item, index) => {
                      return (
                        <div
                          className="col-lg-3 col-sm-6"
                          key={index}
                          data-aos="zoom-in"
                          style={{ marginBottom: "30px" }}
                        >
                          <SingleProduct
                            productItem={item}
                            addToBag={this.addToBag}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center" style={{ padding: "50px 0" }}>
                      <div style={{
                        fontSize: "48px",
                        marginBottom: "20px"
                      }}>
                        🛍️
                      </div>
                      <h3 style={{ color: "#667eea" }}>No products found</h3>
                      <p style={{ color: "#999" }}>Try adjusting your filters or browse all products</p>
                    </div>
                  )}
                </div>
                <div class="product_sorting_container product_sorting_container_bottom clearfix">
                  <ul class="product_sorting">
                    <li>
                      <span>Show:</span>
                      <span class="num_sorting_text">04</span>
                      <i class="fa fa-angle-down"></i>
                      <ul class="sorting_num">
                        <li class="num_sorting_btn">
                          <span>01</span>
                        </li>
                        <li class="num_sorting_btn">
                          <span>02</span>
                        </li>
                        <li class="num_sorting_btn">
                          <span>03</span>
                        </li>
                        <li class="num_sorting_btn">
                          <span>04</span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <span class="showing_results">Showing 1–3 of 12 results</span>
                  <div class="pages d-flex flex-row align-items-center">
                    <div class="page_current">
                      <span>1</span>
                      <ul class="page_selection">
                        <li>
                          <a href="#">1</a>
                        </li>
                        <li>
                          <a href="#">2</a>
                        </li>
                        <li>
                          <a href="#">3</a>
                        </li>
                      </ul>
                    </div>
                    <div class="page_total">
                      <span>of</span> 3
                    </div>
                    <div id="next_page_1" class="page_next">
                      <a href="#">
                        <i
                          class="fas fa-long-arrow-right"
                          aria-hidden="true"
                        ></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoginRegister
          show={this.state.modalShow}
          login={this.state.login}
          registerClicked={() => this.registerClicked()}
          loginClicked={() => this.loginClicked()}
          onHide={() => this.showHideModal()}
        />
      </div>
    );
  }
}

export default Category;
