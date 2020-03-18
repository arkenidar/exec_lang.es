const scope = {define, block, execute, ternary, log, set, get, sum, subtraction, multiplication, stack:[]};

if(false)
console.log('execute returned',
    define(["block", // multiple executables as one
        ["log",1], // logging test
        ["log",["set","a",2]], // setting a variable, returns
        ["log",["quote",["set","a",5]]], // [quote] prevents execution, returns
        ["log",["execute",["get","a"]]], // [execute], getting from a variable, returns
        ["sum",["get","a"],2], // [sum], [block] returns last result
    ])()
);
if(false)
execute(
    ["block", // 2 executables as 1
        ["set","f",["define",["quote",["log","[define] works"]]]], // create function f
        ["f"] // use function f
    ]
);
if(false)
execute(
    ["block", // 2 executables as 1
        ["set","f",["define",["quote",["log",
        ["get",0], // get first parameter
        ]]
        ]], // create function f
        ["f","parameter"] // use function f with parameter
    ]
);
if(false)
execute( // sum
    ["block", // 2 executables as 1
        ["set","f",["define",["quote",["sum",
            ["get",0], // get first parameter
            ["get",1], // get second parameter
        ]]
        ]], // create function f
        ["log",["f",2,3]], // use function f with parameter
    ]
);

execute(["block",
    // create function [factor]
    ["set","factor",["define",["quote",
        ["ternary",["get",0],
            ["quote",
                ["multiplication",
                    ["get",0],
                    ["factor",["subtraction",["get",0],1]],
                ]
            ]
            ,
            1
        ]
    ]
    ]],
    // use function [factor] with parameter
    ["log",["factor",3]],
]
);

function multiplication(a, b) {
    return a*b;
}
function subtraction(a, b) {
    return a-b;
}
function ternary(a, b, c) {
    return a ? execute(b) : execute(c);
}

function execute(executable) {
    if (!Array.isArray(executable)) return executable;
    const first = executable[0];
    const rest = executable.slice(1);
    if ('quote' === first) {
        return rest[0];
    } else if (typeof scope[first] != 'function') {
        if (typeof scope[first] == 'undefined')
            console.log('verb undefined in scope[]',first)
        return executable;
    } else {
        return scope[first].apply(scope, first === 'block' ? rest : rest.map(execute));
    }
}

function define(program) {
    return function defined() {
        scope.stack.push(arguments);
        const returned=execute(program);
        scope.stack.pop();
        return returned;
    }
}

function block(...statements) {
    let returned;
    for (let statement of statements) {
        returned = execute(statement);
    }
    return returned;
}

function set(to, from) {
    return scope[to] = from;
}

function get(from) {
    if(typeof from=='number')
        return scope.stack[scope.stack.length-1][from];
    return scope[from];
}

function log(...params) {
    console.log('logged', JSON.stringify(params));
    return params;
}

function sum(a, b) {
    return a + b;
}
