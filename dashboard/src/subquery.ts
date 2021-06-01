import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'http://localhost:3000'
  // uri: 'https://api.subquery.network/sq/vikiival/magick'
})

export default apolloClient
