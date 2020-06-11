import {posts, users} from "../db";

export default {
    post({post}) {
        return posts.find(({id}) => id === post);
    },
    author({author}) {
        return users.find(({id}) => id === author);
    }
};