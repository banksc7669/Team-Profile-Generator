const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

const team = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
function ask() {
    inquirer
        .prompt({
            type: "confirm",
            message: "Add new member",
            name: "add"
        })
        .then(answer => {
            if (answer.add === true) {
                addMember();
            }
            else { renderFile() };
        })
}

function addMember() {
    const empQuestions = [{
        type: "list",
        name: "role",
        message: "Type of employee to be added?",
        choices: ["Engineer", "Intern"]
    },
    {
        type: "input",
        message: "Employee's name?",
        name: "name"
    },
    {
        type: "input",
        message: "Employee's id?",
        name: "id"
    },
    {
        type: "input",
        message: "Employee's e-mail address?",
        name: "email"
    }
    ];

    inquirer
        .prompt(empQuestions)
        .then(function (answers) {
            switch (answers.role) {
                case "Engineer":
                    inquirer
                        .prompt({
                            type: "input",
                            message: "Engineer's Github username?",
                            name: "github"
                        })
                        .then(function (answer) {
                            const addEngineer = new Engineer(answers.name, answers.id, answers.email, answer.github);
                            addEngineer.role = answers.role;
                            team.push(addEngineer);
                            ask();
                        })

                    break;

                case "Intern":
                    inquirer
                        .prompt({
                            type: "input",
                            message: "Intern's school?",
                            name: "school"
                        })
                        .then(function (answer) {
                            const addIntern = new Intern(answers.name, answers.id, answers.email, answer.school);
                            addIntern.role = answers.role;
                            team.push(addIntern);
                            ask();
                        })

                    break;
            }
        })
}
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!
function init(){
    const mgrQuestions = [{type: "input",
                        message: "Manager's name?",
                        name: "name"
                    },
                    {type: "input",
                    message: "Manager's e-mail address?",
                    name: "email"
                   },
                   {type: "input",
                    message: "Manager's id?",
                    name: "id"
                   },
                   {type: "input",
                    message: "Manager's office number?",
                    name: "officeNumber"
                   }
];
    inquirer
        .prompt(mgrQuestions)
        .then(answers=>{
            const teamMgr =new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            teamMgr.role='Manager';
            team.push(teamMgr);
            addMember();
        })
}
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.
init();

function renderFile(){
    fs.writeFileSync(outputPath, render(team),"utf-8");
}
// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```