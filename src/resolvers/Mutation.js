import {uuid} from "uuidv4";
import {comments, posts, users} from "../db";

export default {
    createUser(parentValue, {data: {name, email, age}}) {
        if (users.some(({email: userEmail}) => userEmail === email))
            throw new Error('Email taken.');

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
    updateUser(parentValues, {id, data}) {
        const userIndex = users.findIndex(({id: userId}) => userId === id);

        if (userIndex === -1)
            throw new Error('User not found');

        if (data.email && users.some(({email: userEmail}) => userEmail === data.email))
            throw new Error('Email taken.');

        users[userIndex] = {...users[userIndex], ...data};

        return users[userIndex];
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
    updatePost(parentValues, {id, data}) {
        const postIndex = posts.findIndex(({id: postId}) => postId === id);

        if (postIndex === -1)
            throw new Error('Post not found');

        if (data.author && !users.find(user => user.id === data.author))
            throw new Error('Author not found');

        posts[postIndex] = {...posts[postIndex], ...data};

        return posts[postIndex];
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
    },
    updateComment(parentValues, {id, data}) {
        const commentIndex = comments.findIndex(({id: commentId}) => commentId === id);

        if (commentIndex === -1)
            throw new Error('Comment not found');

        if (data.author && !users.find(user => user.id === data.author))
            throw new Error('Author not found');

        if (data.post && !posts.find(post => post.id === data.post))
            throw new Error('Post not found');

        comments[commentIndex] = {...comments[commentIndex], ...data};

        return comments[commentIndex];
    }
};