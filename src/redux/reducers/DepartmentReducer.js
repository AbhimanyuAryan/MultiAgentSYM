/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import {
  GET_DEPARTMENTS_BEGIN,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_FAIL
} from "../actions/DepartmentAction";

const initialState = {
  loading: false,
  departments: [
    {
      _id: 1,
      departmentName: "Men",
      description: "Men's clothing and accessories",
      categories: "T-Shirts,Jeans,Jackets,Shirts,Casual Wear"
    },
    {
      _id: 2,
      departmentName: "Women",
      description: "Women's clothing and accessories",
      categories: "Dresses,Tops,Skirts,Sweaters,Casual Wear"
    },
    {
      _id: 3,
      departmentName: "Shoes",
      description: "Footwear for all occasions",
      categories: "Sneakers,Boots,Sandals,Formal Shoes,Athletic"
    },
    {
      _id: 4,
      departmentName: "Accessories",
      description: "Fashion accessories and more",
      categories: "Handbags,Wallets,Jewelry,Belts,Sunglasses"
    }
  ],
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DEPARTMENTS_BEGIN:
      return {
        loading: true,
        error: null
      };
    case GET_DEPARTMENTS_SUCCESS:
      return {
        loading: false,
        departments: action.payload.data.departments
      };
    case GET_DEPARTMENTS_FAIL:
      return {
        loading: false,
        error: action.payload.error.response.data
      };
    default:
      return state;
  }
};
