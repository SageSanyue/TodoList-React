import React from 'react'

export default function(props){
    return (
        <form className="signUp" onSubmit={props.onSubmit}> {/* 注册*/}
            <div className="row">
                {/*<label>邮箱</label>*/}
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-email"></use>
                </svg>
                <input type="text" placeholder="邮箱" value={props.formData.email}
                onChange={props.onChange.bind(null, 'email')}/>
            </div>
            <div className="row">
                {/*<label>用户名</label>*/}
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-user"></use>
                </svg>
                <input type="text" placeholder="用户名（3-10位）"
                 value={props.formData.username}
                onChange={props.onChange.bind(null, 'username')}/>
                {/* bind 不仅可以绑定 this，还可以绑定第一个参数 */}
            </div>
            <div className="row">
                {/*<label>密码</label>*/}
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-lock"></use>
                </svg>
                <input type="password" 
                autoFocus="autofocus" 
                placeholder="密码（6-15位）" 
                value={props.formData.password}
                onChange={props.onChange.bind(null, 'password')}/>
            </div>
            <div className="row actions">
                <button type="submit">注册</button>
            </div>
        </form>
    )
}