import React from 'react'
import { Link } from 'react-router-dom';
import '../../styles.css'

function Login() { 
    return (
    <div className="page-container">
      <h1 className="main-title">SMART SCHOOL BUS</h1>
      <div className="login-container">
        <h2 className="form-title">ĐĂNG NHẬP</h2>
        <form>
          <div className="input-group">
            <label htmlFor="username">Tên đăng nhập:</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input type="password" id="password" name="password" />
          </div>
          <Link to="/dashboard/parents" className="login-button" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Đăng Nhập
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login