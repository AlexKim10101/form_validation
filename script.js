'use strict';

// Код валидации формы

function validateForm(form){
	//запоминаем значения полей во внутренние переменные
	var formId = form.formId;
	var formValidClass = form.formValidClass;
	var formInvalidClass = form.formInvalidClass;
	var inputErrorClass = form.inputErrorClass;

	var thisForm = document.getElementById(formId);

	//
	thisForm.addEventListener('focus', focusInput, true);
	thisForm.addEventListener('blur', blurInput, true);
	thisForm.addEventListener('submit', validateSubmit);


	function blurInput(event){
		var _event = event.target;
		validateInput(_event);
	
	}

	function focusInput(event){
		var _event = event.target;
		if (_event.classList.contains(inputErrorClass)){
			_event.classList.remove(inputErrorClass);
		}
	}

	function validateSubmit(event){
		//отменяем отправку формы
		event.preventDefault();
		var valid = true;
		//удаляем классы "валидности" если они есть
		if (thisForm.classList.contains(formValidClass)){
			thisForm.classList.remove(formValidClass);
		}
		if (thisForm.classList.contains(formInvalidClass)){
			thisForm.classList.remove(formInvalidClass);
		}

		//создаем массив input и проверяем на корректность внесенных данных
		var elemsList = Array.from(thisForm.querySelectorAll('input'));
		for(var i in elemsList){
			validateInput(elemsList[i]);
			
		}

		
		for(var i in elemsList){
			if (elemsList[i].classList.contains(inputErrorClass)){
				valid = false;
			}
			
		}

		if (valid){
			thisForm.className += ' '+formValidClass;
		}
		else{
			thisForm.className += ' '+formInvalidClass;
		}

	}




    function validateInput(_event){
    	//проверка на обязательное заполнение 
		if((_event.hasAttribute('data-required'))&(_event.value == '')){	
			_event.className +=' '+ inputErrorClass;
			
			return;
		}

		//если заполнение необязательно выходим из функции
		if(_event.value == ''){
			return;
		}

		//проверяем наличие data-validator		
		if(_event.hasAttribute('data-validator')){
			//для data-validator == 'number'
			if(_event.dataset.validator == 'number'){
				if(isNaN(_event.value)){
					_event.className +=' '+ inputErrorClass;
					return;
				}

				if(_event.hasAttribute('data-validator-min')){
					var min = parseInt(_event.dataset.validatorMin);					
				}

				if(_event.hasAttribute('data-validator-max')){
					var max = parseInt(_event.dataset.validatorMax);						
				}

				if((_event.value < min)||(_event.value > max)){
					_event.className +=' '+ inputErrorClass;
					return;
				}
			}

			//для data-validator == 'letters'

			if(_event.dataset.validator == 'letters'){
				
				var rus = /[а-яё]+/i.test(_event.value);
				var lat = /[a-z]+/i.test(_event.value);
				var num = /[0-9]+/.test(_event.value);

				if (((rus)&&(!lat)&&(!num))||((!rus)&&(lat)&&(!num))){
					return;
				}
				else {
					_event.className +=' '+ inputErrorClass;
					return;
				}

			}

			//для data-validator == 'regexp'

			if(_event.dataset.validator == 'regexp'){
				var reg = new RegExp(_event.dataset.validatorPattern);
				if (!reg.test(_event.value)){
					_event.className +=' '+ inputErrorClass;
					return;
				}
			}	

		}

    }	

}


