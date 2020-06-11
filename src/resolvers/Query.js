import {comments, posts, users} from "../db";

export default {
    users(parentValues, {query = ''}) {
        return users.filter(({name}) => name.toLowerCase().includes(query.toLowerCase()));
    },
    posts(parentValues, {query = ''}) {
        return posts.filter(({title, body}) => `${title}${body}`.toLowerCase().includes(query.toLowerCase()));
    },
    comments(parentValues, {query = ''}) {
        return comments.filter(({text}) => text.toLowerCase().includes(query.toLowerCase()));
    }
};