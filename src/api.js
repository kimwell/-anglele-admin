/**
 * 上传文件
 */
export const upload = 'http://192.168.0.252:8081/auth/file/upload'


/**
 * 登录
 */
export const login = '/auth/login'

/**
 * 获取验证码
 */
export const captcha = '/auth/captcha'

/**
 * 获取用户信息
 */
export const findCurrentUser = '/auth/baseuser/findCurrentUser'



/**
 * 查询已分组接口
 */
export const findPermissionListWithTag = '/auth/permission/findPermissionListWithTag'

/**
 * 保存分组名称
 */
export const saveTagsList = '/auth/permission/saveTagsList'

/**
 * 编辑分组名称
 */
export const updateTags = '/auth/permission/updateTags'

/**
 * 查询标签
 */
export const findTagsList = '/auth/permission/findTagsList'

/**
 * 删除分组名称
 */
export const delTags = '/auth/permission/delTags'

/**
 * 接口移回接口池
 */
export const removeTags = '/auth/permission/removeTags'

/**
 * 查询接口池
 */
export const findPermissionListWithOutTag = '/auth/permission/findPermissionListWithOutTag'


/**
 * 删除接口
 */
export const delPermission = '/auth/permission/delPermission'

/**
 * 编辑接口
 */
export const updatePermission = '/auth/permission/updatePermission'

/**
 * 接口分组
 */
export const addPermissionTags = '/auth/permission/addPermissionTags'


/**
 * 应用列表查询
 */
export const findApplicationList = '/auth/application/findApplicationList'


/**
 * 应用查询
 */
export const findApplication = '/auth/application/findApplication'

/**
 * 应用保存
 */
export const saveApplication = '/auth/application/saveApplication'

/**
 * 删除应用
 */
export const delApplication = '/auth/application/delApplication'

/**
 * 菜单列表查询
 */
export const findMenuList = '/auth/menu/findMenuList'


/**
 * 菜单保存
 */
export const saveMenu = '/auth/menu/saveMenu'


/**
 * 菜单更新
 */
export const updateMenu = '/auth/menu/updateMenu'

/**
 * 菜单删除
 */
export const delMenu = '/auth/menu/delMenu'

/**
 * 角色列表查询
 */
export const roleList = '/auth/role/list'

/**
 * 角色编辑保存
 */
export const roleSave = '/auth/role/save'

/**
 * 角色接口查询
 */
export const findPermission = '/auth/role/findPermission'


/**
 * 角色接口保存
 */
export const addPermission = '/auth/role/addPermission'

/**
 * 角色接口删除
 */
export const delRolePermission = '/auth/role/delPermission'

/**
 * 查询用户列表
 */
export const findBaseUserList = '/auth/baseuser/findBaseUserList'

/**
 * 新增用户
 */
export const saveBaseUser = '/auth/baseuser/saveBaseUser'

/**
 * 修改用户
 */
export const updateBaseUser = '/auth/baseuser/updateBaseUser'

/**
 * 修改用户
 */
export const modifyBaseUser = '/auth/baseuser/modifyBaseUser'

/**
 * 角色菜单查询
 */
export const updatePhone = '/auth/baseuser/updatePhone'


/**
 * 角色菜单查询
 */
export const findMenu = '/auth/role/findMenu'


/**
 * 角色菜单查询
 */
export const editMenu = '/auth/role/editMenu'


/**
 * 角色菜单查询
 */
export const syncPermission = '/auth/permission/syncPermission'