import {comments, posts} from "../db";

export default {
    posts({id}) {
        return posts.filter(({author}) => id === author);
    },
    comments({id}) {
        return comments.filter(({author}) => id === author);
    }
};