import http from './http';
const getAuth=()=>{return http.get('/api/auth/getTreeOfRole');};
const logout=()=>{return http.get('/api/admin/logout')};
export default {
  getAuth,
  logout
}
