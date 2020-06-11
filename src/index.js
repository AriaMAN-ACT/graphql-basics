import {GraphQLServer} from "graphql-yoga";
import {uuid} from 'uuidv4';

Array.prototype.removeIf = function (callback) {
    let i = 0;
    while (i < this.length) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        } else {
            ++i;
        }
    }
};

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
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment
    }
    
    input CreateUserInput {
        name: String!
        email: String!
        age Int
    }
    
    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }
    
    input CreateCommentInput {
        text: String!
        post: ID!
        author: ID!
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
        createUser(parentValue, {data: {name, email, age}}) {
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
        deleteUser(parentValues, {id}) {
            const userIndex = users.findIndex(({id: userId}) => userId === id);

            if (userIndex === -1)
                throw new Error('User not found');

            users.splice(userIndex, 1);

            let i = 0;
            while (i < posts.length) {
                if (posts[i].author === id) {
                    posts.splice(i, 1);
                    comments.removeIf(({post}) => post === posts[i].id);
                } else {
                    ++i;
                }
            }

            comments.removeIf(({author}) => author === id);

            return null;
        },
        createPost(parentValues, {data: {title, body, published, author}}) {
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
        deletePost(parentValues, {id}) {
            const postIndex = posts.findIndex(({id: postId}) => postId === id);

            if (postIndex === -1)
                throw new Error('Post not found.');

            posts.splice(postIndex, 1);

            comments.removeIf(({post}) => post === id);

            return null;
        },
        createComment(parentValues, {data: {text, author, post}}) {
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
        },
        deleteComment(parentValues, {id}) {
            const commentIndex = comments.findIndex(({id: commentId}) => commentId === id);

            if (commentIndex === -1)
                throw new Error('Comment not found');

            comments.splice(commentIndex, 1);

            return null;
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