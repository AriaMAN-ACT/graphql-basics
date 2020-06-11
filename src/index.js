import {GraphQLServer} from "graphql-yoga";
import {uuid} from 'uuidv4';

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

const comments = [
    {
        id: '1',
        text: 'dummy text 1',
        author: '2',
        post: '1'
    },
    {
        id: '2',
        text: 'dummy text 2',
        author: '1',
        post: '2'
    }
];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query: String): [Comment!]!
    }
    
    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        createComment(text: String!, post: ID!, author: ID!): Comment!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
    
    type Comment {
        id: ID!
        text: String!
        post: Post!
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
        },
        comments(parentValues, {query = ''}) {
            return comments.filter(({text}) => text.toLowerCase().includes(query.toLowerCase()));
        }
    },
    Mutation: {
        createUser(parentValue, {name, email, age}) {
            if (user.some(({userEmail}) => userEmail === email)) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuid(),
                name,
                email,
                age
            };

            users.push(user);

            return user;
        },
        createPost(parentValues, {title, body, published, author}) {
            if (!users.some(({id}) => author === id)) {
                throw new Error('User not found.');
            }

            const post = {
                id: uuid(),
                title,
                body,
                published,
                author
            };

            posts.push(post);

            return post;
        },
        createComment(parentValues, {text, author, post}) {
            if (!users.some(({id}) => id === author)) {
                throw new Error('User not found.');
            }

            if (!posts.some(({id, published}) => id === post && published)) {
                throw new Error('Post not found.');
            }

            const comment = {
                id: uuid(),
                text,
                author,
                post
            };

            comments.push(comment);

            return comment;
        }
    },
    Post: {
        author({author}) {
            return users.find(({id}) => id === author);
        },
        comments({id}) {
            return comments.filter(({post}) => post === id);
        }
    },
    User: {
        posts({id}) {
            return posts.filter(({author}) => id === author);
        },
        comments({id}) {
            return comments.filter(({author}) => id === author);
        }
    },
    Comment: {
        post({post}) {
            return posts.find(({id}) => id === post);
        },
        author({author}) {
            return users.find(({id}) => id === author);
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