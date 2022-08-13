import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import connectDB from "./database";
import errorHandler from "./middlewares/error.handler"
// TODO: Add graphql after vanilla mongoose
//  - imports for graphql
// import { graphqlHTTP } from "express-graphql";
// import { buildSchema } from "graphql";
// import axios from "axios";

import cors from "cors";
import AppRouter from "./routes";

const app = express();
const router = new AppRouter(app);

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

router.init();

app.use(errorHandler)


// TODO: Move that to model GraphQL
// const schema = buildSchema(`
//   type Query {
//     todos: String
//   }
// `);

// TODO: Create graphQL controller
// const rootValue = {
//     todos: async () => {
//         // TODO: Create http service for that
//         const todos = await axios.get("http://localhost:5000/api/todos");
//         return todos.data;
//     },
// };


// TODO: Move that to router init function ONLY AFTER MAIN PART OF APP
// app.use("/graphql", graphqlHTTP({
//     schema,
//     rootValue,
//     graphiql: true
// }));

const port = app.get("port");
const server = app.listen(port, () =>
    // tslint:disable-next-line:no-console
    console.log(`Server started on port ${port}`)
);