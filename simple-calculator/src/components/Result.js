import React, { Component } from 'react';


class ResultComponent extends Component {


    render() {
        // formatting to make displayed input look prettier
        // Also we get to have the exponent operator display like an exponent '^' instead of '**'
        let str = this.props.input.replaceAll("/", "÷").replaceAll("**", "^").replaceAll("*", "×");
        
    
        return (
            <div className="result w-100">
                <div className="col w-100 h-100">
                    <input className="form-control-plaintext bg-dark bg-gradient display fs-1 w-100 h-100" value={str} type="text"  readOnly placeholder=""/> 
                </div>       
            </div>
    )
        ;
    }
}


export default ResultComponent;