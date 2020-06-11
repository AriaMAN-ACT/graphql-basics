import {GraphQLServer} from "graphql-yoga";

const users = [
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
];

const posts = [
    {
        id: '1',
        title: 'dummy post 1',
        body: 'dummy post 1.',
        published: true,
        author: '2'
    },
    {
        id: '2',
        title: 'dummy post 2',
        body: 'dummy post 2.',
        published: false,
        author: '1'
    }
];

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
        posts: [Post!]!
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

const resolvers = {
    Query: {
        users(parentValues, {query = ''}) {
            return users.filter(({name}) => name.toLowerCase().includes(query.toLowerCase()));
        },
        posts(parentValues, {query = ''}) {
            return posts.filter(({title, body}) => `${title}${body}`.toLowerCase().includes(query.toLowerCase()));
        }
    },
    Post: {
        author({author}) {
            return users.find(({id}) => id === author);
        }
    },
    User: {
        posts({id}) {
            return posts.filter(({author}) => id === author);
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