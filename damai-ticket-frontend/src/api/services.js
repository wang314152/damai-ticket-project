import request from './request.js'

// 认证相关API
export const authAPI = {
  login: (username, password) => 
    request.post('/api/auth/login', { username, password }),
  
  register: (userData) => 
    request.post('/api/auth/register', userData),
}

// 演出相关API
export const showAPI = {
  getList: (keyword, category) => 
    request.get('/api/show/list', { 
      params: { keyword, category } 
    }),
  
  getDetail: (id) => 
    request.get(`/api/show/${id}`),
}

// 座位相关API
export const seatAPI = {
  getList: (showId) => 
    request.get(`/api/seat/list/${showId}`),
  
  init: (showId) => 
    request.post(`/api/seat/init/${showId}`),
}

// 订单相关API
export const orderAPI = {
  create: (orderData) => 
    request.post('/api/order/create', orderData),
  
  createBatch: (orderData) => 
    request.post('/api/order/createBatch', orderData),
  
  pay: (orderId, userId) => 
    request.post('/api/order/pay', { orderId, userId }),
  
  cancel: (orderId, userId) => 
    request.post('/api/order/cancel', { orderId, userId }),
  
  getUserOrders: (userId) => 
    request.get(`/api/order/user/${userId}`),
}

// 用户相关API
export const userAPI = {
  getProfile: (id) => 
    request.get(`/api/user/${id}`),
  
  updateProfile: (userData) => 
    request.put('/api/user/update', userData),
}

// 评分相关API
export const ratingAPI = {
  submit: (ratingData) => 
    request.post('/api/rating/submit', ratingData),
  
  getByOrder: (orderId, userId) => 
    request.get(`/api/rating/byOrder/${orderId}`, { params: { userId } }),
  
  getShowSummary: (showId) => 
    request.get(`/api/rating/show/${showId}/summary`),
  
  getShowRatings: (showId, current = 1, size = 10) => 
    request.get(`/api/rating/show/${showId}/page`, { 
      params: { current, size } 
    }),
}

// AI助手API
export const aiAPI = {
  chat: (question) => 
    request.post('/api/ai/chat', { question }),
}

// 管理员API
export const adminAPI = {
  // 演出管理
  getShows: (params) => 
    request.get('/api/admin/shows', { params }),
  
  addShow: (showData) => 
    request.post('/api/admin/shows', showData),
  
  updateShow: (id, showData) => 
    request.put(`/api/admin/shows/${id}`, showData),
  
  deleteShow: (id) => 
    request.delete(`/api/admin/shows/${id}`),
  
  // 座位管理
  getSeats: (showId) => 
    request.get(`/api/admin/seats/${showId}`),
  
  initSeats: (showId) => 
    request.post(`/api/admin/seats/init/${showId}`),
  
  // 订单管理
  getOrders: (params) => 
    request.get('/api/admin/orders', { params }),
  
  updateOrder: (id, status) => 
    request.put(`/api/admin/orders/${id}`, { status }),
  
  // 用户管理
  getUsers: (params) => 
    request.get('/api/admin/users', { params }),
  
  updateUser: (id, userData) => 
    request.put(`/api/admin/users/${id}`, userData),
  
  // 统计数据
  getStats: () => 
    request.get('/api/admin/stats'),
}
