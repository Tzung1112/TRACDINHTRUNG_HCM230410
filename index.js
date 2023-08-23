"use strict";
class User {
    constructor(name, id = Date.now() * Math.random(), point = 0) {
        this.id = id;
        this.name = name;
        this.point = point;
    }
    setData() {
        this.name = document.getElementById("name").value;
    }
    getData() {
        return {
            id: this.id,
            name: this.name,
            point: this.point,
        };
    }
    updateUser(value) {
        Object.assign(this, value);
        return this;
    }
    isHighestScore(highestScore) {
        return this.point === highestScore;
    }
}
class UserManager {
    constructor() {
        var _a;
        this.users = [];
        let usersLocal = JSON.parse((_a = localStorage.getItem("users")) !== null && _a !== void 0 ? _a : "[]");
        let usersTemp = [];
        for (let i in usersLocal) {
            usersTemp.push(new User(usersLocal[i].name, usersLocal[i].id, usersLocal[i].point));
        }
        this.users = usersTemp;
        this.setTotal();
        this.setPlayer();
        this.renderHtml("table_user");
    }
    createUser(newUser) {
        this.users.push(newUser);
        localStorage.setItem("users", JSON.stringify(this.users));
    }
    deleteUser(id) {
        this.users = this.users.filter((item) => item.getData().id !== id);
        localStorage.setItem("users", JSON.stringify(this.users));
    }
    setPlayer() {
        document.getElementById("players").value = String(this.users.length);
    }
    setTotal() {
        let totalPoints = this.users.reduce((total, user) => total + user.getData().point, 0);
        document.getElementById("total").value = String(totalPoints);
    }
    getHighestScore() {
        return this.users.reduce((highest, user) => Math.max(highest, user.getData().point), 0);
    }
    updateUser(id, updateData) {
        this.users = this.users.map((value, index) => {
            if (value.getData().id == id) {
                value = value.updateUser(updateData);
            }
            return value;
        });
        localStorage.setItem("users", JSON.stringify(this.users));
    }
    renderHtml(idTable) {
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
        tableEl.innerHTML = trString;
    }
}
let users = new UserManager();
function addUser() {
    let newUser = new User("");
    newUser.setData();
    users.createUser(newUser);
    users.renderHtml("table_user");
    document.getElementById("name").value = "";
    users.setTotal();
    users.setPlayer();
}
function handleDelete(id) {
    users.deleteUser(id);
    users.renderHtml("table_user");
    users.setTotal();
    users.setPlayer();
}
function plushPoint(userid, points) {
    let user = users.users.find((car) => car.getData().id == userid);
    let plush = ++points;
    let newData = {
        point: plush,
        name: user === null || user === void 0 ? void 0 : user.getData().name,
    };
    users.updateUser(userid, newData);
    users.setTotal();
    users.renderHtml("table_user");
}
function minusPoint(userid, points) {
    if (points == 0) {
        return;
    }
    else {
        let user = users.users.find((car) => car.getData().id == userid);
        let minus = --points;
        let newData = {
            point: minus,
            name: user === null || user === void 0 ? void 0 : user.getData().name,
        };
        users.updateUser(userid, newData);
        users.setTotal();
        users.renderHtml("table_user");
    }
}
