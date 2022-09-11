import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayLoad = request.only(['email', 'username', 'password', 'avatar'])

    if (!userPayLoad.email || !userPayLoad.username || !userPayLoad.password)
      throw new BadRequest('provide required data', 422)

    const userByEmail = await User.findBy('email', userPayLoad.email)
    const userByUsername = await User.findBy('username', userPayLoad.username)

    if (userByEmail) throw new BadRequest('email already in use', 409)

    if (userByUsername) throw new BadRequest('username already in use', 409)

    const user = await User.create(userPayLoad)
    return response.created({ user })
  }
}
