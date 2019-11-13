/* 
*  – Реализация с помощью прототипного наследования
*  – Работа с шаблоном и событиями в целом
*  – Дублирование массива с данными
*  – Работа preventDefault(). 
*  – Пейджинг, кнопка "Далее"
*  – Выбор всех элементов списка
*  – Выбор одного элемента списка
*  – Фильтрация элементов
*  – Сортировка элементов
*  – Поиск элементов по имени
*  – Работа с функцией Reduce
*  – Кастомные data атрибуты
*  – Работа с разными View
*  – Отображение полной информации об элементе
*/
let BaseList = function(){
    this.selectAll = document.querySelector('#selectAll');
    this.userList = document.querySelector('#user-list');
    this.nextBtn = document.querySelector('.btn-next-page');
    this.countRole = document.querySelector('.statsUsers');
    this.emailDropDown = document.querySelector('#dropdown-email');
    this.roleDropDown = document.querySelector('#dropdown-role');
    this.search = document.querySelector('#inputSearch');

    this.userData = [];

    this.pageService = {
        currentPage : 0
    } 
}

BaseList.prototype = {
    initListeners : function(){
        this.selectAll.addEventListener('click', this.selectAllItem.bind(this));
        this.userList.addEventListener('click', this.selectTabLine.bind(this));
        this.emailDropDown.addEventListener('click', this.sortHandler.bind(this));
        this.roleDropDown.addEventListener('click', this.sortHandler.bind(this));
        this.search.addEventListener('keyup', this.searchFunc.bind(this));
    },
    // выбор всех чекбоксов
    selectAllItem : function(){
        let chexkboxes = this.userList.querySelectorAll('input[type="checkbox"]');
        chexkboxes.forEach(elem => {
            this.selectAll.checked ? elem.checked = true : elem.checked = false;
        });
    },
    // Выделение выбраной линии по клику
    selectTabLine : function(event){
        let tabLine = event.currentTarget.querySelectorAll('tr');
        // tabLine.forEach(elem => elem.classList.remove('table-active'));
        tabLine.forEach(elem => elem.style.backgroundColor = 'inherit');
        event.target.closest('tr').classList.add('table-active');
        event.target.closest('tr').style.backgroundColor = 'red';
    },
    // сортировка Users
    sortHandler : function(e){
        e.preventDefault();
        let sortType = e.target.value;
        if (sortType == 0) return;
        sortType && this.applySortMethod(sortType);
    },
    // Функция сортировки по типу
    applySortMethod : function(sortType){
        this.pageService.currentPage = 0;
        this.userList.innerHTML = '';
        this.buildUserList(config.configService[sortType]);
    },
    // Поиск search
    searchFunc : function(e){
        e.preventDefault();
        let value = e.target.value;

        if (e.keyCode === 13 && (value.length === 0 || value.length > 2)){
            this.pageService.currentPage = 0;
            this.userList.innerHTML = '';

            let searchFunction = (page) => {
                let exp = new RegExp(value,"i");
                return page.filter(item => {
                    return exp.test(item.name);
                });
            }
            this.buildUserList(searchFunction);
        } 
    },
    // дублируем массив
    dublicateArr : function(){
        this.userData =  listService.dublicateData(users, 1);
    },
    getPage : function(){
        return this.userData;
    },
    // Постройка списка
    buildUserList : function(filterSortFunction){
        let page = this.getPage();
        filterSortFunction && (page = filterSortFunction(page))
        let result = page.map(elem => listService.createTemplate(elem));
        this.userList.innerHTML += result.join('');
    },
    // Инициализация
    init : function(){
        this.initListeners();
        this.dublicateArr();
        this.buildUserList();
    }
}

// let baseList = new BaseList();
// baseList.init();

// Класс потомок, делает переход на след страницу
let PageListing = function(){
    BaseList.apply(this);
    this.pageService = {
        pageItem : 10,
        currentPage : 0
    }    
}

PageListing.prototype = {
    initListeners : function(){
        BaseList.prototype.initListeners.apply(this);
        this.nextBtn.addEventListener('click', this.getNextPage.bind(this));
    },
    // Построение следущего списка
    getNextPage : function(e){
        e.preventDefault();
        this.buildUserList();
        if(this.isMaxPage()){
            this.disableBtn();
            this.showUserRole();
        }
    },
    // если страница последняя - вернет true
    isMaxPage : function(){
        return (this.pageService.currentPage * this.pageService.pageItem >= this.userData.length);
    },
    // Если страница последняя - блокируем кнопку
    disableBtn : function(){
        this.nextBtn.classList.add('disabled');
    },
    // Отображает счетчик с Admin & user
    showUserRole : function(){
        let info = this.userData.reduce((sum, user) => {
            (user.role === 'Admin') ? sum.admin++ : sum.user++;
            return sum;
        }, {admin:0, user:0});
        this.countRole.innerHTML = `Пользователи : Admin - ${info.admin}, User - ${info.user}`;
    },
    getPage : function(){
        let start = this.pageService.pageItem * this.pageService.currentPage;
        let end = this.pageService.pageItem + start;
        this.pageService.currentPage++;
        return this.userData.slice(start,end);
    }
}

listService.inheritance(BaseList, PageListing);

let pageListing = new PageListing();

pageListing.init();
