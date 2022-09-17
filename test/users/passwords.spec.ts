import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { assert } from '@japa/preset-adonis'
import mail from 'Config/mail'
import test, { group } from 'japa'
import supertest from 'supertest'

import { UserFactory } from './../../database/factories/index'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Password', (group) => {
  test('it should send an email with forgot password instructions', async (assert) => {
    const user = await UserFactory.create()

    const mailer = Mail.fake()

    await supertest(BASE_URL)
      .post('/forgot-password')
      .send({
        email: user.email,
        resetPasswordUrl: 'url',
      })
      .expect(204)

    const message = mailer.find((mail) => {
      return mail.to![0].address === user.email
    })

    assert.deepEqual(message?.to![0].address, user.email)
    assert.deepEqual(message?.from?.address, 'no-reply@roleplay.com')
    assert.equal(message?.subject, 'Roleplay: Recuperação de Senha')
    assert.include(message?.html!, user.username)

    Mail.restore()
  }).timeout(0)

  test
    .only('it shoud create a reset password token', async (assert) => {
      const user = await UserFactory.create()

      await supertest(BASE_URL)
        .post('/forgot-password')
        .send({
          email: user.email,
          resetPasswordUrl: 'url',
        })
        .expect(204)

      const tokens = await user.related('tokens').query()
      assert.isNotEmpty(tokens)
    })
    .timeout(0)

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
