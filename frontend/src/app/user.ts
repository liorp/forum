export class User {
    username: string;
    isAdmin: boolean;
    forumCount: number;
    constructor(username: string, isAdmin: boolean, forumCount: number) {
        this.username = username;
        this.isAdmin = isAdmin;
        this.forumCount = forumCount;
    }
}
