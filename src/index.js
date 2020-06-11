import {GraphQLServer} from "graphql-yoga";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

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
    Query,
    Mutation,
    Post,
    User,
    Comment
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers
});

server.start(() => {
    console.log('server is up.')
}).catch(error => {
    console.error(error);
});