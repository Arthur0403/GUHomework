//объект содержащий методы для валидации

var validationMethods = {
    //метод проверки поля по длине
    length(field, args) { //передаем поле и какие то данные (арг - будет массив с аргументами)

        var valLength = field.value.length,
        sign = args[0],
        then = args[1];

        const message = null;
        switch (sign) {
            case '>':
             if((!valLength > then)){
                 message = 'Минимальная длина поля:'+ then+1;
             }
             break;
            case '<':
            if((!valLength < then)){
                message = 'Максимальная длина поля:'+ then-1;
            }
            break;
            case '>=':
            if((!valLength >= then)){
                message = 'Минимальная длинна поля:'+ then;
            }
            break;
            case '<=':
            if((!valLength <= then)){
                message = 'Максимальная длинна поля:'+ then;
            }
            break;
            case '==':
            if(valLength !== then){
                message = 'Длина поля должна равняться: '+ then + 'символам';
            }
            break;
        }
        return message;
    },

    mustContainNumber(field) {//проверяет содержит ли поле только цифры
        if(field.value !== /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/){
            return 'Поле должно содержать только цифры.';
        }

        return null;
    },

    nameValidate(field) {
        if(field.value !== /^[а-яёА-ЯЁ\s]+$/){
            return 'Поле должно содержать только кириллические буквы.';
        }

        return null;
    },

    passwordValidate(field) {
        if(field.value !== /^[a-zA-Z0-9_-]{6,18}$/){
            return 'Поле должно содержать только буквы и цифры.';
        }

        return null;
    },

    commentsValidate(field) {
        if(field.value !== /[^\<\>\[\]%'`]+$/){
            return 'В этом поле запрещены символы квадратных и угловых скобок, процентов, апострофа, амперсанда и одиночных кавычек.';
        }

        return null;
    },
    
}


var form = {
    formEl: null,
    rule: null,
    //инициализация формы
    init(){
        this.formEl = document.querySelector('.my-form');
        this.formEl.addEventListener('submit', function(event){
            this.formSubmit(event);
        })

        this.rules = [
            {
                selector: 'input[name = "name"]', //какой инпут проверяем
                methods: [   //массив с методами, которые нужно проверить у этого селектора
                    {name: 'nameValidate'},
                    {name: 'length', args: ['>=', 1]},
                    {name: 'length', args: ['<=', 50]},
                ],
            },
            {
                selector: 'input[name = "password"]', //какой инпут проверяем
                methods: [   //массив с методами, которые нужно проверить у этого селектора
                    {name: 'passwordValidate'},
                    {name: 'length', args: ['>=', 5]},
                    {name: 'length', args: ['<=', 50]},
                ],
            },
            {
                selector: 'input[name = "phone"]', //какой инпут проверяем
                methods: [   //массив с методами, которые нужно проверить у этого селектора
                    {name: 'mustContainNumber'},
                    {name: 'length', args: ['==', 11]},
                ],
            },
            {
                selector: 'input[name = "comments"]', //какой инпут проверяем
                methods: [   //массив с методами, которые нужно проверить у этого селектора
                    {name: 'commentsValidate'},
                    {name: 'length', args: ['>=', 1]},
                    {name: 'length', args: ['<=', 500]},
                ],
            }
        ];
    },
    //метод который запускается перед отправкой формы
    formSubmit(event){
        if(!this.validate()){
            event.preventDefault(); //останавливаем отправку если непровалидирована
        }
    },
    //проверка всей формы (валидация)
    validate(){
        var isValid = true;
        for (var rule of this.rules) {
            var inputEl = document.querySelector(rule.selector);
            for (var method of rule.methods){
                var validFunction = validationMethods[method.name];
                var errMessage = validFunction(inputEl, method.args); //здесь из функций мы получаем или ноль или ошибку
                if(errMessage) {
                    this.setInvalidField(inputEl, errMessage);
                    isValid = false;
                    break;
                }else{
                    this.setValidField(inputEl);
                }
            }
        }

        return isValid;
    },
//когда пользователь ошибся
    setInvalidField(inputEl, message) {
        var cl = inputEl.classlist;
        cl.remove('is-valid');
        cl.add('is-invalid');

        var hintWrap = inputEl.parentNode.querySelector('invalid-feedback');
        if(!hintWrap) {
            hintWrap = document.createElement('div');
            hintWrap.classlist.add('invalid-feedback');
            inputEl.parentNode.appendChild(hintWrap);
        }
        hintWrap.textContent = message;
        
    },
//когда пользователь не ошибся
    setValidField(inputEl) {
        var cl = inputEl.classlist;
        cl.remove('is-invalid');
        cl.add('is-valid');
    },
};

form.init();