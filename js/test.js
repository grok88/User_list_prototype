function copyArr(arr,count){
	let rez = [];
	for(let i = 0; i <= count;i++){
		rez = rez.concat(arr.map(elem => Object.assign({}, elem)));
	}
	return rez;
}
let test = [{name:1,age:20},{name:2,age:30},{name:3,age:30}];
//let resultTest = [...test];
let resultSlice = test.slice();
let result = copyArr(test,1);
console.log(`RESULT - ${result}`);
console.log(`TEST - ${test}`);
console.log(result);
console.log(test);
console.log(resultSlice);
resultSlice[0].name = 'GROK';
// console.log(resultTest);
// resultTest[0].name = 'Alex';

result[0].name = 'Dota';

