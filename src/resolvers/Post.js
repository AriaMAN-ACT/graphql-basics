import {comments, users} from "../db";

export default {
    author({author}) {
        return users.find(({id}) => id === author);
    },
    comments({id}) {
        return comments.filter(({post}) => post === id);
    }
};