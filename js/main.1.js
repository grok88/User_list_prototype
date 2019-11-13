function BasicList(){
    this.mainBlock = document.querySelector('.mainBlock'),
    this.userList = document.querySelector('#user-list');
    
    this.statsUsers = document.querySelector('.statsUsers');
    this.dropdownEmail = document.querySelector('#dropdown-email');
    this.dropdownRole = document.querySelector('#dropdown-role');
    this.selectAll = document.querySelector('#selectAll');
    this.inputSearch = document.querySelector('#inputSearch');
    this.btnBackM = document.querySelector('.btnBack');
    this.listData = [];
    this.pageService = {
            currentPage: 0
        };
}//
    
BasicList.prototype = {
    initListener: function(){
        
        this.userList.addEventListener('click', this.tableLinerHandler.bind(this));
        this.dropdownEmail.addEventListener('click',this.sortingHandler.bind(this));
        this.dropdownRole.addEventListener('click',this.sortingHandler.bind(this));
        this.selectAll.addEventListener('click', this.selectAllItems.bind(this));
        this.inputSearch.addEventListener('keyup', this.searchHandler.bind(this));
        
       
        
    },//    


    //ф-ция поиска
    searchHandler: function(event){
        event.preventDefault();
        let value = event.target.value;    
       
        if (event.keyCode === 13 && (value.length == 0 || value.length >=2)){
            this.applySortingMethod("Find")
        } 
    },//

    // ф-ция изменение чеков при выборе всех
    selectAllItems: function(){
        let checkboxes = this.userList.querySelectorAll("input[type=checkbox]");
        checkboxes.forEach( (item) =>{ this.selectAll.checked? item.checked = true: item.checked = false  } )
    },


    // ф-ция присваивает надпись выбранного пункта меню, и определяем какой тип сортироки выбран
    sortingHandler: function(event){
        event.preventDefault();
        event.currentTarget.querySelector('button').innerHTML = event.target.innerHTML;
        let sortingType = event.target.getAttribute('sorting-type');
        sortingType && this.applySortingMethod(sortingType);
    },//

    // применяет сортировку 
    applySortingMethod: function(sortingType){
        this.userList.innerHTML = '';
        this.pageService.currentPage = 0;
        this.buildUsersList(config.sortingConfig[sortingType]);
    },//


    dublicateData: function(){
        this.listData = listService.duplicateData(users,1);
        console.log(this.listData);
    },//

    // нажали на строке значит ее надо выделить
    fillSelectStrip: function(event){
        let linesTable = event.currentTarget.querySelectorAll("tr");
        linesTable.forEach( (element) => { element.classList.remove('table-active')});
        event.target.closest('tr').classList.add('table-active');
    },//

    // нажаи на кнопке открыть  -> открывает карточку 
    openWindowInfo: function(id){
        this.mainBlock.innerHTML = '';
        let res = this.listData.find( (item) => {return item.id == id});
        this.mainBlock.innerHTML = listService.windowInfoUser(res);
    },//

     //обработчик где нажали на кнопку открыть или на самой строке
     tableLinerHandler: function(event){
        event.preventDefault();
        let isButton = event.target.getAttribute("data-row-id");
        (isButton)? this.openWindowInfo(isButton) : this.fillSelectStrip(event);
    },//

    getPage: function(){
       return this.listData;
    },//
    
    // постройка списка
    buildUsersList: function(sortingType){
        let page = this.getPage();
        sortingType && (page = sortingType(page));
        let res = page.map( (item) => {return listService.templateRowTable(item)} );
        this.userList.innerHTML += res.join('');
        listService.initTooltip();
    },//

      
    initComponent: function(){
        this.dublicateData();
        this.buildUsersList();
        this.initListener();
    }    

    
}
// let basicList = new BasicList();
// basicList.initComponent();
/***********************************************************************/

function PagingList(){
    BasicList.apply(this);
    this.btnNextPage = document.querySelector('.btn-next-page');
    this.pageService = {
            itemPerPage: 5,
            currentPage: 0
        };
}

PagingList.prototype = {
    initListener: function(){
        BasicList.prototype.initListener.apply(this);
        this.btnNextPage.addEventListener('click', this.getNextPageHandler.bind(this));
        this.btnBackM.addEventListener('click', this.backMainList.bind(this));
    },//
    
    backMainList: function(event){
        event.preventDefault();
        this.mainBlock.innerHTML = '';
        this.buildUsersList();
    },//
    
    getPage : function(){
        let start = this.pageService.itemPerPage * this.pageService.currentPage;
        let end = this.pageService.itemPerPage + start;
        this.pageService.currentPage++;
        return this.listData.slice(start,end);
    },
    
    //обрабатывает данные при переходе на след страницу.
    getNextPageHandler: function(event){
            event && event.preventDefault();
            this.buildUsersList();
            if( this.isMax() ){
                this.blockNextPageHide();
                this.stateCount();
            }  
        },//
    // проверка не конец ли данных
    isMax: function(){
        return this.pageService.currentPage * this.pageService.itemPerPage > this.listData.length;
    },//
    
    blockNextPageHide: function(event){
        this.btnNextPage.classList.add('disabled');
    },//
        
    // если болеше нет данных для показа отображает данные по пользователям.
    stateCount: function(){
        let stats = this.listData.reduce( (sum, item) => {
            (item.role == "Admin")? sum.admin++ : sum.user++ ;
            return sum;
        }, {admin:0,user:0});
        statsUsers.innerHTML = `Статистика пользователей: Админов: ${stats.admin}, Пользователей: ${stats.user}`
    },//
}

listService.inheritance(BasicList, PagingList);

let pagingList = new PagingList();
pagingList.initComponent();