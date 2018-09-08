import http from './http';

/**
 *基本
 */
const getAuthMenu=()=>{return http.get('/api/auth/getTreeOfRole');};
const logout=()=>{return http.get('/api/admin/logout')};
const getDashBoardData=()=>{return http.get('/api/dashboard/getBackDashBoard')};
/**
 *管理员
 */
const addAdmin=(form)=>{return http.post('/api/admin/add',form)};
const deleteAdmin=(id)=>{return http.post('/api/admin/delete',{id:id})};
const updateAdmin=(form)=>{return http.post('/api/admin/update',form)};
const getAdmin=(id)=>{return http.post('/api/admin/get',{id})};
const getAdmins=(params=null)=>{return http.post('/api/admin/getByPage',params)};
/**
 *角色
 */
const addRole=(form)=>{return http.post('/api/role/add',form)};
const deleteRole=(id)=>{return http.post('/api/role/delete',{id})};
const updateRole=(form)=>{return http.post('/api/role/update',form)};
const getRole=(id)=>{return http.post('/api/role/get',{id})};
const getRoles=(params=null)=>{return http.post('/api/role/getByPage',params)};
const bindAuth=(id,auths)=>{return http.post('/api/role/bindAuth',{id, auths})};
/**
 * 权限资源
 */
const addAuth=(form)=>{return http.post('/api/auth/add',form)};
const deleteAuth=(id)=>{return http.post('/api/auth/delete',{id})};
const updateAuth=(form)=>{return http.post('/api/auth/update',form)};
const getAuth=(id)=>{return http.post('/api/auth/get',{id})};
const getAuths=(params=null)=>{return http.post('/api/auth/getByPage',params)};
const getAuthTree=()=>{return http.get('/api/auth/getTree')};
/**
 * 邮件
 */
const addMail=(form)=>http.post('/api/mail/add',form);
const deleteMail=(params=null)=>http.post('/api/mail/delete',params);
const updateMail=(form)=>http.post('/api/mail/update',form);
const getMail=(id)=>http.post('/api/mail/get',{id});
const getMails=(params=null)=>http.post('/api/mail/getByPage',params);
const sendMail=(params=null)=>http.post('/api/mail/send',params);
/**
 * 栏目
 */
const addCategory=(form)=>http.post('/api/category/add',form);
const deleteCategory=(params=null)=>http.post('/api/category/delete',params);
const updateCategory=(form)=>http.post('/api/category/update',form);
const getCategory=(id)=>http.post('/api/category/get',{id});
const getCategories=(params=null)=>http.post('/api/category/getByPage',params);
const getPostOfCategory=(params=null)=>http.post('/api/category/getPostOfCategory',params);
const getCategoryTree=(params=null)=>http.post('/api/category/getTree',params);
/**
 * 文章
 */
const addPost=(form)=>http.post('/api/post/add',form);
const deletePost=(params=null)=>http.post('/api/post/delete',params);
const updatePost=(form)=>http.post('/api/post/update',form);
const getPost=(id)=>http.post('/api/post/get',{id});
const getPosts=(params=null)=>http.post('/api/post/getByPage',params);
const getCommentOfPost=(params=null)=>http.post('/api/post/getCommentOfPost',params);
/**
 * 单页
 */
const addSingle=(form)=>http.post('/api/single/add',form);
const deleteSingle=(params=null)=>http.post('/api/single/delete',params);
const updateSingle=(form)=>http.post('/api/single/update',form);
const getSingle=(id)=>http.post('/api/single/get',{id});
const getSingles=(params=null)=>http.post('/api/single/getByPage',params);
/**
* 模版
*/
const addTemplate=(form)=>http.post('/api/template/add',form);
const deleteTemplate=(params=null)=>http.post('/api/template/delete',params);
const updateTemplate=(form)=>http.post('/api/template/update',form);
const getTemplate=(id)=>http.post('/api/template/get',{id});
const getCategoryTemplate=()=>http.get('/api/template/getCategoryTemplate');
const getPostTemplate=()=>http.get('/api/template/getPostTemplate');
const getSingleTemplate=()=>http.get('/api/template/getSingleTemplate');
/**
 * 评论
 */
const updateComment=(params=null)=>http.post('/api/comment/update',params);
const deleteComment=(params=null)=>http.post('/api/comment/delete',params);
const searchComment=(params=null)=>http.post('/api/comment/search',params);
const getComment=(id)=>http.post('/api/comment/get',{id});
export default {
  /**
   *其他
   */
  getAuthMenu,
  logout,
  getDashBoardData,
  /**
   * 管理员
   */
  addAdmin,
  deleteAdmin,
  updateAdmin,
  getAdmin,
  getAdmins,
  /**
   * 角色
   */
  addRole,
  deleteRole,
  updateRole,
  getRole,
  getRoles,
  /**
   * 权限资源
   */
  addAuth,
  deleteAuth,
  updateAuth,
  getAuth,
  getAuths,
  getAuthTree,
  bindAuth,
  /**
   * mail
   */
  addMail,
  deleteMail,
  updateMail,
  getMail,
  getMails,
  sendMail,
  /**
   * 栏目
   */
  addCategory,
  deleteCategory,
  updateCategory,
  getCategory,
  getCategories,
  getPostOfCategory,
  getCategoryTree,
  /**
   * 文章
   */
  addPost,
  deletePost,
  updatePost,
  getPost,
  getPosts,
  getCommentOfPost,
  /**
   * 单页
   */
  addSingle,
  deleteSingle,
  updateSingle,
  getSingle,
  getSingles,
  /**
   * template
   */
  addTemplate,
  deleteTemplate,
  updateTemplate,
  getTemplate,
  getCategoryTemplate,
  getPostTemplate,
  getSingleTemplate,
  /**
   * comment
   */
  updateComment,
  deleteComment,
  searchComment,
  getComment
}
