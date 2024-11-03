import { manageComment } from './helpers/commentManager.js';
import { mongoose } from 'mongoose';

/**
 * This is the main entrypoint to your Probot app
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
    const pr = context.payload.pull_request;
  
    console.log(":::::::::::::: PULL REQUEST :::::::::::::::::::::");
    console.log(pr);
  
    if (pr.merged) {
      const bodyText = pr.body || '';
      
      // Regex to match the issue URL format in PR body
      const issueLinkRegex = /https:\/\/github\.com\/[\w-]+\/[\w-]+\/issues\/(\d+)/;
      const match = bodyText.match(issueLinkRegex);

      console.log("::::::::::::: MATCH ::::::::::::::")
      console.log(match)
  
      if (match) {
        const issueNumber = match[1];
        console.log(`Detected issue #${issueNumber} linked in PR body.`);
  
        // Optionally, you can perform actions on the issue, like commenting or closing
        await context.octokit.issues.createComment({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          issue_number: issueNumber,
          body: `This issue was resolved by PR #${pr.number} (${pr.html_url})`,
        });
      } else {
        console.log("No linked issue detected in PR body.");
      }
    }
  });
  

  mongoose.connect('mongodb://localhost:27017/GitHub-ProBot')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));
};
