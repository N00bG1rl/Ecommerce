const fs = require('fs')
const crypto = require('crypto')
const util = require('util')
const Repo = require('./repo')

const scrypt = util.promisify(crypto.scrypt)

class UsersRepo extends Repo {
  async create(atr) {
    // Create object and write it into users.json = (atr)
    // { email: 'dkkdf@gmail.com', password: 'dkfj', confirmPassword: 'dkfj', id: 'a58b2abc' }

    // Add id to atr
    atr.id = this.randomId()

    // Encrypt password helpers
    const salt = crypto.randomBytes(8).toString('hex')
    const hashed = await scrypt(atr.password, salt, 64)

    // First get previous users
    const records = await this.getAll()
    // Save it different varjable before push()
    const record = {
      // Get all parameters and override those, who is here
      ...atr,
      password: `${hashed.toString('hex')}.${salt}`,
    }
    records.push(record)

    await this.writeAll(records)

    return record
  }

  async comparePasswords(saved, supplied) {
    // Saved => password saved in our database. 'hashed.salt'
    // Supplied => password given to us by a user trying sign in

    // const result = saved.split('.')
    // const hashed = result[0]
    // const salt = result[1]

    // Destructured from array, where hash = result[0],
    // and is asigned to hashed variable, ...
    const [hashed, salt] = saved.split('.')

    // Encrypt supplied password
    // It returns buffer, so we need to convert it into str
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64)

    // Compared saved and supplied passwords
    return hashed === hashedSuppliedBuf.toString('hex')
  }
}

// Use it in another file as:
// const repo = require('./users)
// repo.getAll() ....
module.exports = new UsersRepo('users.json')
