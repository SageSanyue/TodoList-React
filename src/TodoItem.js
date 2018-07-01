import React, { Component } from 'react';
import './TodoItem.css'

export default class TodoItem extends Component {
    render(){
        return (
            <div className="TodoItem">
              <label className={this.props.todo.status === 'completed' ? "checked" : null}>
                <svg className="icon" aria-hidden="true"
                    onClick={this.toggle.bind(this)}
                    checked={this.props.todo.status === 'completed'}>
                     <use xlinkHref="#icon-choose"></use>
                </svg>
                
              </label>
                <span className={this.props.todo.status === 'completed' ? "checked title" : "title"}>
					{this.props.todo.title}
				</span>
                <svg className="icon" aria-hidden="true" onClick={this.delete.bind(this)}>
                    <use xlinkHref="#icon-bin"></use>
                </svg>
            </div>
        )
    }
    toggle(e){
        this.props.onToggle(e,this.props.todo)
    }
    delete(e){
        this.props.onDelete(e,this.props.todo)
    }
}