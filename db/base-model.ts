// import { Prisma } from "@prisma/client"
// import db, { Reactor } from "db"

// type ISetupMethod = {
//   <U, W extends Promise<any>, R extends (args: U) => W, TResult = ReturnType<R>>(
//     fn: (args: U) => W
//   ): (args: U) => Promise<TResult>
// }

// const handler = {
//   get(target, name) {
//     if (target[name]) {
//       return target[name]
//     }
//     throw new TypeError('Getter "' + name + '" not found in Model')
//   },

//   set(target, name) {
//     if (target[name]) {
//       return target[name]
//     }
//     throw new TypeError('Setter "' + name + '" not found Model')
//   },
// }

// class BaseModel<T> {
//   _modelName: Prisma.ModelName

//   constructor() {
//     if (this.constructor === BaseModel) {
//       throw new TypeError('Abstract class "BaseModel" cannot be instantiated directly.')
//     }

//     // TODO: Check that constructor.name is actually a Prisma.ModelName

//     this._modelName = this.constructor.name as Prisma.ModelName
//     if (!db[this._modelName]) {
//       throw new TypeError("There's no Prisma model with the name this.constructor.name]")
//     }
//     db[this._modelName].foreach((fn) => (this[fn.name] = this._setupMethod(fn)))
//   }

//   //   private before = () => {}
//   //   private after = () => {}

//   _setupMethod: ISetupMethod = (fn) => {
//     return async function (args) {
//       await this.before()
//       const result = await fn(args)
//       await this.after()

//       return result
//     }
//   }
// }

// const Model = new Proxy() < typeof BaseModel < Reactor >> (BaseModel, handler)
// class ReactorModel extends Model<Reactor> {}

// const reactor = new ReactorModel()
// const createdAt = reactor._modelName
