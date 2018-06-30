import React, { Component } from 'react';
import './UserDialog.css'
import {signUp, signIn, sendPasswordResetEmail} from './leanCloud'
//import SignUpForm from './SignUpForm'
//import SignInForm from './SignInForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import SignInOrSignUp from './SignInOrSignUp'
export default class UserDialog extends Component{
    constructor(props){  
        super(props)
        this.state = {
            
            selectedTab: 'signInOrSignUp', //'forgotPassword'
            formData: {
                email: '',
                username: '',
                password: '',
            }
        }
    }
    
    signUp(e){
        e.preventDefault()
        let {email,username, password} = this.state.formData
        let isLeagal = this.checkFormData.call(this, email, username, password) //先验证，再向服务器提交
        if (isLeagal === false){
            return
        }
        let success = (user)=>{
            //console.log(user)
            this.props.onSignUp.call(null,user)
        }
        let error = (error)=>{
            //alert.log(error)
            switch(error.code){
                case 200:
                    alert('没有提供用户名，或者用户名为空。')
                    break
                case 201:
                    alert('没有提供密码，或者密码为空。')
                    break
                case 202:
                    alert('用户名已经被占用。')
                    break
                case 203:
                    alert('电子邮箱地址已经被占用。')
                    break
                case 204:
                    alert(' 没有提供电子邮箱地址。')
                    break
                case 217:
                    alert('无效的用户名，不允许空白用户名。')
                    break
                case 125:
                    alert('电子邮箱地址无效,请填入类似xx@xx.com的格式。')
                    break
                default: 
                    alert(error)
                    break
            }
        }
        signUp(email, username, password, success, error)
    }
    signIn(e){
        e.preventDefault()
        let {username, password} = this.state.formData
        let success = (user)=>{
            //console.log(user)
            this.props.onSignIn.call(null,user)
        }
        let error = (error)=>{
            //alert.log(error)
            switch(error.code){
                case 210:
                    alert('用户名或密码错误。')
                    break
                case 211:
                    alert('找不到用户。')
                    break
                case 219:
                    alert('登录失败次数超过限制，请稍候再试，或者通过忘记密码重设密码。')
                    break
                default:
                    alert(error)
                    break
            }
        }
        signIn(username, password, success, error)
    }

    checkFormData(email,username,password){
		let regEmail = new RegExp("^\\w+@[\\w-]+\\.+[\\w]")
		let regUsername = new RegExp("\\w{3,10}")
		let regPassword = new RegExp("\\w{6,15}")
		if(!regEmail.test(email)){
			alert('邮箱地址至少包含@')
			return false
		}else if(!regUsername.test(username)){
			alert('用户名长度为3~10个字符')
			return false
		}else if(!regPassword.test(password)){
			alert('密码长度为6~15个字符')
			return false
		}
		return true
	}

    changeFormData(key,e){
        let stateCopy = JSON.parse(JSON.stringify(this.state))  // 用 JSON 深拷贝
        
        stateCopy.formData[key] = e.target.value
        this.setState(stateCopy)
    }
    render(){
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                {
                    this.state.selectedTab === 'signInOrSignUp' ? 
                <SignInOrSignUp
                formData={this.state.formData}
                onSignIn={this.signIn.bind(this)}
                onSignUp={this.signUp.bind(this)}
                onChange={this.changeFormData.bind(this)}
                onForgotPassword={this.showForgotPassword.bind(this)}
                />
                :
                <ForgotPasswordForm
                   formData={this.state.formData}
                   onSubmit={this.resetPassword.bind(this)}
                   onChange={this.changeFormData.bind(this)}
                   onSignIn={this.returnToSignIn.bind(this)}
                />
                }
                </div>
            </div>
            )
        }
        showForgotPassword(){
            let stateCopy = JSON.parse(JSON.stringify(this.state))
            stateCopy.selectedTab = 'forgotPassword'
            this.setState(stateCopy)
        }
        returnToSignIn(){
            let stateCopy = JSON.parse(JSON.stringify(this.state))
            stateCopy.selectedTab = 'signInOrSignUp'
            this.setState(stateCopy)
        }
        resetPassword(e){
            e.preventDefault()
            sendPasswordResetEmail(this.state.formData.email)
        }
    }


