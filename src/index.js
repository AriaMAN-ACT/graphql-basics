import {GraphQLServer} from "graphql-yoga";

const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }
    
    type User {
        id: ID!
        name: String
        email: String!
        age: Int!
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
        me() {
            return {
                id: 'dsfasdf',
                name: 'Aria Azadi Pour',
                email: 'aria.azadi.pour@protonmail.com',
                age: 16
            };
        },
        post() {
            return {
                id: 'fadsgasgdfbd',
                title: 'Hello my darling',
                body: 'I don\'t want to see you.',
                published: false
            }
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