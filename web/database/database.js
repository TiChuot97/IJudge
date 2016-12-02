var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'ijudge'
});

connection.connect(function(err) {
    if (err) throw err;
});

function add_sample_by_id(sample, data) {
    var id = data[0].id;
    var table_name = id + '_sample';

    connection.query('CREATE TABLE IF NOT EXISTS ' + table_name + '(id int primary key auto_increment, input varchar(255), output varchar(255))',
        function(err) {
            if (err) throw err;
        });

    for (var key in sample) {
        connection.query('INSERT INTO ' + table_name + ' (input, output) value (?, ?);',
            [sample[key]['input'], sample[key]['output']], function (err) {
                if (err) throw err;
            });
    }
}

function add_sample_cases(sample) {
    connection.query('SELECT id FROM problems WHERE id = (SELECT max(id) FROM problems)', function(err, res) {
        if (err) throw err;
        add_sample_by_id(sample, res)
    });
}

function add_problem(name, time, memory, description, author) {
    connection.query('CREATE TABLE IF NOT EXISTS problems(id int primary key auto_increment, name varchar(255), ' +
        'time varchar(255), memory varchar(255), description varchar(4095), author varchar(50))', function(err) {
        if (err) throw err;
    });

    connection.query('INSERT INTO problems (name, time, memory, description, author) value (?, ?, ?, ?, ?);',
        [name, time, memory, description, author], function(err){
        if (err) throw err;
    });
}

function get_sample_cases(callback, data, result) {
    var id = data[0].id;

    connection.query('SELECT * FROM ' + (id + '_sample'), function(err, res) {
        if (err) throw err;
        callback(data, res, result);
    });
}

function get_problem(id, callback, result) {
    connection.query('CREATE TABLE IF NOT EXISTS problems(id int primary key auto_increment, name varchar(255), ' +
        'time varchar(255), memory varchar(255), description varchar(4095), author varchar(50))', function(err) {
        if (err) throw err;
    });

    connection.query('SELECT * FROM problems WHERE id = ?', [parseInt(id)], function(err, res) {
        if (err) throw err;
        get_sample_cases(callback, res, result);
    });
}

function get_all_problem(callback, result, num_page) {
    connection.query('CREATE TABLE IF NOT EXISTS problems(id int primary key auto_increment, name varchar(255), ' +
        'time varchar(255), memory varchar(255), description varchar(4095), author varchar(50))', function(err) {
        if (err) throw err;
    });

    connection.query('SELECT id, name FROM problems', function(err, res) {
        if (err) throw err;
        callback(res, result, num_page);
    });
}

function get_hash_user(callback, username, password, result) {
    connection.query('CREATE TABLE IF NOT EXISTS users(id int primary key auto_increment, username varchar(50), ' +
        'hash varchar(255), admin int)', function(err) {
        if (err) throw err;
    });

    connection.query('SELECT * FROM users WHERE username = ?', username, function(err, res) {
        if (err) throw err;
        callback(res, username, password, result);
    });
}

function add_user(username, hash) {
    connection.query('CREATE TABLE IF NOT EXISTS users(id int primary key auto_increment, username varchar(50), ' +
        'hash varchar(255), admin int)', function(err) {
        if (err) throw err;
    });

    connection.query('INSERT INTO users (username, hash, admin) value (?, ?, 0);', [username, hash], function(err) {
        if (err) throw err;
    });
}

function delete_problem(id) {
    connection.query('CREATE TABLE IF NOT EXISTS users(id int primary key auto_increment, username varchar(50), ' +
        'hash varchar(255), admin int)', function(err) {
        if (err) throw err;
        connection.query('DELETE FROM problems WHERE id = ?', [id], function(err) {
            if (err) throw err;
            var table_name = id + '_sample';
            console.log(table_name);
            connection.query('DROP TABLE ' + table_name, function(err) {
                if (err) throw err;
            });
        });
    });
}

function edit_problem(id, name, time, memory, description) {
    connection.query('UPDATE problems SET name = ?, time = ?, memory = ?, description = ? WHERE id = ?',
        [name, time, memory, description, id], function(err) {
        if (err) throw err;
    });
}

function edit_sample(id, sample) {
    var table_name = id + '_sample';

    connection.query('DROP TABLE ' + table_name, function(err) {
        if (err) throw err;
        connection.query('SELECT id FROM problems WHERE id = ?', [id], function(err, res) {
            if (err) throw err;
            add_sample_by_id(sample, res);
        });
    });
}

function get_last_problem(callback, result) {
    connection.query('SELECT id FROM problems WHERE id = (SELECT max(id) FROM problems)', function(err, res) {
        if (err) throw err;
        callback(res, result);
    });
}

module.exports = {
    'get_problem': get_problem,
    'add_problem': add_problem,
    'add_sample': add_sample_cases,
    'get_all_problem': get_all_problem,
    'delete_problem': delete_problem,
    'add_user': add_user,
    'get_hash_user': get_hash_user,
    'edit_problem': edit_problem,
    'edit_sample': edit_sample,
    'get_last_problem': get_last_problem,
    'connection': connection
};
