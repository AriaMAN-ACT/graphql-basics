import {GraphQLServer} from "graphql-yoga";
import {uuid} from 'uuidv4';

import {users, posts, comments} from "./db";

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
    typeDefs: './src/schema.graphql',
    resolvers
});

server.start(() => {
    console.log('server is up.')
});