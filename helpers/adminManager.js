export const isAdminUser = async (context) => {
    const username = context.payload.comment
        ? context.payload.comment.user.login  // for issue comments
        : context.payload.sender.login;       // for other events

    try {
        const { data } = await context.octokit.repos.getCollaboratorPermissionLevel({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            username: username,
        });

        return data.permission === "admin";
    } catch (error) {
        console.error("Error fetching user permissions:", error);
        return false;
    }
};
