export const assignHunter = async (context) => {

    const commentAuthor = context.payload.comment.user.login;
    const issueData = await context.octokit.issues.get(context.issue());
    const currentAssignees = issueData.data.assignees.map(assignee => assignee.login);

    if (currentAssignees.length)
        return {err: "Error: Issue is already assigned"};
    else {
        await context.octokit.issues.addAssignees(context.issue({
        assignees: [commentAuthor],
        }));

        return {assigned: true};
    }
}