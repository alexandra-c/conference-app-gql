const helloWorldResolvers = {
  Query: {
    myFirstEndpoint: (_parent, _args, { ceVreauEu }, _info) => {
      // return 'Hello World! 🎃 This is coming from GraphQL server ✈'
      return ceVreauEu
    }
  }
}
module.exports = helloWorldResolvers
