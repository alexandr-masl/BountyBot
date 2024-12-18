import { manageComment } from './handlers/comment.js';
import { managePullRequest } from './handlers/pull-request.js';
import { manageUnassigned } from './handlers/unassigned.js';
import { manageIssueClosed } from './handlers/issue-closed.js';
import { mongoose } from 'mongoose';

/**
 * The main entrypoint to the Probot app
 * @param {import('probot').Probot} app
 */

export default (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("issue_comment.created", async (context) => {
    await manageComment(context);
  });

  app.on("pull_request.closed", async (context) => {
    await managePullRequest(context);
  });

  app.on("issues.unassigned", async (context) => {
    await manageUnassigned(context);
  });

  app.on("issues.closed", async (context) => {
    await manageIssueClosed(context);
  });


  mongoose.connect('mongodb://localhost:27017/GitHub-ProBot')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));
};
