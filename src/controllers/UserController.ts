import { Request, Response } from 'express'
import gDB from '../InitDataSource'
import { UserEntity } from '../entity/User.entity'
import { validate } from 'class-validator'
import { CLog } from '../AppHelper'

class UserController {
  static db = gDB.getRepository(UserEntity)
}

export default UserController
