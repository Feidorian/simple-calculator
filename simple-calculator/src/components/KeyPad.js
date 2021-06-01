import React, {Component} from 'react';

class KeyPadComponent extends Component {

    render() {
            return (
                <div className="col w-100 h-25">
                    <div className="btn-toolbar">
                            <div className="btn-group btn-group-lg border rounded-0 w-100 h-100 " role="group">
                            <button className="btn btn-light fs-1 w-25 h-100 op-buttons"
                                type="button" name="(" onClick={this.props.keys["("]}>(</button>
                            <button className="btn btn-light fs-1 w-25 h-100 op-buttons"
                                type="button" name="CE" onClick={this.props.keys["CE"]}>CE</button>
                            <button className="btn btn-light fs-1 w-25 h-100 op-buttons"
                                type="button" name=")" onClick={this.props.keys[")"]}>)</button>
                            <button className="btn btn-light fs-1 w-25 h-100 op-buttons"
                                type="button" name="C" onClick={this.props.keys["C"]}>C</button></div>
                            <div className="btn-group btn-group-lg border rounded-0 w-100 h-100" role="group">
                            <button className="btn btn-light fs-1 w-25 h-100 num-buttons"
                                name="1" type="button " onClick={this.props.keys["1"]}>1</button>
                            <button className="btn btn-light w-25 fs-1 h-100 num-buttons" type="button"
                                name="2"  onClick={this.props.keys["2"]}>2</button>
                            <button className="btn btn-light w-25 fs-1 h-100 num-buttons" type="button"
                                name="3"  onClick={this.props.keys["3"]}>3</button>
                            <button className="btn btn-warning w-25 fs-1 h-100 " type="button"
                                name="+"  onClick={this.props.keys["+"]}>+</button></div>
                            <div className="btn-group btn-group-lg border rounded-0 w-100 h-100" role="group">
                            <button className="btn btn-light fs-1 w-25 h-100 num-buttons" type="button"
                                name="4" onClick={this.props.keys["4"]}>4</button>
                            <button className="btn btn-light w-25 fs-1 h-100 num-buttons" type="button"
                                nmae="5" onClick={this.props.keys["5"]}>5</button>
                            <button className="btn btn- w-25 fs-1 h-100 num-buttons" type="button"
                                name="6" onClick={this.props.keys["6"]}>6</button>
                            <button className="btn btn-warning w-25 fs-1 h-100" type="button"
                                name="-" onClick={this.props.keys["-"]}>−</button></div>
                            <div className="btn-group btn-group-lg border rounded-0 w-100 h-100" role="group">
                            <button className="btn btn-light fs-1 w-25 h-100 num-buttons" type="button"
                                name="7" onClick={this.props.keys["7"]}>7</button>
                            <button className="btn btn-light w-25 fs-1 h-100 num-buttons" type="button"
                                name="8" onClick={this.props.keys["8"]}>8</button>
                            <button className="btn btn-light w-25 fs-1 h-100 num-buttons" type="button"
                                name="9" onClick={this.props.keys["9"]}>9</button>
                            <button className="btn btn-warning w-25 fs-1 h-100" type="button"
                                name="di" onClick={this.props.keys["*"]}>×</button></div>
                            <div className="btn-group btn-group-lg border rounded-0 w-100 h-100" role="group">
                            <button className="btn btn-light fs-1 w-25 h-100 num-buttons" type="button"
                                name="." onClick={this.props.keys["."]}>.</button>
                            <button className="btn btn-light w-25 fs-1 h-100 num-buttons" type="button"
                                name="0" onClick={this.props.keys["0"]}>0</button>
                            <button className="btn btn-warning h-100 w-25 fs-1" type="button"
                                name="=" onClick={this.props.keys["="]}>=</button>
                            <button className="btn btn-warning w-25 h-100 fs-1" type="button"
                                name="÷" onClick={this.props.keys["/"]}>÷</button></div>
                    </div>
                </div>
    
                
            );
        }
}


export default KeyPadComponent;