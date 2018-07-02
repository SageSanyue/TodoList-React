import React, { Component } from 'react';
import './App.css';
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import 'normalize.css'
import './reset.css'
//import * as localStore from './localStore'
import UserDialog from './UserDialog'
import {getCurrentUser, signOut, TodoModel} from './leanCloud'



class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      user: getCurrentUser() || {}, //用户进入页面时，读取上次登录的 user
      newTodo: '',
      //todoList: localStore.load('todoList') || []
      todoList:[]
    }
    let user = getCurrentUser()
    if(user){
     
     /* TodoModel.getByUser(user,(todos) => {
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todoList = todos
        this.setState(stateCopy)
      })*/
      let success = (list)=>{
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todoList = list
        this.setState(stateCopy)
      }
      let error = (error)=>{
        console.log(error)
      }
      TodoModel.getByUser(user,success,error)
    }
  }
  render() {

    let todos = this.state.todoList
    .filter((item)=>!item.deleted)
    .map((item,index)=>{
      return (
      <li key={index}>
        <TodoItem todo={item} onToggle={this.toggle.bind(this)}
                  onDelete={this.delete.bind(this)} />
      </li>
      )
    })
    //console.log(todos)

    return (
      <div className="App">
        <div className="head">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-do"></use>
          </svg>
          <h1>
            {this.state.user.username||'我'}
            的待办
            
          </h1>
          {this.state.user.id ?
          <svg className="icon" aria-hidden="true" onClick={this.signOut.bind(this)}>
            <use xlinkHref="#icon-logout"></use>
          </svg>: null}
        </div>

        <div className="things">
          <ol className="todoList">
            {todos}
          </ol>
          
        </div>

        <div className="inputWrapper">
          <svg className="icon" 
            onClick={this.addTodo.bind(this)}
						value={this.state.newTodo}>
            <use xlinkHref="#icon-add"></use>
          </svg>
          <TodoInput content={this.state.newTodo}
                    onChange={this.changeTitle.bind(this)}
                    onSubmit={this.addTodo.bind(this)} />
        </div>

        {this.state.user.id ?
          null :
            <UserDialog 
            onSignUp={this.onSignUpOrSignIn.bind(this)}
            onSignIn={this.onSignUpOrSignIn.bind(this)}
            />
        }
      </div>
      
    )
  }

  signOut(){
    signOut()  //此处signOut是属性，不是变量。里面的signOut()是调用的src/leanCloud.js里的方法，外层的是定义的父组件里的方法。
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    stateCopy.todoList = []
    this.setState(stateCopy)
  }

  onSignUpOrSignIn(user){
    //this.state.user = user
    //this.setState(this.state)
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)

    if(user){
			let success = (list)=>{
				let stateCopy = JSON.parse(JSON.stringify(this.state))
				stateCopy.todoList = list
				this.setState(stateCopy)
			}
			let error = (error)=>{
				console.log(error)
			}
			TodoModel.getByUser(user, success, error)
		}
  }

  componentDidUpdate(){
    //localStore.save('todoList',this.state.todoList)
  }
  toggle(e,todo){
    let oldStatus = todo.status
    todo.status = todo.status === 'completed' ? '' : 'completed'
    //this.setState(this.state)
    TodoModel.update(this.state.user, todo, ()=>{
      this.setState(this.state)
    },(error)=>{
      todo.status = oldStatus
      this.setState(this.state)
    })
  }

  changeTitle(event){
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
    
  }

  addTodo(event){
    //console.log('要添加一个todo')
    //this.state.todoList.push({
     // id: idMaker(),
     if(this.state.newTodo === ''){
       return
     }
     let newItem = {
       title: this.state.newTodo,
       status: '',
       deleted: false
     }
     /*let newTodo = {
      title: event.target.value,
      status: '',
      deleted: false
    }*/

   let success = (objId)=>{
      newItem.id = objId
      this.state.todoList.push(newItem)
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
      console.log('已添加')
    }
    let error = (error)=>{
      console.log(error)
    }
    TodoModel.create(newItem,this.state.user,success,error)
  }
    /*TodoModel.create(newTodo, (id) => {
      newTodo.id = id
      this.state.todoList.push(newTodo)
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    },(error)=>{
      console.log(error)
    })
  }*/
  delete(event,todo){
    /*TodoModel.destroy(todo.id, ()=>{
      todo.deleted = true
      this.setState(this.state)
    })*/
    TodoModel.destroy(this.state.user, todo, ()=>{
      todo.deleted = true
      this.setState(this.state)
    }) 
  }
}

export default App;
