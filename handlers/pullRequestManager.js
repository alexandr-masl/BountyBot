import { getBountyId } from '../db/dataBase.js'
import { submitMilestones } from '../evm_commands/submitMilestone.js'


export const managePullRequest = async (context) => {
    try {
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

            const issueUrl = match[0];
            const bountyId = await getBountyId(issueUrl);
            
            console.log("::::::::::::: BOUNTY ID ::::::::::::::")
            console.log(bountyId)

            let body = `This issue was resolved by PR #${pr.number} (${pr.html_url})`

            if (bountyId){
              
              const submittedMilestoneData = await submitMilestones(bountyId, pr.html_url);

              body += `\n\nMilestone has been submitted`;
            }
      
            // Optionally, you can perform actions on the issue, like commenting or closing
            await context.octokit.issues.createComment({
              owner: context.payload.repository.owner.login,
              repo: context.payload.repository.name,
              issue_number: issueNumber,
              body: body,
            });

          } else {
            console.log("No linked issue detected in PR body.");
          }
        }
    }
    catch(err){
        console.log(`Error: managePullRequest ${err}`)
        return {err: err};
    }
}