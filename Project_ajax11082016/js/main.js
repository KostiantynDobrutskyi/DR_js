var
    table = document.querySelector("#users-table"),
    tbody = document.querySelector(".output"),
    form = document.forms.usersEdit,
    fnameEl = form.fullname,
    birthdayEl = form.birthday,
    professionEl = form.profession,
    addressEl = form.address,
    countryEl = document.querySelector("#country"),
    shortInfoEl = form.shortInfo,
    fullInfoEl = form.fullInfo,
    btnCancel = document.querySelector(".btn-cancel"),
    btnNew = document.querySelector(".btn-new");



loadToTable();
removeBtnHandler();
editBtnHandler();
createBtnHandler();


function loadToTable() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "/user");
    xhr.responseType = "json";
    xhr.send();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState !== this.DONE) {
            return
        }

        for (var i = 0; i < this.response.length; i++) {
            var
                curr = this.response[i],
                tr = document.createElement("tr"),
                td = document.createElement("td"),
                fname = document.createElement("td"),
                profession = document.createElement("td"),
                info = document.createElement("td"),
                div = document.createElement("div"),
                btnEdit = document.createElement("button"),
                btnRemove = document.createElement("button"),
                option = document.createElement("option");

            tr.__source = curr;


            btnEdit.textContent = "Edit";
            btnRemove.textContent = "Remove";
            tr.appendChild(fname);
            tr.appendChild(profession);
            tr.appendChild(info);
            div.appendChild(btnRemove);
            div.appendChild(btnEdit);
            td.appendChild(div);
            tr.appendChild(td);
            btnRemove.setAttribute("id", curr.id);

            fname.appendChild(document.createTextNode(curr.fullName));
            profession.appendChild(document.createTextNode(curr.profession));
            info.appendChild(document.createTextNode(curr.shortInfo));
            tbody.appendChild(tr);

            option.setAttribute("value", curr.country);
            option.textContent = curr.country;
            countryEl.appendChild(option);


        }

    });
}

function removeBtnHandler() {
    table.addEventListener("click", function (e) {
        var
            elem = e.target;
        if (elem.tagName.toLowerCase() === "button" && elem.innerHTML === "Remove") {
            var rem = elem;
            rem = rem.parentElement;
            while (true) {
                if (rem.tagName.toLowerCase() === "tr") {
                    xhr = new XMLHttpRequest();
                    xhr.open("delete", "/user?id=" + elem.id);
                    xhr.send();
                    xhr.addEventListener("readystatechange", function () {
                        if (this.readyState !== this.DONE) {
                            return;
                        }
                        else {

                            rem.remove(rem);
                        }
                    });
                    break
                }
                rem = rem.parentElement;
            }
        }
    })
}

function editBtnHandler() {
    table.addEventListener("click", function (e) {
        var
            elem = e.target,
            curr = elem;
        curr = curr.parentElement;
        if (elem.tagName.toLowerCase() === "button" && elem.innerHTML === "Edit") {
            while (true) {
                if (curr.tagName.toLowerCase() === "tr") {
                    break
                }
                curr = curr.parentElement;
            }
            console.dir(curr);

            var
                data = curr.__source;


            form.classList.remove("users-edit-hidden");
            fnameEl.value = data.fullName;
            birthdayEl.value = data.birthday;
            countryEl.value = data.country;
            professionEl.value = data.profession;
            addressEl.value = data.address;
            shortInfoEl.value = data.shortInfo;
            fullInfoEl.value = data.fullInfo;


            form.addEventListener("submit", function (e) {
                e.preventDefault();
                data.fullName = fnameEl.value;
                data.birthday = birthdayEl.value;
                data.country = countryEl.value;
                data.profession = professionEl.value;
                data.address = addressEl.value;
                data.shortInfo = shortInfoEl.value;
                data.fullInfo = fullInfoEl.value;

                var
                    xhr = new XMLHttpRequest(),
                    dataToSend = JSON.stringify(data);
                xhr.open("put", "/user");
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(dataToSend);

                console.dir(data);
                console.dir(dataToSend);
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }

                form.classList.add("users-edit-hidden");

                loadToTable();

            });

            closeForm()

        }
    })
}

function createBtnHandler() {
    btnNew.addEventListener("click", function (e) {
        form.classList.remove("users-edit-hidden");

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var
                data = {};
            data.fullName = fnameEl.value;
            data.birthday = birthdayEl.value;
            data.country = countryEl.value;
            data.profession = professionEl.value;
            data.address = addressEl.value;
            data.shortInfo = shortInfoEl.value;
            data.fullInfo = fullInfoEl.value;

            var
                xhr = new XMLHttpRequest(),
                dataToSend = JSON.stringify(data);
            xhr.open("post", "/user");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(dataToSend);

            xhr.addEventListener("readystatechange", function () {

                if (xhr.readyState !== xhr.DONE) {
                    return
                }
                else {

                    console.log(data);
                    data = {};

                    while (tbody.firstChild) {
                        tbody.removeChild(tbody.firstChild);
                    }
                    loadToTable();

                    console.log(data);

                    return;
                }

            })

        });
        closeForm();
    })
}

function closeForm() {
    btnCancel.addEventListener("click", function (e) {
        e.preventDefault();
        form.classList.add("users-edit-hidden");
    })
}

