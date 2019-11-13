let listService = (function(){
    // Делает заданное колво копий нашего массива
    function dublicateData (arr,count){
        let rez = [];
        for(let i = 0; i <= count; i++){
            rez = rez.concat(arr.map(item => Object.assign(item)));
        }
        return rez;
    }

    // Создаем шаблон строки
    function createTemplate (elem){
        return `<tr>
            <th scope="row">
                <input type="checkbox">
            </th>
            <td>${elem.id}</td>
            <td>${elem.name}</td>
            <td>${elem.username}</td>
            <td>${elem.role}</td>
            <td>${elem.email}</td>
            <td data-toggle="tooltip" title="${elem.address.zipcode},${elem.address.city},${elem.address.street}">${elem.address.city}</td>
            <td>${elem.website}</td>
            <td>
                <div class="center">
                    <a href="#" data-row-id="#{elem.id}" class="btn btn-primary btn-sm">Открыть</a>
                </div>
            </td>
        </tr>`;
    }

    // Сортировка строки AZ
    function sortEmailAZ(a,b){
        return a.email > b.email ? 1 : -1;
    }
    // Сортировка строки ZA
    function sortEmailZA(a,b){
        return a.email < b.email ? 1 : -1;
    }

    // Сортировка строки Admin
    function sortAdmin (item){
        return item.role === "Admin";
    }
    // Сортировка строки User
    function sortUser (item){
        return item.role === "User";
    }
    // Функция наследования
    function inheritance(parent,child){
        let tempChild = child.prototype;

        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;

        for (let key in tempChild){
            if (tempChild.hasOwnProperty(key)){
                child.prototype[key] = tempChild[key];
            }
        }
    }

    // Внешний интерфейс
    return {
        dublicateData,
        createTemplate,
        sortEmailAZ,
        sortEmailZA,
        sortAdmin,
        sortUser,
        inheritance
    }
})();

// let test = listService.dublicateData(users,2);
// console.log(test);