import { Request, Response } from 'express'
import { validate } from 'class-validator'
import { CLog } from '../AppHelper.js'
import gDB from '../InitDataSource.js'
import { UserEntity } from '../entity/User.entity.js'

class UserController {
  static db = gDB.getRepository(UserEntity)
}

export default UserController
