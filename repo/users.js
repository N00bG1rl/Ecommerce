const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const Repo = require('./repo')

const scrypt = util.promisify(crypto.scrypt)

class UsersRepo extends Repo {
  async create(atr) {
    atr.id = this.randomId()

    const salt = crypto.randomBytes(8).toString('hex')
    const hashed = await scrypt(atr.password, salt, 64)

    const records = await this.getAll()
    const record = {
      ...atr,
      password: `${hashed.toString('hex')}.${salt}`,
    }
    records.push(record)

    await this.writeAll(records)

    return record
  }

  async comparePasswords(saved, supplied) {
    const [hashed, salt] = saved.split('.')
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64)

    return hashed === hashedSuppliedBuf.toString('hex')
  }
}

module.exports = new UsersRepo('users.json')
