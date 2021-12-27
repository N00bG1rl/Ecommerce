const fs = require('fs')
const crypto = require('crypto')
const util = require('util')

const scrypt = util.promisify(crypto.scrypt)

class UsersRepo {
  constructor(filename) {
    if (!filename) {
      throw new Error('Creating a repository requires a filename.')
    }

    this.filename = filename
    try {
      fs.accessSync(this.filename)
    } catch (err) {
      fs.writeFileSync(this.filename, '[]')
    }
  }

  async getAll() {
    // Open the file called this.filename
    // Refactored from bottom
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: 'utf8',
      })
    )

    // Read its contents
    //console.log(contents)

    // Parse the contents
    //const data = JSON.parse(contents)

    // Return the parsed data
    //return data
  }

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

  async writeAll(records) {
    // Write the updated 'records' array back to this.filename
    // null and 2 is formating json into two
    await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
  }

  // Generate random id with crypto
  randomId() {
    return crypto.randomBytes(4).toString('hex')
  }

  // Get record with id method
  async getOne(id) {
    // Get all records
    const records = await this.getAll()
    // Find id from JSON array
    return records.find(record => record.id === id)
  }

  // Delete record by id method
  async delete(id) {
    const records = await this.getAll()

    // Filter out id that is passed in(id), return true if that record
    // is not === to (id)
    const filteredRecords = records.filter(record => record.id !== id)
    await this.writeAll(filteredRecords)
  }

  // Update record method
  async update(id, atr) {
    const records = await this.getAll()
    const record = records.find(record => record.id === id)

    if (!record) {
      throw new Error(`Record with id ${id} not found.`)
    }

    Object.assign(record, atr)
    await this.writeAll(records)
  }

  // Filter/find one with any args
  async getOneBy(filters) {
    const records = await this.getAll()

    // for of loop for arrays
    // Iterate over all records in users.json
    for (let record of records) {
      let found = true

      // for in loop for objects
      // Iterate over filters object
      for (let key in filters) {
        // Get records value[key] pair and compare
        // it with filters value[key] pair
        if (record[key] !== filters[key]) {
          // If match is not found, return false
          found = false
        }
      }

      // If found is true
      if (found) {
        // If there is match, return correct key:value pair
        return record
      }
    }
  }
}

// module.exports = UsersRepo

// Longer export is better because it prevents write location
// miss spelling,for exsample ('user.json').

// Use it in another file as:
// const repo = require('./users)
// repo.getAll() ....
module.exports = new UsersRepo('users.json')

// // Func for testing result
// //  await is only valid in async functions and the top level bodies of modules
// const test = async () => {
//   // Get access to repo
//   const repo = new UsersRepo('users.json')

//   // Save new file/object into it
//   //await repo.create({ email: 'test@test.com', password: 'password' })

//   // Get all the records that is saved
//   //const users = await repo.getAll()

//   // Get one user by id
//   //const user = await repo.getOne('a58b2abc')

//   // Delete one record by id
//   //await repo.delete('a58b2abc')

//   // Update one record by id, first arg is id, sec is object to update
//   //await repo.update('579b9537', { password: 'updated' })

//   // Filter from JSON
//   const user = await repo.getOneBy({ id: '579b9537' })

//   console.log(user)
// }
// test()
