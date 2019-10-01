export class User {
    id: number;
    username: string;
    is_admin_of_mador: boolean;
    forumCount: number;
    constructor(id: number, username: string, is_admin_of_mador: boolean, forumCount: number) {
        this.id = id;
        this.username = username;
        this.is_admin_of_mador = is_admin_of_mador;
        this.forumCount = forumCount;
    }
}
