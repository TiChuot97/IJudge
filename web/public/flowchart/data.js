var MENU = [
    ["Control Flow", [
	["If Exit Code", "if_exitcode"],
	["If File Exists", "if_file"],
	["Any", "or"],
    ]],
    ["Execution", [
	["Run Command", "exec"],
	["Evaluate", "eval"]
    ]],
    ["Comparison", [
	["Compare", "cmp"]
    ]],
    ["Input/Output", [
	["File", "file"],
	["Output", "output"]
    ]]
]

var NODES = {
    "if_exitcode": {
        op: "if_exitcode",
        style: 2,
	    height: 55, width: 300,
	    fill: "rgb(255, 235, 148)", shadowX: 4,
	    content: 
`
<div style = "font-family: Monospace">
    If Exit Code
    <select>
        <option value = "=">=</option>
        <option value = "<>">&lt;&gt;</option>
        <option value = "<">&lt;</option>
        <option value = ">">&gt;</option>
	    <option value = "<=">&lt;=</option>
        <option value = ">=">&gt;=</option>
    </select>
    <input type = "number", style = "width: 60">
</div>
`
    },

    "if_file": {
        op: "if_file",
        style: 2, height: 55, width: 300,
        fill: "rgb(255, 235, 148)", shadowX: 4,
        content: 
`
<div style = "font-family: Monospace">
    File <input size = 12> Exists
</div>
`
    },

    "or": {
        op: "or",
        style: 1, width: 40, height: 40,
        fill: "rgb(174, 133, 232)", pipeCount: 1000
    },

    "exec": {
        op: "exec",
        height: 50, width: 280,
        fill: "rgb(255, 160, 160)",
        content: 
`
<div style = "font-family: Monospace">
    Run <input type = "text" size = 24> 
</div>
`
    },

    "eval": {
        op: "eval", width: 360, height: 220,
        fill: "rgb(255, 160, 160)",
        content:
`
<div style = "font-family: Monospace">
    Evaluate <input type = "text" size = 28> <br>
    |- Running Time: <input type = "text" size = 8> 
    <select>
       <option value = "ms">ms</option>
       <option value = "s">s</option>
       <option value = "us">us</option>
    </select>
    <br>
    |- Memory Limit: <input type = "text" size = 8>
    <select>
       <option value = "b">bytes</option>
       <option value = "kb">KB</option>
       <option value = "m">MB</option>
    </select>
    <br>
    |- Redirection:
    <br>
    |--- stdin : <input type = "text" size = 12> <br>
    |--- stdout: <input type = "text" size = 12> <br>
    |--- stderr: <input type = "text" size = 12>
    <br>
    |- Output Format: 
    <select>
        <option value = "json"> JSON </option>
        <option value = "text"> Plain Text </option>
        <option value = "verbose"> Human Friendly </option>
    </select>
</div>
`
    },

    "cmp": {
        op: "cmp", width: 400, height: 160,
        fill: "rgb(255, 235, 148)", shadowX: 4,
        content:
`
<div style = "font-family: Monospace">
    Compare (<input type = "text" size = 8> , <input type = "text" size = 8>) <br>
    |- Ignore spaces: <br>
    |--- Leading: 
    <select>
        <option value = "yes">YES</option>
        <option value = "no" selected="selected">NO</option>
    </select>
    Trailing:
    <select>
        <option value = "yes">YES</option>
        <option value = "no">NO</option>
    </select> <br>
    |- Ignore empty lines: <br>
    |--- Begining:
    <select>
        <option value = "yes">YES</option>
        <option value = "no" selected="selected">NO</option>
    </select>
    End:
    <select>
        <option value = "yes">YES</option>
        <option value = "no">NO</option>
    </select> <br>
    |- Output Format: 
    <select>
        <option value = "--print-json"> JSON </option>
        <option value = "--print-raw"> Plain Text </option>
	<option value = "--print-verbose"> Verbose </option>    
    </select>
</div>
`
    },

    "file": {
        op: "file",
        rx:30, ry:30, style: 0, height:50, width: 225,
        fill: "rgb(147, 181, 233)",
        content: 
`
<div style = "font-family: Monospace">
File <input size = 16/>
</div>
`
    },

    /*["Input", {
        op: "input",
        rx:30, ry:30, style: 0, height:40, width:100,
        fill: "rgb(100, 200, 100)",
        contentX: 27,
        content: 
`
<div style = "font-family: Monospace">
INPUT
</div>
`
    }],*/

    "output": {
        op: "output",
        rx:30, ry:30, style: 0, height:40, width:100,
        fill: "rgb(188, 88, 188)",
        contentX: 20,
        content:
`
<div style = "font-family: Monospace">
OUTPUT
</div>
`
    }
};
