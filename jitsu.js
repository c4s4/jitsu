importPackage(javax.script.argv);

////////////////////////////////////////////////////////////////////////////////
//                        UTILITY FUNCTIONS FOR TESTS                         //
////////////////////////////////////////////////////////////////////////////////

function assertEqual(expected, actual, message) {
    if(expected != actual) {
        if(message) throw message;
        else throw "'" + expected + "' expected to be equal to '" + actual + "'";
    }
}

function assertNotEqual(expected, actual, message) {
    if(expected == actual) {
        if(message) throw message;
        else throw "'" + expected + "' expected not to be equal to '" + actual + "'";
    }
}

function assertStrictEqual(expected, actual, message) {
    if(expected !== actual) {
        if(message) throw message;
        else throw "'" + expected + "' expected to be strictly equal to '" + actual + "'";
    }
}

function assertStrictNotEqual(expected, actual, message) {
    if(expected === actual) {
        if(message) throw message;
        else throw "'" + expected + "' expected not to be strictly equal to '" + actual + "'";
    }
}

function assertTrue(actual, message) {
    if(!actual) {
        if(message) throw message;
        else throw "'" + actual + "' was supposed to be true";
    }
}

function assertFalse(actual, message) {
    if(actual) {
        if(message) throw message;
        else throw "'" + actual + "' was supposed to be false";
    }
}

function assertRaise(testFunction, pattern, message) {
    var error = false;
    var errorMessage = null;
    try {
        testFunction();
    } catch(exception) {
        error = true;
        errorMessage = String(exception);
    }
    if(message && (!error || !errorMessage.match(pattern))) throw message;
    else {
        if(!error) throw "No exception was raised";
        if(error && !errorMessage.match(pattern)) throw "Error message doesn't match pattern";
    }
}

////////////////////////////////////////////////////////////////////////////////
//                             UNIT TEST RUNNER                               //
////////////////////////////////////////////////////////////////////////////////

var errors = {};
var error = false;

function getNames() {
    var names = [];
    for (var name in this) {
        names.push(name);
    }
    return names;
}

function arrayContains(aray, element) {
    for(var i=0; i<aray.length; i++) {
        if(aray[i] == element) return true;
    }
    return false;
}

function runTestFile(testFileName) {
    var namesBefore = getNames();
    load(testFileName);
    var functions = lookupTestFunctions(namesBefore);

    runTests(testFileName, functions);

    deleteAllThatWasDefinedLoadingAndRunningTestfile(namesBefore);
    
}
function lookupTestFunctions(namesBefore) {
    var namesAfter = getNames();
    var functions = [];
    for(var index in namesAfter) {
        var name = namesAfter[index];
        if(!arrayContains(namesBefore, name)) {
            if(typeof(this[name]) == "function" && name.match(/^test/)) {
                functions.push(name);
            }
        }
    }
    return functions;
}

function runTests(testFileName, functions) {
    var testOK = true;
    print("Running '" + testFileName + "'");
    out.flush();

    for(var index in functions) {
        print(".");
        out.flush();
        if(this.setUp) setUp();
        try {
            this[functions[index]]();
        } catch(exception) {
            if(!errors[testFileName]) {
                errors[testFileName] = {};
            }
            errors[testFileName][functions[index]] = String(exception);
            error = true;
            testOK = false;
        }
        if(this.tearDown) tearDown();
    }
    if(testOK) println(" OK");
    else println(" ERROR");
}

function deleteAllThatWasDefinedLoadingAndRunningTestfile(namesBefore) {
    var namesAfter = getNames();
    for(var index in namesAfter) {
        var name = namesAfter[index];
        if(!arrayContains(namesBefore, name)) {
            delete this[name];
        }
    }
}

println("Loading " + arguments.length + " JavaScript test file(s)");
for(var i=0; i<arguments.length; i++) {
    runTestFile(String(arguments[i]));
}

if(error) {
    println("ERRORS:");
    for(var testFileName in errors) {
        println(testFileName + ":");
        for(var functionName in errors[testFileName]) {
            println("- " + functionName + ": " + errors[testFileName][functionName]);
        }
    }
    exit(1);
} else {
    println("OK");
}
