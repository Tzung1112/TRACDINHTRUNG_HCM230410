
interface UserType {
    id: number;
    name: string;
    point: number;
}

class User {
    private id: number;
    private name: string;
    private point: number;

    constructor(name: string, id: number = Date.now() * Math.random(), point: number = 0) {
        this.id = id;
        this.name = name;
        this.point = point;
    }

    setData() {
        this.name = (document.getElementById("name") as HTMLInputElement).value!;
    }

    getData(): UserType {
        return {
            id: this.id,
            name: this.name,
            point: this.point,
        };
    }

    updateUser(value: any): User {
        Object.assign(this, value);
        return this;
    }

    isHighestScore(highestScore: number): boolean {
        return this.point === highestScore;
    }
}

class UserManager {
    users: User[] = [];

    constructor() {
        let usersLocal = JSON.parse(localStorage.getItem("users") ?? "[]");
        let usersTemp = [];
        for (let i in usersLocal) {
            usersTemp.push(new User(usersLocal[i].name, usersLocal[i].id, usersLocal[i].point));
        }
        this.users = usersTemp;
        this.setTotal();
        this.setPlayer();
        this.renderHtml("table_user");
    }

    createUser(newUser: User) {
        this.users.push(newUser);
        localStorage.setItem("users", JSON.stringify(this.users));
    }

    deleteUser(id: number) {
        this.users = this.users.filter((item) => item.getData().id !== id);
        localStorage.setItem("users", JSON.stringify(this.users));
    }

    setPlayer() {
        (document.getElementById("players") as HTMLInputElement).value = String(this.users.length);
    }

    setTotal() {
        let totalPoints = this.users.reduce((total, user) => total + user.getData().point, 0);
        (document.getElementById("total") as HTMLInputElement).value = String(totalPoints);
    }

    getHighestScore(): number {
        return this.users.reduce((highest, user) => Math.max(highest, user.getData().point), 0);
    }

    updateUser(id: number, updateData: any): void {
        this.users = this.users.map((value, index) => {
            if (value.getData().id == id) {
                value = value.updateUser(updateData);
            }
            return value;
        });
        localStorage.setItem("users", JSON.stringify(this.users));
    }

    renderHtml(idTable: string) {
        let tableEl = document.getElementById(idTable);

        let trString = ``;

        const highestScore = this.getHighestScore();
        const highestScorer = this.users.find((user) => user.isHighestScore(highestScore));

        this.users.map((user, index) => {
            const isHighestScore = user === highestScorer;
            const wClass = isHighestScore ? "w-highest-score" : "";
            const rowClass = isHighestScore ? "top-player" : "";

            trString += `
                <tr class="${rowClass}">
                    <td onclick="handleDelete(${user.getData().id})"><i class="fa-regular fa-circle-xmark"></i></td>
                    <td class="${wClass}">W</td>
                    <td class="name">${user.getData().name}</td>
                    <td><i onclick="minusPoint(${user.getData().id}, ${user.getData().point})" class="fa-solid fa-minus"></i></td>
                    <td>${user.getData().point}</td>
                    <td><i onclick="plushPoint(${user.getData().id}, ${user.getData().point})" class="fa-solid fa-plus"></i></td>
                </tr>
            `;
            return user;
        });

        (tableEl as HTMLElement).innerHTML = trString;
    }
}

let users = new UserManager();

function addUser() {
    let newUser = new User("");
    newUser.setData();
    users.createUser(newUser);
    users.renderHtml("table_user");
    (document.getElementById("name") as HTMLInputElement).value = "";
    users.setTotal();
    users.setPlayer();
}

function handleDelete(id: number) {
    users.deleteUser(id);
    users.renderHtml("table_user");
    users.setTotal();
    users.setPlayer();
}

function plushPoint(userid: number, points: number) {
    let user = users.users.find((car) => car.getData().id == userid);
    let plush = ++points;
    let newData = {
        point: plush,
        name: user?.getData().name,
    };
    users.updateUser(userid, newData);
    users.setTotal();
    users.renderHtml("table_user");
}

function minusPoint(userid: number, points: number): void {
    if (points == 0) {
        return;
    } else {
        let user = users.users.find((car) => car.getData().id == userid);
        let minus = --points;
        let newData = {
            point: minus,
            name: user?.getData().name,
        };
        users.updateUser(userid, newData);
        users.setTotal();
        users.renderHtml("table_user");
    }
}
