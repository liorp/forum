export class User {
    id: number;
    username: string;
    is_admin_of_mador: boolean;
    forum_count: number;
    constructor(id: number, username: string, is_admin_of_mador: boolean, forum_count: number) {
        this.id = id;
        this.username = username;
        this.is_admin_of_mador = is_admin_of_mador;
        this.forum_count = forum_count;
    }
}
