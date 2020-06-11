import {GraphQLServer} from "graphql-yoga";

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
    }
    
    type User {
        id: ID!
        name: String
        email: String!
        age: Int
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

const resolvers = {
    Query: {
        users(parentValues, {query = ''}) {
            return [
                {
                    id: '1',
                    name: 'John',
                    email: 'john@email.com',
                    age: 16
                },
                {
                    id: '2',
                    name: 'Mark',
                    email: 'mark@email.com'
                }
            ].filter(({name}) => name.toLowerCase().includes(query.toLowerCase()));
        },
        posts(parentValues, {query = ''}) {
            return [
                {
                    id: '1',
                    title: 'dummy post 1',
                    body: 'dummy post 1.',
                    published: true
                },
                {
                    id: '2',
                    title: 'dummy post 2',
                    body: 'dummy post 2.',
                    published: false
                }
            ].filter(({title, body}) => `${title}${body}`.toLowerCase().includes(query.toLowerCase()));
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('server is up.')
});