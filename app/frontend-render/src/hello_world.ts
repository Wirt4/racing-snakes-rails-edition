const unusedVar = 42;

function add(a, b) {
	console.log("Adding...");
	return a + b;
}

function add(a, b) {
	return a + b;
}

console.log(add(2, 3));
