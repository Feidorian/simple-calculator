import React, { Component } from 'react';
import './App.css';
import Result from './components/Result';
import KeyPad from "./components/KeyPad";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { result: "" };
        this.keys = {
            "(": () => this.onKey("("), "CE": () => this.del(), ")": () => this.onKey(")"), "C": () => this.clr(),
            "1": () => this.onKey("1"), "2": () => this.onKey("2"), "3": () => this.onKey("3"), "+": () => this.onKey("+"),
            "4": () => this.onKey("4"), "5": () => this.onKey("5"), "6": () => this.onKey("6"), "-": () => this.onKey("-"),
            "7": () => this.onKey("7"), "8": () => this.onKey("8"), "9": () => this.onKey("9"), "*": () => this.onKey("*"),
            ".": () => this.onKey("."), "0": () => this.onKey("0"), "=": () => this.eval(), "/": () => this.onKey("/")
        }

        // number definition
        this.number = /^([+-]?\d*\.*\d+)$/
        // parenthesis expression definition
        this.parenth = /\(([^)|()]+)\)/
        // exponent expression definition
        this.expo = /([+-]?)(\d*\.*\d+)\*\*([+-]?\d*\.*\d+)/
        // multiplication or division  expression definition
        this.multDiv = /([+-]?\d*\.*\d+)(\*|\/)([+-]?\d*\.*\d+)/
        // addition or subtraction expression definition
        this.addSub = /([+-]?\d*\.*\d+)(\+|-)([+-]?\d*\.*\d+)/
        // for ()() => ()*()
        this.numParenFix1 = /(\))(\d)/
        // for N() => N*()
        this.numParenFix2 = /(\d)(\()/
        // for ()N => ()*N
        this.parenParenFix = /(\))(\()/
    }

    // Assist from JS eval to solve unit operation
    // Because eval is so unpredictable, 
    solve(str) {
        return eval(str)
    }

    // Test suit for test cases. Activated with hidden div input
    // when hidden div is enabled, enter "=" in the input to run tests
    test() {
        let testArr = [
            "14+18/2*18-7=169", "10-9*24/8*6=-152", "10/5+10-9*11=-87", "3*19*14+8/2=802", "10*12-14/2+15=128",
            "15*18+12/3+9=283", "14/2-1+3=9", "9+15/5*13=48", "12/3*12+10=58", "8/4*2+18=22", "18/6+4*15=63",
            "8*4+9-9+18=50", "2-20/5*3=-10", "(6+4)**2+(11+10/2)=116", "(11+42-5)-(11-4)=41", "(17-3)(14-6)-22=90",
            "11*11-6*17+4=23", "(9+33-6)/6-3**2=-3", "(10+43-5)/6+5**2=33", "2(9*5+3**2)+4=112", "(6+3)**2+(9-10/5)=88",
            "2-1+5*4*11=221", "(10+59-3**2)/(24-4)=3", "4(12*6-4**2)+9=233", "(19-8)(10+4)+8**2=218", "16*7*15+11+17=1708",
            "16*15/5+12=60", "2*10+10-8=22", "24/4+14*2=34", "11*10-12/3=106", "8/2(2+2)=16", "(13+7)/(2**3-3)*4=16",
            "-5.0=-5", "+5.0=5", "-.3=-0.3", "+.3=0.3", "-3(5)**2+2(4-18)+33=-70", "2(7+8)**2-12(6(2))=306",
            "(-11+(-18/-9))*-3**2--6=87", "(-4**2+-9*-4)--10+-9=21", "(-5**3+-6*-5)--4+-6=-97", // some complex ones 
            "5.=ERROR", "-5.=ERROR", "+5.=ERROR", "++4=ERROR", "+-4=ERROR", "1+++2=ERROR", "1+-+2=ERROR"
        ]

        let total = testArr.length;
        let passed = 0;

        testArr.forEach((item) => {
            let [test, res] = item.split("=");
            if (res === this.run(test).toString()) passed++;
            // debug: else console.log("\n\n" +item+ "\n\n")
        });
        this.updateState(`${passed} passed of ${total}`);

    }

    // lex and parse input 
    run(input) {
        let match = null;

        // parenthesis fix: js eval does not understand the expression (number)(number)
        // So tokenize it into (number)*(number)
        if ((match = input.match(this.parenParenFix))) {
            input = input.replace(this.parenParenFix, `${match[1]}*${match[2]}`);
            return this.run(input);
        }

        // parenthesis fix: js eval does not understand the expression (number)number
        // So tokenize it into (number)*number
        else if ((match = input.match(this.numParenFix1))) {
            // debug: console.log(`${match[0]}, ${match[1]}, ${match[2]}`)
            input = input.replace(this.numParenFix1, `${match[1]}*${match[2]}`);
            return this.run(input);
        }

        // parenthesis fix: js eval does not understand the expression number(number)
        // So tokenize it into number*(number)
        else if ((match = input.match(this.numParenFix2))) {
            // debug: console.log(`${match[0]}, ${match[1]}, ${match[2]}`) 
            input = input.replace(this.numParenFix2, `${match[1]}*${match[2]}`);
            return this.run(input)
        }

        // left to right: parse the next parenthesis expression 
        else if ((match = input.match(this.parenth))) {
            // debug: console.log(`!Parenthesis matchStr: ${match[0]}  matchCaptures: ${match.slice(1)}`) 
            let expr1 = match[1];
            let res = this.run(expr1)
            // evaluation resulting in a postive number losses the sign
            // this is bad for expressions that require sign preservation. i.e 2-3+7 (eval -3+7 = 4, sign is lost, result = 24)
            // so manually append the positive sign to positive numbers 
            res = (Math.sign(res) === 1) ? `+${res}` : res;
            //eval only keeps sign for negatives
            input = input.replace(this.parenth, res);
            // debug: console.log(`!Parenth  result: ${res} newOutput: ${input}`)
            return this.run(input);
        }

        // left to right: parse exponential expression
        else if ((match = input.match(this.expo))) {
            // debug: onsole.log(`!Exponent matchStr: ${match[0]}  matchCaptures: ${match.slice(1)}`) 
            let [expr1, expr2, expr3] = match.slice(1);
            [expr2, expr3] = this.elimZero([expr2, expr3]) // eliminate leading zeros from argument 
            //evaluation of a postive number losses the sign
            let res = this.solve(`${expr1}(${expr2} ** ${expr3})`)
            res = (Math.sign(res) === 1) ? `+${res}` : res; //eval only keeps sign for negatives
            input = input.replace(this.expo, res);
            // debug: console.log(`!Exponent  result: ${res} newOutput: ${input}`)
            return this.run(input);
        }
        // left to right: parse multiplication and division 
        else if ((match = input.match(this.multDiv))) {
            let [expr1, expr2] = this.elimZero([match[1], match[3]])
            // debug: let msg = (match[2] === "*") ? "!Multiplication" : "!Division";
            // debug: console.log(`${msg} matchStr: ${match[0]}  matchCaptures: ${match.slice(1)}`) */

            //evaluation of a postive number losses the sign
            let res = this.solve(`${expr1} ${match[2]} ${expr2}`)
            res = (Math.sign(res) === 1) ? `+${res}` : res; //eval only keeps sign for negatives
            input = input.replace(this.multDiv, res);
            // debug: console.log(`${msg}  result: ${res} newOutput: ${input}`)
            return this.run(input);
        }
        // left to right: parse addition and subtraction 
        else if ((match = input.match(this.addSub))) {
            let [expr1, expr2] = this.elimZero([match[1], match[3]]);
            // debug: let msg = (match[2] === "-") ? "!Subtraction" : "!Addition";
            // debug: console.log(`${msg} matchStr: ${match[0]}  matchCaptures: ${match.slice(1)}`) 
            //evaluation of a postive number losses the sign
            let res = this.solve(`${expr1} ${match[2]} ${expr2}`)
            res = (Math.sign(res) === 1) ? `+${res}` : res; //eval only keeps sign for negatives
            input = input.replace(this.addSub, res);
            // debug: console.log(`${msg}  result: ${res} newOutput: ${input}`)
            return this.run(input);
        }

        // parse input as a number 
        // if input made it here, it's either a number or invalid, so match entire string
        else if ((match = input.match(this.number))) {
            // debug: console.log(`Number  matchStr: ${match[0]} matchCaptures: ${match.slice(1)}`)  
            let numb = this.elimZero([match[1]]);
            let res = this.solve(numb);
            // debug: console.log(`!Number result: ${res} newOutput: ${res}`)
            return Number(res); // nomalize number : (+5 => 5) and (.5 => 0.5)
        }

        // input could not be parsed and evaluated in a way that resulted in a number, therefore is invalid 
        else return "ERROR";

    }

    // so JS eval hates leading 0's. We'll make them disappear here, before spoon feeding it the numbers
    elimZero(list) {
        let match = null;
        return list.map((number) => {
            let zCantLead = /^([+-]?)0+(?=(:?0\.\d|\d))(.+)/
            number = ((match = number.match(zCantLead))) ? `${match[1]}${match[3]}` : number
            return number; 
        })
    }

    clr() { this.updateState(""); }

    del() {
        let newInput = (this.state.result === "ERROR") ? "" : this.state.result.slice(0, -1);
        this.updateState(newInput);
    }

    onKey(key) { this.updateState(this.state.result + key); }

    updateState(newInput) { this.setState({ result: newInput.toString() }); }

    eval() {
        let str = this.state.result;
        if (str === "") return;
        this.updateState(this.run(str));
        // debug: console.log("\n\n"); 
    }


    render() {
        return (
            <div>
                <div className="calculator-body">
                    <div className="container-fluid position-absolute top-50 start-50 translate-middle">
                        <h1 className="text-center">Basic Calculator</h1>
                        <div className="row g-0 row-cols-4 justify-content-center w-25 h-100 mx-auto border border-3 border-dark frame">
                            <Result input={this.state.result} />
                            <KeyPad keys={this.keys} />
                        </div>

                        {/* Text input for fast expression testing (copy/paste evaluation + test cases). currrently hidden, enable to use.*/}
                        <div hidden className="row mx-auto w-25 mt-3"><input onChange={(event) => {
                            // run test cases 
                            if (event.target.value.includes("=")) this.test();
                            // evaluate expression from the input
                            else if (event.target.value.includes("_")) this.eval();
                            // copy values from input to calculator 
                            else this.updateState(event.target.value.replace(/\s/g, ""))
                        }} />
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


export default App;