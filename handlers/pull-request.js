import { getBountyId } from '../db/data-base.js'
import { submitMilestones } from '../evm_commands/submit-milestone.js'
import { getBountyById } from '../evm_commands/get-bounty-by-id.js';

export const managePullRequest = async (context) => {
  try {
      const pr = context.payload.pull_request;

      if (pr.merged) {
        const bodyText = pr.body || '';
        // Regex to match the issue URL format in PR body
        const issueLinkRegex = /https:\/\/github\.com\/[\w-]+\/[\w-]+\/issues\/(\d+)/;
        const match = bodyText.match(issueLinkRegex);
    
        if (match) {
          let body = `This issue was resolved by PR #${pr.number}`;
          const issueNumber = match[1];
          console.log(`Detected issue #${issueNumber} linked in PR body.`);

          const issueUrl = match[0];
          const bountyId = await getBountyId(issueUrl);

          if (bountyId){
            
            const bountyData = await getBountyById(bountyId);

            if (bountyData.strategyState){

              if (bountyData.hunter){
                const submittedMilestoneData = await submitMilestones(bountyId, pr.html_url);
                body += `\n\n🟢 Milestone has been submitted`;
              }
            }
          }

          await context.octokit.issues.createComment({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            issue_number: issueNumber,
            body: body,
          });
        }
      }
  }
  catch(err){
      console.log(`Error: managePullRequest ${err}`)
      return {err: err};
  }
}