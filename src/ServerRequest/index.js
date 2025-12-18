/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import API from "../axios/API";
import Auth from "../modules/Auth";

// Helper functions for localStorage-based auth
const getUsersFromStorage = () => {
  const users = localStorage.getItem('ecommerce_users');
  return users ? JSON.parse(users) : [];
};

const saveUserToStorage = (user) => {
  const users = getUsersFromStorage();
  users.push(user);
  localStorage.setItem('ecommerce_users', JSON.stringify(users));
};

const findUserByEmail = (email) => {
  const users = getUsersFromStorage();
  return users.find(u => u.email === email);
};

export const login = async (email, password) => {
  // Try API first, fallback to localStorage
  const body = {
    credential: {
      email: email,
      password: password
    }
  };

  try {
    const res = await API({
      method: "POST",
      url: "/users/login",
      data: body
    });
    Auth.setUserToken(res.data.user_token);
    return res;
  } catch (error) {
    console.log('API login failed, using localStorage fallback');

    // Fallback to localStorage authentication
    const user = findUserByEmail(email);

    if (!user) {
      throw new Error('User not found. Please register first.');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    // Create mock token
    const mockToken = {
      user_id: user.user_id,
      user_name: user.fullname,
      token: `mock_token_${Date.now()}`,
      expire_in: '7d'
    };

    Auth.setUserToken(mockToken);

    return {
      data: {
        user_token: mockToken
      }
    };
  }
};

export const register = async (fullname, email, password, verifyPassword) => {
  if (password !== verifyPassword) {
    throw new Error('Passwords do not match');
  }

  // Try API first, fallback to localStorage
  try {
    const res = await API({
      method: "POST",
      url: "/users/signin",
      data: {
        fullname,
        email,
        password,
        verifyPassword
      }
    });
    console.log(res);
    return res;
  } catch (error) {
    console.log('API registration failed, using localStorage fallback');

    // Fallback to localStorage
    const existingUser = findUserByEmail(email);

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = {
      user_id: `user_${Date.now()}`,
      fullname,
      email,
      password, // In production, this should be hashed!
      created_at: new Date().toISOString()
    };

    saveUserToStorage(newUser);

    return {
      data: {
        message: 'User created successfully'
      }
    };
  }
};
