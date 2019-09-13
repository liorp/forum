export class User {
    id: number;
    username: string;
    isAdmin: boolean;
    forumCount: number;
    constructor(id: number, username: string, isAdmin: boolean, forumCount: number) {
        this.id = id;
        this.username = username;
        this.isAdmin = isAdmin;
        this.forumCount = forumCount;
    }
}
