import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayLoad = request.only(['email', 'username', 'password', 'avatar'])
    const userByEmail = await User.findBy('email', userPayLoad.email)

    if (userByEmail) return response.conflict({ error: 'email already in use' })

    const user = await User.create(userPayLoad)
    return response.created({ user })
  }
}
