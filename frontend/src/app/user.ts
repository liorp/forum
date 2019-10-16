export class User {
    id: number;
    username: string;
    name: string;
    is_admin_of_mador: boolean;
    forum_count: number;
    mador: any;
    constructor(id: number, username: string, name: string, is_admin_of_mador: boolean, forum_count: number, mador: any) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.is_admin_of_mador = is_admin_of_mador;
        this.forum_count = forum_count;
        this.mador = mador;
    }
}
