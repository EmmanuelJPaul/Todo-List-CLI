class Todo{
    constructor() {
        // Set Reader
        this.fs = require('fs');
        // Path for todo.txt file
        this.TODO_FILE_PATH = 'todo.txt';
        // Path for done.txt file
        this.DONE_FILE_PATH = 'done.txt';
        // Create File if doesn't exist 
        if (!this.fs.existsSync(this.TODO_FILE_PATH))
            this.fs.writeFile(this.TODO_FILE_PATH, '', (err) => {
                if (err) throw err;
            });
        if (!this.fs.existsSync(this.DONE_FILE_PATH))
            this.fs.writeFile(this.DONE_FILE_PATH, '', (err) => {
                if (err) throw err;
            });
        // Get data of todo.txt
        this.todo_data = this.fs.readFileSync(this.TODO_FILE_PATH).toString('utf8').split('\n');
        // Get data of done.txt
        this.done_data = this.fs.readFileSync(this.DONE_FILE_PATH).toString('utf8').split('\n');
    }

    init(command, parameter){
        switch (command) {
            case "add":
                (typeof parameter !== 'undefined') ? this.add(parameter) :
                    console.log('\x1b[91mError: Missing todo string. Nothing added!\x1b[0m');
                break;
            case "done":
                (typeof parameter !== 'undefined') ? this.done(parameter - 1) :
                    console.log('\x1b[91mError: Missing NUMBER for marking todo as done.\x1b[0m');
                break;
            case "del":
                (typeof parameter !== 'undefined') ? this.del(parameter - 1) :
                    console.log('\x1b[91mError: Missing NUMBER for deleting todo.\x1b[0m');
                break;
            case "help":
                this.help();
                break;
            case "ls":
                this.list();
                break;
            case "report":
                this.report();
                break;
            default:
                this.help();
                break;
        }
    }

    add(todo) {
        let br = this.todo_data[0] !== '' ? '\n' : ''; 
        this.fs.appendFileSync(this.TODO_FILE_PATH, br + todo);
        console.log(`\u001b[32mAdded todo: "${todo}"\x1b[0m`);
    }

    done(index){
        if (typeof this.todo_data[index] !== 'undefined') {
            // Get Todo-item
            let todo_item = this.todo_data[index];
            // Add todo-item to the done.txt
            let date = new Date();
            let done_item = `x ${date.toISOString().slice(0, 10)} ${todo_item}`; 
            let br = this.done_data[0] !== '' ? '\n' : ''; 
            this.fs.appendFileSync(this.DONE_FILE_PATH, br + done_item);
            // Remove todo-item
            this.del(index, false);
            console.log(`\u001b[32mMarked todo #${index + 1} as done.\x1b[0m`);
        } else {
            console.log(`\x1b[91mError: todo #${index + 1} does not exist.\x1b[0m`);
        }
    }

    del(index, flag = true){
        if (typeof this.todo_data[index] !== 'undefined') {
            // Delete Todo (Line/Index)
            this.todo_data.splice(index, 1);
            // Re-write the todo.txt
            this.fs.writeFileSync(this.TODO_FILE_PATH, this.todo_data.join('\n'));
            flag === true ? console.log(`\u001b[33mDeleted todo #${index + 1}\x1b[0m`) : '';
        }else{
            console.log(`\x1b[91mError: todo #${index + 1} does not exist. Nothing deleted.\x1b[0m`);
        }
    }

    help(){
        console.log('Usage :-');
        console.log('$ ./todo add "todo item"  # Add a new todo');
        console.log('$ ./todo ls               # Show remaining todos');
        console.log('$ ./todo del NUMBER       # Delete a todo');
        console.log('$ ./todo done NUMBER      # Complete a todo');
        console.log('$ ./todo help             # Show usage');
        console.log('$ ./todo report           # Statistics');
    }

    list(){
        let lenght = this.todo_data.length;
        this.todo_data.reverse().forEach((element) => {
            (element !== '') ? console.log(`[${lenght--}] ${element}`) :
                console.log('\u001b[32mThere are no pending todos!\x1b[0m');
        });
    }

    report(){
        let date = new Date();
        console.log(`${date.toISOString().slice(0, 10)} Pending : ${this.todo_data.length} Completed : ${this.done_data.length}`);
    }

}
let obj = new Todo();
obj.init(process.argv[2], process.argv[3]);


